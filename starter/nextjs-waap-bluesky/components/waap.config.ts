export type WaaPEnvironment = 'sandbox' | 'production';

export const waapConfig = {
  apiKey: process.env.NEXT_PUBLIC_WAAP_API_KEY || '',
  environment: (process.env.NEXT_PUBLIC_WAAP_ENV || 'sandbox') as WaaPEnvironment,
  chainNamespace: 'eip155',
};

let hasLoggedMissingApiKeyNotice = false;

export function assertWaaPConfig() {
  if (!waapConfig.apiKey && !hasLoggedMissingApiKeyNotice) {
    // WaaP quick-start can run without a public API key in some environments.
    // Keep this as a debug notice so local testing can continue without blocking auth flow.
    console.info('[WaaP] NEXT_PUBLIC_WAAP_API_KEY is not set. Continuing with project-name based initialization.');
    hasLoggedMissingApiKeyNotice = true;
  }
}
