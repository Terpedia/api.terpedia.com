# API Endpoint for api.terpedia.com

OpenAI-compatible API endpoint for chat.terpedia.com to use.

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
cd api.terpedia.com
vercel --prod
```

### Option 2: Static Hosting

The API functions can be deployed as serverless functions on:
- Vercel (recommended)
- Netlify Functions
- AWS Lambda
- Cloudflare Workers

## Configuration

Set environment variable:
- `KB_TERPEDIA_API_URL`: Backend API URL (default: https://kb.terpedia.com/v1/chat/completions)

## Endpoints

- `GET /v1/models` - List available models
- `POST /v1/chat/completions` - Chat completions (OpenAI-compatible)

## Usage

After deployment, update LibreChat configuration:

```yaml
# librechat.yaml
endpoints:
  openAI:
    baseURL: "https://api.terpedia.com/v1"
    apiKey: "user_provided"
```
