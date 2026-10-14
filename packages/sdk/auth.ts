import { LeveonasConfig } from './config';

export function getAuthHeaders(config: LeveonasConfig): Record<string, string> {
  if (!config.apiKey) {
    throw new Error('API key is required for authentication');
  }
  
  return {
    'x-leveonas-key': config.apiKey,
    'Authorization': `Bearer ${config.apiKey}`
  };
}
