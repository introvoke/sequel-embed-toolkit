# Deployment Guide

## Prerequisites

- AWS credentials configured with access to S3 and CloudFront
- Node.js and npm installed
- Dependencies installed (`npm install`)

## Deploy

### Build First

Always build before deploying:

```bash
npm run build
```

### Deploy to Staging

```bash
npm run deploy:stage
```

### Deploy to Production

```bash
npm run deploy:prod
```

### What Happens During Deploy

1. The current `sequel.js` is backed up to `uploads/toolkit/BUP/sequel-{timestamp}.js`
2. The new `sequel.js` from `dist/` is uploaded to `uploads/toolkit/sequel.js`
3. CloudFront cache is invalidated

## Restore a Backup

If something goes wrong, you can restore a previous version.

### Restore Staging

```bash
npm run restore:stage
```

### Restore Production

```bash
npm run restore:prod
```

### What Happens During Restore

1. Lists the 5 most recent backups
2. Prompts you to select one
3. Copies the selected backup to `sequel.js`
4. Invalidates CloudFront cache

## Environments

| Environment | S3 Bucket | CloudFront ID |
|-------------|-----------|---------------|
| Staging | stage-sequel-uploads | E1M5OGTWH4REBS |
| Production | prod-sequel-uploads | EFOE4NMFZ2MOZ |

## File Locations

- **Live file:** `uploads/toolkit/sequel.js`
- **Backups:** `uploads/toolkit/BUP/sequel-{timestamp}.js`
