import { z } from "zod";

/** Max length of the data URL string (~225KB raw ≈ larger base64). */
export const MAX_SIGNATURE_DATA_URL_LENGTH = 300_000;

/** Reject submissions completed faster than this (bot protection). */
export const MIN_FORM_DURATION_MS = 3_000;

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const signFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(120, "Name must be 120 characters or fewer"),
  position: z
    .string()
    .trim()
    .min(2, "Enter your position or job title")
    .max(120, "Position must be 120 characters or fewer"),
  company: z
    .string()
    .trim()
    .min(2, "Enter your company name")
    .max(160, "Company must be 160 characters or fewer"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or fewer"),
  signingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid signing date"),
  signatureDataUrl: z
    .string()
    .min(1, "A signature is required")
    .max(
      MAX_SIGNATURE_DATA_URL_LENGTH,
      "Signature image is too large. Please clear and sign again.",
    )
    .refine(
      (value) => value.startsWith("data:image/png;base64,"),
      "Signature must be a PNG image",
    ),
  agreed: z.literal(true, {
    error: "You must confirm that you agree to the Terms and Conditions",
  }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0, "Invalid submission"),
  formStartedAt: z.number().int().positive(),
});

export type SignFormInput = z.infer<typeof signFormSchema>;

export type SignFormClientValues = Omit<
  SignFormInput,
  "signatureDataUrl" | "agreed" | "website" | "formStartedAt"
> & {
  signatureDataUrl: string;
  agreed: boolean;
  website: string;
  formStartedAt: number;
};

export function getDefaultSigningDate(): string {
  return todayIsoDate();
}

export function validateFormTiming(formStartedAt: number, now = Date.now()): boolean {
  return now - formStartedAt >= MIN_FORM_DURATION_MS;
}
