import { NextResponse } from "next/server";
// Webhook endpoint moved to /api/razorpay/webhook
export async function POST() {
  return NextResponse.json({ error: "Use /api/razorpay/webhook" }, { status: 410 });
}
