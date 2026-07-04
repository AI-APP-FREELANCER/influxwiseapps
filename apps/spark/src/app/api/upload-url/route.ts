import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-south-1" });
const BUCKET = process.env.SPARK_S3_BUCKET!;

const ALLOWED_TYPES = [
  "audio/mpeg", "audio/mp3", "audio/mp4", "audio/wav", "audio/m4a", "audio/ogg",
  "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm",
];

const schema = z.object({
  filename: z.string().max(256),
  contentType: z.string().refine((t) => ALLOWED_TYPES.includes(t), "Unsupported file type"),
  size: z.number().max(500 * 1024 * 1024), // 500MB max
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = schema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: "Invalid", issues: data.error.issues }, { status: 400 });

  const ext = data.data.filename.split(".").pop() || "bin";
  const s3Key = `uploads/${session.user.id}/${Date.now()}.${ext}`;

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ContentType: data.data.contentType,
      Metadata: { userId: session.user.id },
    }),
    { expiresIn: 300 } // 5 minutes
  );

  return NextResponse.json({ uploadUrl: url, s3Key });
}
