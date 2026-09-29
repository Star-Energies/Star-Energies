import "server-only";

import { Resend } from "resend";

import { websiteEmail } from "@/lib/mail/template";

export function getOnboardingRecipient() {
  const recipient = process.env.ADMIN_ONBOARDING_EMAIL?.trim().toLowerCase();
  return recipient && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) ? recipient : undefined;
}

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && getOnboardingRecipient());
}

export async function sendAdminOnboardingCode(code: string) {
  if (!isConfigured()) {
    return { ok: false as const, message: "Owner verification email is not configured yet." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: [getOnboardingRecipient()!],
    subject: "Your Star Energies administrator verification code",
    text: `Your verification code is: ${code}\n\nIt expires in 10 minutes. If you did not request this code, you can safely ignore this email.`,
    html: websiteEmail({
      eyebrow: "Owner onboarding",
      title: "Your verification code",
      intro: "Use this code to create the Star Energies administrator account.",
      code,
      note: "This code expires in 10 minutes. If you did not request it, you can safely ignore this email.",
    }),
  }, { idempotencyKey: `star-energies-admin-onboarding/${code}` });

  if (result.error) {
    console.error("Administrator onboarding email was rejected.", result.error.message);
    return { ok: false as const, message: "We could not send a verification code. Please try again shortly." };
  }

  return { ok: true as const };
}
