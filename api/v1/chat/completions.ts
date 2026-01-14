import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * OpenAI-compatible /v1/chat/completions endpoint
 * Proxies to kb.terpedia.com's backend API or OpenAI
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const payload = req.body;
    
    // Extract API key from Authorization header
    const authHeader = req.headers.authorization || '';
    
    // Extract API key
    const apiKey = authHeader?.replace('Bearer ', '') || '';
    
    // Terpedia backend URL - use GCE instance directly
    // Note: kb.terpedia.com is S3 and doesn't support POST, so we use the GCE instance
    const terpediaBackendBase = process.env.TERPEDIA_BACKEND_URL || 'http://104.197.255.123:8010';
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    
    // Check if we should use Terpedia backend
    // If model starts with "terpedia/", use Terpedia backend
    // Otherwise, use OpenAI (requires API key)
    const useTerpediaBackend = payload.model?.startsWith('terpedia/') || 
                               process.env.USE_KB_TERPEDIA === 'true';
    
    // Construct full URL for Terpedia backend
    // Remove trailing slash if present, then append /v1/chat/completions
    const terpediaBackendUrl = terpediaBackendBase.replace(/\/$/, '');
    const targetUrl = useTerpediaBackend 
      ? `${terpediaBackendUrl}/v1/chat/completions`
      : openaiUrl;
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // For Terpedia models, use baked-in API key if available, or provided key
    // For OpenAI models, use provided API key (required)
    if (useTerpediaBackend) {
      // Terpedia models: use baked-in key from env, or provided key, or none
      const terpediaKey = process.env.TERPEDIA_API_KEY || apiKey;
      if (terpediaKey) {
        headers['Authorization'] = `Bearer ${terpediaKey}`;
      }
    } else {
      // OpenAI models: require API key
      if (!apiKey) {
        res.status(401).json({
          error: {
            message: 'API key required for OpenAI models. Terpedia models use a shared key automatically.',
            type: 'invalid_request_error',
            code: 'missing_api_key'
          }
        });
        return;
      }
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Backend API error' };
      }
      
      res.status(response.status).json({
        error: errorData,
      });
      return;
    }

    // Handle streaming responses
    if (payload.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Stream the response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      }
      
      res.end();
      return;
    }

    // Non-streaming response
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    const message = (error as Error).message ?? 'Unknown error';
    res.status(500).json({
      error: {
        message,
        type: 'internal_error',
      },
    });
  }
}
