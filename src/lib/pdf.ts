import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { termsDocument } from "@/content/terms";

export type PdfSignerInput = {
  fullName: string;
  position: string;
  company: string;
  email: string;
  signingDate: string;
  signatureDataUrl: string;
  receiptId: string;
  auditedAt: string;
  ipAddress: string;
  userAgent: string;
};

const MARGIN = 50;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 14;
const TITLE_SIZE = 16;
const HEADING_SIZE = 12;
const BODY_SIZE = 10;

type DrawContext = {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
};

function ensureSpace(ctx: DrawContext, needed: number) {
  if (ctx.y - needed < MARGIN) {
    ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    ctx.y = PAGE_HEIGHT - MARGIN;
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);
    if (width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      // Hard-break very long tokens
      if (font.widthOfTextAtSize(word, size) > maxWidth) {
        let chunk = "";
        for (const char of word) {
          const next = chunk + char;
          if (font.widthOfTextAtSize(next, size) > maxWidth) {
            if (chunk) lines.push(chunk);
            chunk = char;
          } else {
            chunk = next;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function drawParagraph(
  ctx: DrawContext,
  text: string,
  options?: { bold?: boolean; size?: number; gapAfter?: number },
) {
  const size = options?.size ?? BODY_SIZE;
  const font = options?.bold ? ctx.fontBold : ctx.font;
  const lines = wrapText(text, font, size, CONTENT_WIDTH);

  for (const line of lines) {
    ensureSpace(ctx, LINE_HEIGHT);
    ctx.page.drawText(line, {
      x: MARGIN,
      y: ctx.y,
      size,
      font,
      color: rgb(0.2, 0.25, 0.33),
    });
    ctx.y -= LINE_HEIGHT;
  }
  ctx.y -= options?.gapAfter ?? 6;
}

function drawHeading(ctx: DrawContext, text: string) {
  ensureSpace(ctx, HEADING_SIZE + 18);
  ctx.y -= 8;
  ctx.page.drawText(text, {
    x: MARGIN,
    y: ctx.y,
    size: HEADING_SIZE,
    font: ctx.fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });
  ctx.y -= HEADING_SIZE + 8;
}

export async function buildSignedAgreementPdf(
  input: PdfSignerInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const ctx: DrawContext = {
    doc,
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    font,
    fontBold,
    y: PAGE_HEIGHT - MARGIN,
  };

  drawParagraph(ctx, termsDocument.title, {
    bold: true,
    size: TITLE_SIZE,
    gapAfter: 4,
  });
  drawParagraph(
    ctx,
    `Version ${termsDocument.version} · Effective ${termsDocument.effectiveDate}`,
    { size: 9, gapAfter: 12 },
  );
  drawParagraph(
    ctx,
    "Demonstration agreement — not intended to create a legally binding contract.",
    { size: 9, gapAfter: 16 },
  );

  for (const section of termsDocument.sections) {
    drawHeading(ctx, section.heading);
    for (const paragraph of section.paragraphs) {
      drawParagraph(ctx, paragraph);
    }
    if (section.bullets) {
      for (const bullet of section.bullets) {
        drawParagraph(ctx, `• ${bullet}`, { gapAfter: 4 });
      }
      ctx.y -= 4;
    }
  }

  drawHeading(ctx, "Signature and audit record");
  drawParagraph(ctx, `Signer name: ${input.fullName}`);
  drawParagraph(ctx, `Position: ${input.position}`);
  drawParagraph(ctx, `Company: ${input.company}`);
  drawParagraph(ctx, `Signer email: ${input.email}`);
  drawParagraph(ctx, `Signing date: ${input.signingDate}`);
  drawParagraph(ctx, `Receipt ID: ${input.receiptId}`);
  drawParagraph(ctx, `IP address: ${input.ipAddress}`);
  drawParagraph(ctx, `Server date and time (UTC): ${input.auditedAt}`);
  drawParagraph(ctx, `User agent: ${input.userAgent}`);
  drawParagraph(
    ctx,
    "Confirmation: The signer accepted the Terms and Conditions shown in this document and confirmed agreement via the SignFlow portal checkbox.",
    { gapAfter: 12 },
  );

  const base64 = input.signatureDataUrl.replace(/^data:image\/png;base64,/, "");
  const signatureBytes = Buffer.from(base64, "base64");
  const signatureImage = await doc.embedPng(signatureBytes);
  const sigMaxWidth = 220;
  const sigMaxHeight = 90;
  const scale = Math.min(
    sigMaxWidth / signatureImage.width,
    sigMaxHeight / signatureImage.height,
    1,
  );
  const sigWidth = signatureImage.width * scale;
  const sigHeight = signatureImage.height * scale;

  ensureSpace(ctx, sigHeight + 28);
  ctx.page.drawText("Signature:", {
    x: MARGIN,
    y: ctx.y,
    size: BODY_SIZE,
    font: ctx.fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });
  ctx.y -= 14;
  const boxWidth = Math.max(sigWidth + 8, 180);
  const boxHeight = sigHeight + 8;
  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0.84, 0.87, 0.9),
    borderWidth: 0.75,
  });
  ctx.page.drawImage(signatureImage, {
    x: MARGIN + 4,
    y: ctx.y - boxHeight + 4,
    width: sigWidth,
    height: sigHeight,
  });
  ctx.y -= boxHeight + 12;

  return doc.save();
}

export function signedPdfFilename(receiptId: string): string {
  return `Signed-Agreement-${receiptId}.pdf`;
}
