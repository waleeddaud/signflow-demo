import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/escape-html";
import type { ReceiptData } from "@/lib/receipt-types";

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createTransport() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASSWORD");

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });
}

function buildEmailHtml(receipt: ReceiptData, audience: "signer" | "supplier"): string {
  const title = escapeHtml(receipt.documentTitle);
  const version = escapeHtml(receipt.documentVersion);
  const name = escapeHtml(receipt.fullName);
  const company = escapeHtml(receipt.company);
  const email = escapeHtml(receipt.email);
  const receiptId = escapeHtml(receipt.receiptId);
  const ip = escapeHtml(receipt.ipAddress);
  const auditedAt = escapeHtml(receipt.auditedAt);

  const greeting =
    audience === "signer"
      ? `Hello ${name},`
      : `Hello,`;

  const intro =
    audience === "signer"
      ? "This confirms that you signed the demonstration Terms and Conditions through SignFlow. A PDF of the signed agreement is attached."
      : `A signer has completed the SignFlow demonstration agreement. Signer: ${name} (${company}). A PDF of the signed agreement is attached.`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Signed Terms &amp; Conditions</title></head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #334155; line-height: 1.5;">
  <p>${greeting}</p>
  <p>${intro}</p>
  <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="color:#64748B;">Document</td><td><strong>${title}</strong> (v${version})</td></tr>
    <tr><td style="color:#64748B;">Signer</td><td>${name}</td></tr>
    <tr><td style="color:#64748B;">Company</td><td>${company}</td></tr>
    <tr><td style="color:#64748B;">Signer email</td><td>${email}</td></tr>
    <tr><td style="color:#64748B;">Receipt ID</td><td>${receiptId}</td></tr>
    <tr><td style="color:#64748B;">IP address</td><td>${ip}</td></tr>
    <tr><td style="color:#64748B;">Server date and time</td><td>${auditedAt}</td></tr>
  </table>
  <p style="color:#64748B; font-size: 12px;">Demonstration agreement — not intended to create a legally binding contract.</p>
</body>
</html>`;
}

export async function sendSignedAgreementEmails(options: {
  receipt: ReceiptData;
  pdfBytes: Uint8Array;
  pdfFilename: string;
}): Promise<void> {
  const fromName = requireEnv("EMAIL_FROM_NAME");
  const smtpUser = requireEnv("SMTP_USER");
  const supplierEmail = requireEnv("SUPPLIER_EMAIL");
  const transport = createTransport();

  const attachment: EmailAttachment = {
    filename: options.pdfFilename,
    content: Buffer.from(options.pdfBytes),
    contentType: "application/pdf",
  };

  const subject = `Signed Terms & Conditions — Receipt ${options.receipt.receiptId}`;
  const from = `"${fromName}" <${smtpUser}>`;

  // Send separately so recipient addresses remain private.
  await transport.sendMail({
    from,
    to: options.receipt.email,
    subject,
    html: buildEmailHtml(options.receipt, "signer"),
    attachments: [attachment],
  });

  await transport.sendMail({
    from,
    to: supplierEmail,
    subject,
    html: buildEmailHtml(options.receipt, "supplier"),
    attachments: [attachment],
  });
}
