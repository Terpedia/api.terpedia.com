import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Terpedia RDKit-specific /v1/rdkit/chat/completions endpoint
 * Forces model to terpedia/rdkit and proxies to backend
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const payload = req.body;
    
    // Force model to terpedia/rdkit
    payload.model = 'terpedia/rdkit';
    
    // Extract API key from Authorization header
    const authHeader = req.headers.authorization || '';
    const apiKey = authHeader?.replace('Bearer ', '') || '';
    
    // Terpedia backend URL
    const terpediaBackendBase = process.env.TERPEDIA_BACKEND_URL || 'http://104.197.255.123:8010';
    const terpediaBackendUrl = terpediaBackendBase.replace(/\/$/, '') + '/v1/rdkit/chat/completions';
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use baked-in API key if available, or provided key
    const terpediaKey = process.env.TERPEDIA_API_KEY || apiKey;
    if (terpediaKey) {
      headers['Authorization'] = `Bearer ${terpediaKey}`;
    }
    
    const response = await fetch(terpediaBackendUrl, {
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
