export type WaaPEnvironment = 'sandbox' | 'production';

export const waapConfig = {
  apiKey: process.env.NEXT_PUBLIC_WAAP_API_KEY || '',
  environment: (process.env.NEXT_PUBLIC_WAAP_ENV || 'sandbox') as WaaPEnvironment,
  chainNamespace: 'eip155',
};

export function assertWaaPConfig() {
  if (!waapConfig.apiKey) {
    throw new Error('Missing NEXT_PUBLIC_WAAP_API_KEY');
  }
}
