# Ode to Odd Shopify Theme

Standalone Shopify Online Store 2.0 theme converted from the Vite React storefront.

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
