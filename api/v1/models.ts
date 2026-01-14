import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * OpenAI-compatible /v1/models endpoint
 * Returns list of available models
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Models list - includes both OpenAI models and Terpedia models
  const models = [
    // Terpedia Knowledge Base models
    {
      id: 'terpedia/unified',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'terpedia/unified',
      parent: null,
    },
    {
      id: 'terpedia/kb',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'terpedia/kb',
      parent: null,
    },
    {
      id: 'terpedia/pubmed',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'terpedia/pubmed',
      parent: null,
    },
    {
      id: 'terpedia/rdkit',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'terpedia/rdkit',
      parent: null,
    },
    // OpenAI models (proxied)
    {
      id: 'gpt-4o',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'gpt-4o',
      parent: null,
    },
    {
      id: 'gpt-4o-mini',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'gpt-4o-mini',
      parent: null,
    },
    {
      id: 'gpt-4-turbo',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'gpt-4-turbo',
      parent: null,
    },
    {
      id: 'gpt-3.5-turbo',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'terpedia',
      permission: [],
      root: 'gpt-3.5-turbo',
      parent: null,
    },
  ];

  res.status(200).json({
    object: 'list',
    data: models,
  });
}
