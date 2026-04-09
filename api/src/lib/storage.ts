import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const hasMinIO =
  process.env.MINIO_ENDPOINT &&
  process.env.MINIO_ACCESS_KEY &&
  process.env.MINIO_SECRET_KEY;

const s3 = hasMinIO
  ? new S3Client({
      endpoint: process.env.MINIO_ENDPOINT,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      forcePathStyle: true,
    })
  : null;

export async function uploadFile(
  buffer: Buffer,
  mimetype: string,
  folder = 'listings'
): Promise<{ url: string; key: string }> {
  const ext = mimetype.split('/')[1] || 'jpg';
  const key = `${folder}/${randomUUID()}.${ext}`;

  if (s3) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.MINIO_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message ? err.message : 'connection failed';
      throw new Error(`Storage service unavailable: ${msg}`);
    }
    const url = `${process.env.MINIO_PUBLIC_URL}/${key}`;
    return { url, key };
  }

  // Local fallback
  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  fs.mkdirSync(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, `${randomUUID()}.${ext}`);
  fs.writeFileSync(filePath, buffer);
  return { url: `/uploads/${folder}/${path.basename(filePath)}`, key: filePath };
}

export async function deleteFile(key: string): Promise<void> {
  if (s3) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
      })
    );
  } else {
    fs.rmSync(key, { force: true });
  }
}
