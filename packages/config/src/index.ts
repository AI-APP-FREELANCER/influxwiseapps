import { z } from "zod";

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RAZORPAY_KEY_ID: z.string().startsWith("rzp_").optional(),
  RAZORPAY_KEY_SECRET: z.string().min(8).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(8).optional(),
  AWS_REGION: z.string().default("us-west-2"),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  SES_FROM_EMAIL: z.string().email(),
  UPSTASH_REDIS_URL: z.string().url(),
  UPSTASH_REDIS_TOKEN: z.string(),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

export function validateBaseEnv(env: NodeJS.ProcessEnv): BaseEnv {
  const result = baseEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return result.data;
}

export const APP_PORTS = {
  pad: 3001,
  flow: 3002,
  spark: 3003,
  revive: 3004,
  shield: 3005,
  admin: 3006,
} as const;

export const APP_URLS = {
  pad: process.env.NODE_ENV === "production" ? "https://pad.influxwise.com" : "http://localhost:3001",
  flow: process.env.NODE_ENV === "production" ? "https://flow.influxwise.com" : "http://localhost:3002",
  spark: process.env.NODE_ENV === "production" ? "https://spark.influxwise.com" : "http://localhost:3003",
  revive: process.env.NODE_ENV === "production" ? "https://revive.influxwise.com" : "http://localhost:3004",
  shield: process.env.NODE_ENV === "production" ? "https://shield.influxwise.com" : "http://localhost:3005",
  admin: process.env.NODE_ENV === "production" ? "https://admin.influxwise.com" : "http://localhost:3006",
} as const;

// All amounts in paise (INR smallest unit: 100 paise = ₹1)
export const PRICING = {
  spark: {
    textRepurpose: 4900,         // ₹49
    audioUpTo10Min: 9900,        // ₹99
    audio10To30Min: 19900,       // ₹199
    audio30To60Min: 39900,       // ₹399
    creditBundles: [
      { credits: 22, price: 49900,  label: "₹499" },
      { credits: 48, price: 99900,  label: "₹999" },
      { credits: 130, price: 249900, label: "₹2499" },
    ],
  },
  pad: {
    bookingFee: 2500,            // ₹25 platform fee per booking
    premiumMonthly: 69900,       // ₹699/month
  },
  revive: {
    recoveryFeePercent: 5,
    recoveryFeeCap: 10000,       // ₹100 cap
    recoveryFeeMin: 1000,        // ₹10 min
  },
  shield: {
    perPost: 100,                // ₹1 per verification
    starterMonthly: 89900,       // ₹899/month (2,000 verifications)
    growthMonthly: 289900,       // ₹2899/month (10,000 verifications)
  },
  flow: {
    session25min: 500,           // ₹5
    session50min: 800,           // ₹8
    walletMinTopup: 20000,       // ₹200 min top-up
  },
} as const;
