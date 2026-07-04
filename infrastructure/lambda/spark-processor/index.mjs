/**
 * Spark content atomizer Lambda
 * Trigger: SQS (influxwise-spark-jobs queue)
 * Runtime: Node.js 20.x
 */
import Anthropic from "@anthropic-ai/sdk"; // @anthropic-ai/sdk ^0.110.0
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { tmpdir } from "os";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-south-1" });

const REPURPOSE_PROMPT = (content) => `You are a world-class content strategist. Below is a piece of content (transcript, article, or text).
Repurpose it into ALL of the following formats. Be creative, platform-native, and engaging.
Return ONLY valid JSON matching the exact schema below.

CONTENT:
${content}

REQUIRED JSON SCHEMA:
{
  "twitter_thread": "Tweet 1 text\\n\\nTweet 2 text\\n\\n(up to 5 tweets, each ≤280 chars, with hook and CTA)",
  "linkedin_post": "Full LinkedIn post (150-300 words, professional tone, ends with question or CTA)",
  "linkedin_short": "LinkedIn short post (50-80 words, punchy, 1 insight)",
  "newsletter_section": "Newsletter section with subject line, intro paragraph, 3 bullet insights, and CTA (200-300 words)",
  "youtube_description": "YouTube description (150-200 words, SEO-optimised, includes timestamps placeholder, subscribe CTA)",
  "instagram_caption": "Instagram caption with hook, 2-3 sentences, 10 relevant hashtags",
  "reels_script": "60-second vertical video script with [HOOK], [MAIN POINT], [CTA] sections"
}`;

async function downloadS3File(bucket, key) {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const tmpPath = join(tmpdir(), `spark-${Date.now()}.bin`);
  await pipeline(res.Body, createWriteStream(tmpPath));
  return tmpPath;
}

async function transcribeAudio(filePath, mimeType) {
  const { createReadStream, statSync } = await import("fs");
  const stat = statSync(filePath);
  const stream = createReadStream(filePath);

  // Use Whisper via OpenAI-compatible API or AWS Transcribe
  // For now we use Anthropic's file upload
  const file = await anthropic.beta.files.upload({
    file: new File([await import("fs").then((f) => f.readFileSync(filePath))], "audio.mp3", { type: mimeType }),
  });

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: [
          { type: "document", source: { type: "file", file_id: file.id } },
          { type: "text", text: "Transcribe this audio content accurately. Return only the transcript text, no labels." },
        ],
      },
    ],
  });

  return msg.content[0].type === "text" ? msg.content[0].text : "";
}

export const handler = async (event) => {
  for (const record of event.Records) {
    const { jobId, userId, inputType, inputData } = JSON.parse(record.body);

    try {
      await prisma.sparkJob.update({ where: { id: jobId }, data: { status: "PROCESSING" } });

      let textContent = "";

      if (inputType === "TEXT") {
        textContent = inputData;
      } else if (inputType === "URL") {
        // Fetch and extract text from URL
        const res = await fetch(inputData);
        const html = await res.text();
        // Basic HTML stripping
        textContent = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 10000);
      } else {
        // AUDIO or VIDEO — download from S3 and transcribe
        const tmpPath = await downloadS3File(process.env.SPARK_S3_BUCKET, inputData);
        textContent = await transcribeAudio(tmpPath, "audio/mpeg");
      }

      // Generate repurposed content
      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: REPURPOSE_PROMPT(textContent.slice(0, 8000)) }],
      });

      const raw = msg.content[0].type === "text" ? msg.content[0].text : "{}";
      let results;
      try {
        // Extract JSON from response
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        results = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch {
        results = { error: "Failed to parse output", raw };
      }

      await prisma.sparkJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED", results },
      });

      // Send email notification
      // (Email would be sent via SES here)

    } catch (err) {
      console.error(`Job ${jobId} failed:`, err);
      await prisma.sparkJob.update({
        where: { id: jobId },
        data: { status: "FAILED", errorMsg: err.message },
      });
    }
  }
};
