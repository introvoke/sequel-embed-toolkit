#!/usr/bin/env tsx
import { S3Client, PutObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { readFileSync } from "fs";
import { join } from "path";
import { lookup } from "mime-types";
import { execSync } from "child_process";

const BUCKETS = {
  stage: "stage-sequel-uploads",
  prod: "prod-sequel-uploads",
} as const;

const CLOUDFRONT_IDS = {
  stage: "E1M5OGTWH4REBS",
  prod: "EFOE4NMFZ2MOZ",
} as const;

// Map deploy environment to VITE_APP_ENV values
const VITE_ENV_MAP = {
  stage: "stg",
  prod: "prod",
} as const;

type Environment = keyof typeof BUCKETS;

function buildForEnvironment(env: Environment): void {
  const viteEnv = VITE_ENV_MAP[env];
  console.log(`Building for ${env} environment (VITE_APP_ENV=${viteEnv})...`);

  execSync("npm run build", {
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_APP_ENV: viteEnv,
    },
  });

  console.log("Build complete!\n");
}

async function backupExistingFile(
  client: S3Client,
  bucket: string,
  sourceKey: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupKey = `uploads/toolkit/BUP/sequel-${timestamp}.js`;

  await client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${sourceKey}`,
      Key: backupKey,
    })
  );

  console.log(`  Backed up: ${sourceKey} -> ${backupKey}`);
}

async function uploadToS3(
  client: S3Client,
  bucket: string,
  localPath: string,
  s3Key: string
): Promise<void> {
  const content = readFileSync(localPath);
  const contentType = lookup(localPath) || "application/octet-stream";

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: content,
      ContentType: contentType,
    })
  );
}

async function invalidateCloudFront(
  client: CloudFrontClient,
  distributionId: string,
  paths: string[]
): Promise<void> {
  await client.send(
    new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `deploy-${Date.now()}`,
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    })
  );
}

async function deploy(env: Environment): Promise<void> {
  const distPath = join(process.cwd(), "dist");
  const bucket = BUCKETS[env];
  const cloudFrontId = CLOUDFRONT_IDS[env];

  // Build with the correct environment before deploying
  buildForEnvironment(env);

  console.log(`Deploying to ${env} (bucket: ${bucket})...`);

  const s3Client = new S3Client({ region: "us-east-1" });
  const cloudFrontClient = new CloudFrontClient({ region: "us-east-1" });

  const localFile = join(distPath, "sequel.js");
  const s3Key = "uploads/toolkit/sequel.js";

  console.log(`\nBacking up existing file...`);
  await backupExistingFile(s3Client, bucket, s3Key);

  console.log(`\nUploading new file...`);
  console.log(`  Uploading: sequel.js -> ${s3Key}`);
  await uploadToS3(s3Client, bucket, localFile, s3Key);

  console.log(`\nInvalidating CloudFront cache (${cloudFrontId})...`);
  await invalidateCloudFront(cloudFrontClient, cloudFrontId, [`/${s3Key}`]);

  console.log(`\nDeployment complete!`);
  console.log(`File available at: s3://${bucket}/${s3Key}`);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf("--env");

if (envIndex === -1 || !args[envIndex + 1]) {
  console.error("Usage: tsx scripts/deploy.ts --env <stage|prod>");
  process.exit(1);
}

const env = args[envIndex + 1] as Environment;

if (!["stage", "prod"].includes(env)) {
  console.error(`Invalid environment: ${env}. Must be "stage" or "prod"`);
  process.exit(1);
}

deploy(env).catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
