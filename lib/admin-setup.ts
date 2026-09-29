import "server-only";

import { createHash, createHmac, randomInt, randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

import { getDatabase } from "@/db";
import { administrators, rateLimits, users, verifications } from "@/db/schema";
import { getAuthBaseConfig } from "@/lib/auth-config";
import { getOnboardingRecipient, sendAdminOnboardingCode } from "@/lib/mail/admin-onboarding";

const setupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Keep your name below 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(12, "Use a password with at least 12 characters.").max(128, "Keep your password below 128 characters."),
  verificationCode: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit verification code."),
});

const setupRateLimit = { maxAttempts: 5, windowMs: 15 * 60 * 1000 };
const codeRequestRateLimit = { maxAttempts: 3, windowMs: 15 * 60 * 1000 };
const onboardingCodeLifetimeMs = 10 * 60 * 1000;

export async function isAdminSetupAvailable() {
  const [administrator] = await getDatabase().select({ userId: administrators.userId }).from(administrators).limit(1);
  return !administrator;
}

function rateLimitKey(scope: string, value: string) {
  const fingerprint = createHash("sha256")
    .update(`${process.env.BETTER_AUTH_SECRET ?? "star-energies-setup"}:${value}`)
    .digest("hex");
  return `admin-setup:${scope}:${fingerprint}`;
}

async function applySetupRateLimit(scope: string, value: string, { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number }) {
  const key = rateLimitKey(scope, value);
  const now = Date.now();
  const db = getDatabase();
  const [existing] = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).limit(1);
  const isCurrentWindow = existing && now - existing.lastRequest < windowMs;

  if (isCurrentWindow && existing.count >= maxAttempts) return false;

  if (existing) {
    await db
      .update(rateLimits)
      .set({ count: isCurrentWindow ? existing.count + 1 : 1, lastRequest: now })
      .where(eq(rateLimits.key, key));
  } else {
    await db.insert(rateLimits).values({ id: randomUUID(), key, count: 1, lastRequest: now });
  }

  return true;
}

function codeIdentifier() {
  const recipient = getOnboardingRecipient();
  return recipient ? `admin-onboarding:${recipient}` : undefined;
}

function codeHash(identifier: string, code: string) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return undefined;
  return createHmac("sha256", secret).update(`${identifier}:${code}`).digest("hex");
}

export async function requestAdministratorOnboardingCode(clientIp: string) {
  if (!(await isAdminSetupAvailable())) {
    return { ok: false as const, status: 409, message: "Administrator setup is already complete. Please sign in." };
  }

  const identifier = codeIdentifier();
  if (!identifier || !process.env.BETTER_AUTH_SECRET) {
    return { ok: false as const, status: 503, message: "Owner verification email is not configured yet." };
  }

  if (!(await applySetupRateLimit("code-request", clientIp, codeRequestRateLimit))) {
    return { ok: false as const, status: 429, message: "Too many code requests. Please wait before trying again." };
  }

  const code = String(randomInt(100_000, 1_000_000));
  const sent = await sendAdminOnboardingCode(code);
  if (!sent.ok) return { ok: false as const, status: 503, message: sent.message };

  const db = getDatabase();
  await db.delete(verifications).where(eq(verifications.identifier, identifier));
  await db.insert(verifications).values({
    id: randomUUID(),
    identifier,
    value: codeHash(identifier, code)!,
    expiresAt: new Date(Date.now() + onboardingCodeLifetimeMs),
  });

  return { ok: true as const };
}

async function consumeAdministratorOnboardingCode(code: string, clientIp: string) {
  const identifier = codeIdentifier();
  const digest = identifier ? codeHash(identifier, code) : undefined;
  if (!identifier || !digest) return false;

  if (!(await applySetupRateLimit("code-verification", clientIp, setupRateLimit))) return false;

  const db = getDatabase();
  const consumed = await db
    .delete(verifications)
    .where(and(eq(verifications.identifier, identifier), eq(verifications.value, digest), gt(verifications.expiresAt, new Date())))
    .returning({ identifier: verifications.identifier });

  return consumed.length === 1;
}

export async function createInitialAdministrator(input: unknown, clientIp: string) {
  const parsed = setupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, status: 400, message: parsed.error.issues[0]?.message ?? "Check the submitted details." };
  }

  if (!(await isAdminSetupAvailable())) {
    return { ok: false as const, status: 409, message: "Administrator setup is already complete. Please sign in." };
  }

  if (!(await applySetupRateLimit("account-creation", clientIp, setupRateLimit))) {
    return { ok: false as const, status: 429, message: "Too many setup attempts. Please wait before trying again." };
  }

  if (!(await consumeAdministratorOnboardingCode(parsed.data.verificationCode, clientIp))) {
    return { ok: false as const, status: 400, message: "That verification code is invalid or has expired. Request a new code and try again." };
  }

  try {
    const auth = betterAuth(getAuthBaseConfig({ allowEmailSignUp: true }));
    const result = await auth.api.signUpEmail({ body: { name: parsed.data.name, email: parsed.data.email, password: parsed.data.password } });
    const db = getDatabase();
    const [administrator] = await db
      .insert(administrators)
      .values({ userId: result.user.id, singleton: true, role: "admin" })
      .onConflictDoNothing()
      .returning({ userId: administrators.userId });

    if (!administrator) {
      // A competing setup completed first. Remove only this request's orphaned
      // non-admin account; account rows cascade from the user record.
      await db.delete(users).where(eq(users.id, result.user.id));
      return { ok: false as const, status: 409, message: "Administrator setup is already complete. Please sign in." };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("Initial administrator setup failed.", error instanceof Error ? error.message : "Unknown error");
    return { ok: false as const, status: 400, message: "We could not create the administrator account. Check the details and try again." };
  }
}
