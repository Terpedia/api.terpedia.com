# Terpedia Knowledge Base Integration

## Overview

The API endpoint now supports both:
1. **Terpedia Models** - Access to kb.terpedia.com knowledge base
2. **OpenAI Models** - Standard OpenAI models (proxied)

## Terpedia Models Available

### terpedia/unified
- **Description**: Auto-routing model that intelligently routes queries
- **Backend**: kb.terpedia.com
- **Use Cases**: General questions that may need KB, PubMed, or molecular analysis

### terpedia/kb
- **Description**: Direct access to Terpedia knowledge base (SPARQL)
- **Backend**: kb.terpedia.com SPARQL endpoint
- **Use Cases**: Querying structured knowledge base data

### terpedia/pubmed
- **Description**: PubMed RAG pipeline for literature-based answers
- **Backend**: kb.terpedia.com PubMed RAG
- **Use Cases**: Research questions, literature reviews, citations

### terpedia/rdkit
- **Description**: Molecular property analysis using RDKit
- **Backend**: kb.terpedia.com RDKit API
- **Use Cases**: Molecular structure analysis, SMILES processing

## How It Works

### Routing Logic

1. **Terpedia Models** (`terpedia/*`):
   - Requests routed to `https://kb.terpedia.com/v1/chat/completions`
   - Uses Terpedia's unified API backend
   - No API key required (if kb.terpedia.com doesn't require auth)

2. **OpenAI Models** (`gpt-*`):
   - Requests routed to `https://api.openai.com/v1/chat/completions`
   - Uses user's OpenAI API key
   - Standard OpenAI behavior

## Configuration

### LibreChat Configuration
```yaml
endpoints:
  openAI:
    enabled: true
    title: "Terpedia & OpenAI"
    baseURL: "https://api.terpedia.com/v1"
    apiKey: "user_provided"
    models:
      default:
        - "terpedia/unified"
        - "terpedia/kb"
        - "terpedia/pubmed"
        - "terpedia/rdkit"
        - "gpt-4o"
        - "gpt-4o-mini"
        - "gpt-4-turbo"
        - "gpt-3.5-turbo"
      fetch: false
```

## Usage Examples

### Using Terpedia Unified Model
```bash
curl -X POST https://api.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "terpedia/unified",
    "messages": [{"role": "user", "content": "What is limonene?"}]
  }'
```

### Using Terpedia KB Model (SPARQL)
```bash
curl -X POST https://api.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "terpedia/kb",
    "messages": [{"role": "user", "content": "SELECT * WHERE { ?s ?p ?o } LIMIT 10"}]
  }'
```

### Using Terpedia PubMed Model
```bash
curl -X POST https://api.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "terpedia/pubmed",
    "messages": [{"role": "user", "content": "What are the effects of terpenes?"}]
  }'
```

## Backend Requirements

For Terpedia models to work, kb.terpedia.com must:
1. Have the `openrouter_chat_api.py` service running
2. Be accessible at `https://kb.terpedia.com/v1/chat/completions`
3. Not be blocked by CloudFront/CDN for POST requests

## Troubleshooting

### If Terpedia models don't work:
1. Check if kb.terpedia.com API is running
2. Verify CloudFront/CDN allows POST requests
3. Check API logs for routing decisions
4. Test kb.terpedia.com endpoint directly

### Fallback Behavior
- If kb.terpedia.com is unavailable, Terpedia model requests will fail
- OpenAI models continue to work independently
- Users can switch between models in LibreChat UI

## Status

✅ **Terpedia Models**: Added to API
✅ **Routing Logic**: Implemented
✅ **LibreChat**: Configured with Terpedia models
✅ **Backend**: Ready to connect to kb.terpedia.com
