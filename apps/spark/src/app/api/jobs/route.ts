import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { PRICING } from "@influxwise/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { z } from "zod";

const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-south-1" });
const sqs = new SQSClient({ region: process.env.AWS_REGION || "ap-south-1" });
const BUCKET = process.env.SPARK_S3_BUCKET!;
const QUEUE_URL = process.env.SPARK_SQS_QUEUE_URL!;

const textJobSchema = z.object({
  inputType: z.literal("TEXT"),
  inputData: z.string().min(50).max(50000),
});

const audioJobSchema = z.object({
  inputType: z.enum(["AUDIO", "VIDEO"]),
  s3Key: z.string(),
  durationMin: z.number().positive(),
});

const urlJobSchema = z.object({
  inputType: z.literal("URL"),
  inputData: z.string().url(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Determine cost
  let costCents: number;
  let inputType: "TEXT" | "URL" | "AUDIO" | "VIDEO";
  let inputData: string;
  let durationMin: number | undefined;

  if (body.inputType === "TEXT" || body.inputType === "URL") {
    const parsed = body.inputType === "TEXT" ? textJobSchema.safeParse(body) : urlJobSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    costCents = PRICING.spark.textRepurpose;
    inputType = body.inputType;
    inputData = body.inputData;
  } else {
    const parsed = audioJobSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    durationMin = parsed.data.durationMin;
    inputData = parsed.data.s3Key;
    inputType = parsed.data.inputType;
    if (durationMin <= 10) costCents = PRICING.spark.audioUpTo10Min;
    else if (durationMin <= 30) costCents = PRICING.spark.audio10To30Min;
    else costCents = PRICING.spark.audio30To60Min;
  }

  // Check wallet balance
  const credit = await db.sparkCredit.findUnique({ where: { userId: session.user.id } });
  if (!credit || credit.balance < costCents) {
    return NextResponse.json({ error: "Insufficient credits", required: costCents, balance: credit?.balance ?? 0 }, { status: 402 });
  }

  // Deduct credits and create job atomically
  const [job] = await db.$transaction([
    db.sparkJob.create({
      data: { userId: session.user.id, inputType, inputData, durationMin, costCents, status: "PENDING" },
    }),
    db.sparkCredit.update({
      where: { userId: session.user.id },
      data: { balance: { decrement: costCents } },
    }),
    db.sparkTransaction.create({
      data: { creditId: credit.id, amount: -costCents, description: `Job: ${inputType}` },
    }),
  ]);

  // Enqueue to SQS for Lambda processing
  await sqs.send(new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({ jobId: job.id, userId: session.user.id, inputType, inputData }),
    MessageAttributes: {
      jobId: { StringValue: job.id, DataType: "String" },
    },
  }));

  return NextResponse.json({ jobId: job.id, status: "PENDING" });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("id");

  if (jobId) {
    const job = await db.sparkJob.findFirst({
      where: { id: jobId, userId: session.user.id },
    });
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(job);
  }

  const jobs = await db.sparkJob.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(jobs);
}
