# Ode to Odd Shopify Theme

Standalone Shopify Online Store 2.0 theme converted from the Vite React storefront.


## Shopify store connection

This repository is configured to connect to the Codex Cloud Shopify store without committing any secrets. The store target lives in `shopify.theme.toml`; credentials continue to come from Codex Cloud environment variables.

Expected Codex Cloud variables:

- `SHOPIFY_FLAG_STORE` - Shopify store host, for example `codex-mcp-2.myshopify.com`.
- `SHOPIFY_STORE_URL` - Full store URL, for example `https://codex-mcp-2.myshopify.com`.
- `SHOPIFY_CLI_THEME_TOKEN` - Theme Access password or Admin API token used by Shopify CLI theme commands.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` - Admin API token for integrations that call the Admin API directly.
- `SHOPIFY_API_VERSION` - Optional Admin API version for direct API integrations.
- `CLIENT_SECRET` - Optional app/client secret for direct app integrations.

Validate the cloud secrets are present before running Shopify commands:

```bash
npm run shopify:env
```

List themes on the connected store:

```bash
npm run shopify:list
```

Start a Shopify theme preview against the connected store:

```bash
npm run shopify:dev
```

Push the theme to the configured Shopify environment:

```bash
npm run shopify:push
```

The scripts pin Shopify CLI to `@shopify/cli@3.94.3` because the current runtime is Node 20 and Shopify CLI 4 requires Node 22.12 or newer.

## Validate locally

```bash
shopify theme check
```

## Package for upload

```bash
zip -r ode-to-odd-shopify-theme.zip assets config layout locales sections snippets templates README.md .gitkeep -x '*.git*' 'node_modules/*' 'dist/*'
```

## Uploaded HTML and asset conversion

The uploaded source files in this repository are AppleDouble `._*` metadata files rather than complete HTML/image/video payloads. The theme therefore maps the expected exported filenames to Shopify dynamic data and Shopify Files conventions:

- Collection tiles: `category-<collection-handle>.jpg` when a collection has no featured image.
- Product cards: `product-<product-handle>.jpg` when a product has no Shopify featured media.
