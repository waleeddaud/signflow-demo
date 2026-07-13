import { NextResponse } from "next/server";
import { termsDocument } from "@/content/terms";
import { sendSignedAgreementEmails } from "@/lib/email";
import {
  buildSignedAgreementPdf,
  signedPdfFilename,
} from "@/lib/pdf";
import type { ReceiptData } from "@/lib/receipt-types";
import {
  MAX_SIGNATURE_DATA_URL_LENGTH,
  signFormSchema,
  validateFormTiming,
} from "@/lib/sign-schema";

export const runtime = "nodejs";

/**
 * Production deployments should add persistent rate limiting (e.g. IP-based
 * quotas via Redis/Upstash) and/or CAPTCHA. This demo only applies lightweight
 * honeypot + minimum completion time checks.
 */

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 100);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 100);
  return "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = signFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.website.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Submission rejected." },
      { status: 400 },
    );
  }

  if (!validateFormTiming(data.formStartedAt)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please take a moment to review the terms before signing.",
      },
      { status: 400 },
    );
  }

  // Defense in depth — schema already caps length
  if (
    !data.signatureDataUrl ||
    data.signatureDataUrl.length > MAX_SIGNATURE_DATA_URL_LENGTH
  ) {
    return NextResponse.json(
      { ok: false, error: "A valid signature is required." },
      { status: 400 },
    );
  }

  const receiptId = crypto.randomUUID();
  const auditedAt = new Date().toISOString();
  const ipAddress = getClientIp(request);
  const userAgent = (request.headers.get("user-agent") ?? "unknown").slice(
    0,
    500,
  );

  // Never trust browser-supplied receipt ID, timestamp, version, or IP.
  const receipt: ReceiptData = {
    receiptId,
    fullName: data.fullName,
    company: data.company,
    email: data.email,
    position: data.position,
    signingDate: data.signingDate,
    ipAddress,
    auditedAt,
    documentTitle: termsDocument.title,
    documentVersion: termsDocument.version,
    userAgent,
  };

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await buildSignedAgreementPdf({
      fullName: data.fullName,
      position: data.position,
      company: data.company,
      email: data.email,
      signingDate: data.signingDate,
      signatureDataUrl: data.signatureDataUrl,
      receiptId,
      auditedAt,
      ipAddress,
      userAgent,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not generate the signed agreement PDF." },
      { status: 500 },
    );
  }

  try {
    await sendSignedAgreementEmails({
      receipt,
      pdfBytes,
      pdfFilename: signedPdfFilename(receiptId),
    });
  } catch {
    // Do not expose SMTP details, credentials, or signature data.
    return NextResponse.json(
      {
        ok: false,
        error:
          "The agreement was prepared, but email delivery failed. Please try again later.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, receipt });
}
