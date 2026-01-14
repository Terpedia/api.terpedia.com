# API Deployment for api.terpedia.com

## Status

✅ **Deployed to Vercel**: api.terpedia.com

## Endpoints

- `GET /v1/models` - List available OpenAI-compatible models
- `POST /v1/chat/completions` - Chat completions endpoint

## Configuration

The API can proxy to:
1. **kb.terpedia.com** - If the Python FastAPI service is running
2. **OpenAI** - As a fallback (requires user API keys)

## Environment Variables

Set in Vercel dashboard:
- `USE_KB_TERPEDIA=true` - Use kb.terpedia.com backend
- `BACKEND_API_URL` - Custom backend URL
- `FALLBACK_TO_OPENAI=true` - Fallback to OpenAI if kb.terpedia.com unavailable

## LibreChat Configuration

Updated to use api.terpedia.com:

```yaml
endpoints:
  openAI:
    baseURL: "https://api.terpedia.com/v1"
    apiKey: "user_provided"
```

## Testing

```bash
# Test models endpoint
curl https://api.terpedia.com/v1/models

# Test chat completions
curl -X POST https://api.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Next Steps

1. Configure DNS for api.terpedia.com (if not already done)
2. Set up kb.terpedia.com Python API (if using that backend)
3. Test endpoint connectivity from LibreChat
