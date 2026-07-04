import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION || "ap-south-1" });
const FROM = process.env.SES_FROM_EMAIL!;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  const toList = Array.isArray(to) ? to : [to];
  const cmd = new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: toList },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: html, Charset: "UTF-8" },
        ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
      },
    },
    ...(replyTo ? { ReplyToAddresses: [replyTo] } : {}),
  });
  return ses.send(cmd);
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function bookingConfirmationEmail({
  clientName,
  practitionerName,
  serviceName,
  startTime,
  timezone,
  bookingId,
}: {
  clientName: string;
  practitionerName: string;
  serviceName: string;
  startTime: string;
  timezone: string;
  bookingId: string;
}) {
  return {
    subject: `Booking Confirmed — ${serviceName} with ${practitionerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#0D9488">Your booking is confirmed ✓</h2>
        <p>Hi ${clientName},</p>
        <p>Your appointment has been confirmed:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0;font-weight:600">${serviceName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">With</td><td style="padding:8px 0;font-weight:600">${practitionerName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">When</td><td style="padding:8px 0;font-weight:600">${startTime} (${timezone})</td></tr>
          <tr><td style="padding:8px 0;color:#666">Booking ID</td><td style="padding:8px 0;font-family:monospace">${bookingId}</td></tr>
        </table>
        <p style="color:#666;font-size:14px">Please arrive 5 minutes early. To reschedule, reply to this email.</p>
      </div>
    `,
  };
}

export function sparkJobCompleteEmail({
  userName,
  jobId,
  inputType,
  appUrl,
}: {
  userName: string;
  jobId: string;
  inputType: string;
  appUrl: string;
}) {
  return {
    subject: "Your content has been atomized — Spark",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#F59E0B">Your content is ready ⚡</h2>
        <p>Hi ${userName},</p>
        <p>Your ${inputType} has been processed. Your repurposed content across 6 platforms is ready to use.</p>
        <a href="${appUrl}/jobs/${jobId}" style="display:inline-block;background:#F59E0B;color:#111;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">View Results →</a>
      </div>
    `,
  };
}

export function flowLowBalanceEmail({
  userName,
  balanceCents,
  topupUrl,
}: {
  userName: string;
  balanceCents: number;
  topupUrl: string;
}) {
  return {
    subject: "Your FocusBurner wallet is running low",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#4F46E5">Wallet balance low</h2>
        <p>Hi ${userName},</p>
        <p>Your focus wallet has <strong>$${(balanceCents / 100).toFixed(2)}</strong> remaining — enough for ${Math.floor(balanceCents / 5)} more sessions.</p>
        <a href="${topupUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Top Up Now →</a>
      </div>
    `,
  };
}
