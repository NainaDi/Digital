const required = [
  'SHOPIFY_FLAG_STORE',
  'SHOPIFY_STORE_URL',
  'SHOPIFY_CLI_THEME_TOKEN',
  'SHOPIFY_ADMIN_ACCESS_TOKEN',
];

const optional = ['SHOPIFY_API_VERSION', 'CLIENT_SECRET'];
const missing = required.filter((name) => !process.env[name]);

for (const name of required) {
  console.log(`${process.env[name] ? '✓' : '✗'} ${name}`);
}

for (const name of optional) {
  console.log(`${process.env[name] ? '✓' : '-'} ${name} (optional)`);
}

if (missing.length > 0) {
  console.error(`Missing required Shopify environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const storeHost = process.env.SHOPIFY_FLAG_STORE.replace(/^https?:\/\//, '').replace(/\/$/, '');
const storeUrlHost = new URL(process.env.SHOPIFY_STORE_URL).host;

if (storeHost !== storeUrlHost) {
  console.error(`SHOPIFY_FLAG_STORE (${storeHost}) does not match SHOPIFY_STORE_URL (${storeUrlHost}).`);
  process.exit(1);
}

console.log(`Shopify environment is configured for ${storeHost}.`);
