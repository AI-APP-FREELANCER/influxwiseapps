import { NextResponse } from "next/server";
import { db } from "@influxwise/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import Anthropic from "@anthropic-ai/sdk";
import { randomBytes } from "crypto";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const verifySchema = z.object({
  content: z.string().min(1).max(5000),
  language: z.string().optional(),
  context: z.enum(["marketplace", "forum", "review", "general"]).optional(),
});

export async function POST(req: Request) {
  // Extract API key from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }
  const rawKey = authHeader.slice(7);

  // Find key by prefix
  const prefix = rawKey.slice(0, 8);
  const candidates = await db.shieldApiKey.findMany({
    where: { keyPrefix: prefix, isActive: true },
  });

  const apiKey = candidates.find((k) => bcrypt.compareSync(rawKey, k.keyHash));
  if (!apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Check plan limits
  if (apiKey.monthlyLimit !== null && apiKey.usageThisMonth >= apiKey.monthlyLimit) {
    return NextResponse.json({ error: "Monthly limit exceeded. Upgrade your plan.", code: "LIMIT_EXCEEDED" }, { status: 429 });
  }

  const body = await req.json();
  const data = verifySchema.safeParse(body);
  if (!data.success) {
    return NextResponse.json({ error: "Invalid request", issues: data.error.issues }, { status: 400 });
  }

  const { content, language = "auto", context = "general" } = data.data;

  // Run AI classification
  const prompt = `You are an expert content moderator for online marketplaces and community platforms.
Analyze this post for spam, scams, and fraudulent content. Consider cultural context and regional marketplace patterns.

POST CONTENT:
"${content}"

CONTEXT: ${context}, Language/Region: ${language}

Respond with ONLY a JSON object:
{
  "result": "CLEAN" | "SUSPICIOUS" | "SPAM" | "SCAM",
  "score": 0.0-1.0,
  "reason": "brief explanation in one sentence"
}`;

  let result: "CLEAN" | "SUSPICIOUS" | "SPAM" | "SCAM" = "CLEAN";
  let score = 0.99;
  let reason = "";

  try {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = msg.content[0].type === "text" ? msg.content[0].text : "{}";
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    result = parsed.result ?? "CLEAN";
    score = parsed.score ?? 0.99;
    reason = parsed.reason ?? "";
  } catch {
    // Fallback to CLEAN on API error
  }

  const badgeToken = result === "CLEAN" ? `tkv_${randomBytes(12).toString("hex")}` : null;

  // Record verification
  await db.$transaction([
    db.shieldVerification.create({
      data: {
        keyId: apiKey.id,
        content: content.slice(0, 500), // Store truncated for privacy
        language,
        result,
        score,
        badgeToken: badgeToken ?? undefined,
        feeCents: 1,
      },
    }),
    db.shieldApiKey.update({
      where: { id: apiKey.id },
      data: { usageThisMonth: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({
    result,
    score,
    reason,
    badge_token: badgeToken,
    verified_at: new Date().toISOString(),
  });
}
