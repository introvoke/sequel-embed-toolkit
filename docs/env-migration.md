# Environment Variables Migration Guide

## ⚠️ IMPORTANT: Vite Environment Variable Naming

This project uses **Vite** (not Create React App), so environment variables must be prefixed with `VITE_` not `REACT_APP_`.

## What Changed

**❌ Old (Wrong - Create React App style):**

```bash
REACT_APP_SEQUEL_API_ENDPOINT=https://dev-sequel-api.sequelvideo.com
REACT_APP_API_ENDPOINT=https://dev-api.introvoke.com
REACT_APP_ANALYTICS_ENDPOINT=https://dev-analytics.introvoke.com
REACT_APP_DEMO_ENDPOINT=https://dev-app.sequel.io
REACT_APP_EMBED_ENDPOINT=https://dev-embed.sequel.io
```

**✅ New (Correct - Vite style):**

```bash
VITE_SEQUEL_API_ENDPOINT=https://dev-sequel-api.sequelvideo.com
VITE_API_ENDPOINT=https://dev-api.introvoke.com
VITE_ANALYTICS_ENDPOINT=https://dev-analytics.introvoke.com
VITE_DEMO_ENDPOINT=https://dev-app.sequel.io
VITE_EMBED_ENDPOINT=https://dev-embed.sequel.io
```

## Migration Steps

1. **Open your `.env` file** (or `.env.local`, `.env.development`, etc.)
2. **Replace all `REACT_APP_` prefixes with `VITE_`**
3. **Restart your dev server** (important!)

```bash
# Stop the dev server
# Update your .env file
# Start it again
npm run dev
```

## Quick Find & Replace

### Mac/Linux:

```bash
# Backup your .env file first!
cp .env .env.backup

# Replace REACT_APP_ with VITE_
sed -i '' 's/REACT_APP_/VITE_/g' .env
```

### Windows (PowerShell):

```powershell
# Backup
Copy-Item .env .env.backup

# Use your text editor's find & replace:
# Find: REACT_APP_
# Replace: VITE_
```

## Available Environment Variables

```bash
# Application Environment (required)
VITE_APP_ENV=dev  # Options: dev, stg, prod, test

# API Endpoints (optional - defaults based on VITE_APP_ENV)
VITE_API_ENDPOINT=https://dev-api.introvoke.com
VITE_ANALYTICS_ENDPOINT=https://dev-analytics.introvoke.com
VITE_DEMO_ENDPOINT=https://dev-app.sequel.io
VITE_EMBED_ENDPOINT=https://dev-embed.sequel.io
VITE_SEQUEL_API_ENDPOINT=https://dev-sequel-api.sequelvideo.com

# AWS AppSync (optional)
VITE_AWS_APPSYNC_GRAPHQL=https://dev-graphql.sequelvideo.com/graphql
VITE_AWS_APPSYNC_REGION=us-west-2
```

## Default Behavior

If you **don't** set custom endpoint variables, the app will use defaults based on `VITE_APP_ENV`:

| `VITE_APP_ENV` | Endpoints Used        |
| -------------- | --------------------- |
| `dev`          | Development endpoints |
| `stg`          | Staging endpoints     |
| `prod`         | Production endpoints  |
| `test`         | Test endpoints        |

## Example .env Files

### Development (.env.development)

```bash
VITE_APP_ENV=dev
# That's it! Will use dev endpoints automatically
```

### Local Development with Custom API

```bash
VITE_APP_ENV=dev
VITE_SEQUEL_API_ENDPOINT=http://localhost:3000
```

### Staging

```bash
VITE_APP_ENV=stg
# Will use staging endpoints
```

### Production

```bash
VITE_APP_ENV=prod
# Will use production endpoints
```

## Troubleshooting

### Problem: Changes to .env not taking effect

**Solution:** Restart your dev server! Vite only reads env vars on startup.

```bash
# Stop the server (Ctrl+C)
npm run dev  # Start again
```

### Problem: Still pointing to wrong environment

**Solution:** Check that you're using `VITE_` prefix, not `REACT_APP_`

```bash
# ❌ Wrong
REACT_APP_SEQUEL_API_ENDPOINT=...

# ✅ Correct
VITE_SEQUEL_API_ENDPOINT=...
```

### Problem: Environment variables not defined in TypeScript

**Solution:** They're defined in `src/vite-env.d.ts`. If you add new ones, you may need to extend the `ImportMetaEnv` interface.

## Why This Change?

This project uses **Vite** as its build tool (not Create React App). Vite has different conventions:

- ✅ Vite: `import.meta.env.VITE_*`
- ❌ CRA: `process.env.REACT_APP_*`

The code has been updated to use the correct Vite convention.

## Need Help?

If you're still having issues:

1. Check your `.env` file has `VITE_` prefix
2. Restart your dev server
3. Check browser console for environment-related errors
4. Verify `VITE_APP_ENV` is set correctly
