# SignFlow

Portfolio demonstration of an electronic agreement portal built with Next.js App Router, TypeScript, and Tailwind CSS. Signers review semantic HTML Terms and Conditions, draw a signature, receive an audit receipt, and get a signed PDF by real SMTP email.

> Demonstration agreement — not intended to create a legally binding contract.

## Features

- Canonical Terms and Conditions rendered as semantic HTML (not a PDF viewer or iframe)
- Signing form with Zod validation and `react-signature-canvas`
- Server-generated receipt ID, timestamp, IP, and user agent
- Signed PDF generated with `pdf-lib`
- Real email delivery via Nodemailer (signer and supplier in separate messages)
- Printable browser receipt

## Prerequisites

- Node.js 20+
- An SMTP account that supports port **587** with STARTTLS (Gmail App Password recommended for demos)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in values:

```bash
cp .env.example .env.local
```

3. Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Use `587` for STARTTLS |
| `SMTP_USER` | SMTP username (usually your email) |
| `SMTP_PASSWORD` | SMTP password or App Password |
| `EMAIL_FROM_NAME` | Display name in the From header |
| `SUPPLIER_EMAIL` | Fixed supplier inbox for the second confirmation email |

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gmail App Password

If you use Gmail:

1. Enable 2-Step Verification on the Google account.
2. Open [Google App Passwords](https://myaccount.google.com/apppasswords) and create a password for “Mail”.
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` to your Gmail address, and `SMTP_PASSWORD` to the 16-character App Password (not your normal login password).
4. Set `SUPPLIER_EMAIL` to the inbox that should receive supplier copies.

Never commit `.env.local` or real credentials. `.env*` is gitignored; `.env.example` is allowed via an exception.

## Scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # run production build
npm run lint   # ESLint
```

## Deploy on Vercel

1. Push the repository to GitHub and import the project in [Vercel](https://vercel.com).
2. In Project Settings → Environment Variables, add the same keys as `.env.example` for Production (and Preview if desired).
3. Deploy. Outbound SMTP on port 587 works on Vercel for many providers; if delivery fails, confirm your SMTP host allows connections from cloud IPs and that credentials are correct.
4. After deploy, sign a test agreement and confirm both the signer and `SUPPLIER_EMAIL` receive the PDF attachment.

## Security notes

- SMTP credentials are server-only and must never appear in client code or API responses.
- This demo includes a honeypot field and a minimum form completion time.
- Production use should add persistent rate limiting and/or CAPTCHA.
- Email subjects and body templates are fixed; the Terms content is canonical and not client-editable.

## Stack

- Next.js (App Router) · React · TypeScript · Tailwind CSS
- Zod · pdf-lib · Nodemailer · react-signature-canvas · lucide-react
