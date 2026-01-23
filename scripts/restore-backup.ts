#!/usr/bin/env tsx
import { S3Client, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import * as readline from "readline";

const BUCKETS = {
  stage: "stage-sequel-uploads",
  prod: "prod-sequel-uploads",
} as const;

const CLOUDFRONT_IDS = {
  stage: "E1M5OGTWH4REBS",
  prod: "EFOE4NMFZ2MOZ",
} as const;

type Environment = keyof typeof BUCKETS;

interface BackupFile {
  key: string;
  lastModified: Date;
  filename: string;
}

async function listBackups(
  client: S3Client,
  bucket: string
): Promise<BackupFile[]> {
  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: "uploads/toolkit/BUP/",
    })
  );

  if (!response.Contents || response.Contents.length === 0) {
    return [];
  }

  return response.Contents
    .filter((obj) => obj.Key && obj.LastModified)
    .map((obj) => ({
      key: obj.Key!,
      lastModified: obj.LastModified!,
      filename: obj.Key!.split("/").pop()!,
    }))
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
    .slice(0, 5);
}

async function restoreBackup(
  client: S3Client,
  bucket: string,
  backupKey: string
): Promise<void> {
  const targetKey = "uploads/toolkit/sequel.js";

  await client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${backupKey}`,
      Key: targetKey,
    })
  );

  console.log(`  Restored: ${backupKey} -> ${targetKey}`);
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
        CallerReference: `restore-${Date.now()}`,
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    })
  );
}

function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function restore(env: Environment): Promise<void> {
  const bucket = BUCKETS[env];
  const cloudFrontId = CLOUDFRONT_IDS[env];

  console.log(`\nFetching backups from ${env} (bucket: ${bucket})...\n`);

  const s3Client = new S3Client({});
  const cloudFrontClient = new CloudFrontClient({});

  const backups = await listBackups(s3Client, bucket);

  if (backups.length === 0) {
    console.log("No backups found.");
    process.exit(0);
  }

  console.log("Available backups:\n");
  backups.forEach((backup, index) => {
    const date = backup.lastModified.toLocaleString();
    console.log(`  ${index + 1}) ${backup.filename}`);
    console.log(`     Modified: ${date}\n`);
  });

  const answer = await promptUser(`Select backup to restore (1-${backups.length}), or 'q' to quit: `);

  if (answer.toLowerCase() === "q") {
    console.log("Cancelled.");
    process.exit(0);
  }

  const selection = parseInt(answer, 10);

  if (isNaN(selection) || selection < 1 || selection > backups.length) {
    console.error(`Invalid selection. Please enter a number between 1 and ${backups.length}.`);
    process.exit(1);
  }

  const selectedBackup = backups[selection - 1];

  console.log(`\nRestoring ${selectedBackup.filename}...`);
  await restoreBackup(s3Client, bucket, selectedBackup.key);

  console.log(`\nInvalidating CloudFront cache (${cloudFrontId})...`);
  await invalidateCloudFront(cloudFrontClient, cloudFrontId, ["/uploads/toolkit/sequel.js"]);

  console.log(`\nRestore complete!`);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf("--env");

if (envIndex === -1 || !args[envIndex + 1]) {
  console.error("Usage: tsx scripts/restore-backup.ts --env <stage|prod>");
  process.exit(1);
}

const env = args[envIndex + 1] as Environment;

if (!["stage", "prod"].includes(env)) {
  console.error(`Invalid environment: ${env}. Must be "stage" or "prod"`);
  process.exit(1);
}

restore(env).catch((err) => {
  console.error("Restore failed:", err);
  process.exit(1);
});
