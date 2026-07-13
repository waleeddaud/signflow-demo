"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  getDefaultSigningDate,
  signFormSchema,
  type SignFormClientValues,
} from "@/lib/sign-schema";
import type { ReceiptData } from "@/lib/receipt-types";
import { ReceiptScreen } from "@/components/ReceiptScreen";

const SignaturePad = dynamic(
  () =>
    import("@/components/SignaturePad").then((mod) => mod.SignaturePad),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[220px] items-center justify-center rounded border border-border bg-page text-sm text-muted"
        aria-busy="true"
      >
        Loading signature pad…
      </div>
    ),
  },
);

type FieldErrors = Partial<Record<keyof SignFormClientValues, string>>;

function fieldError(
  issues: { path: PropertyKey[]; message: string }[],
  key: keyof SignFormClientValues,
): string | undefined {
  return issues.find((issue) => issue.path[0] === key)?.message;
}

export function SigningForm() {
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [signingDate, setSigningDate] = useState(getDefaultSigningDate);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  const values: SignFormClientValues = useMemo(
    () => ({
      fullName,
      position,
      company,
      email,
      signingDate,
      signatureDataUrl: signatureDataUrl ?? "",
      agreed,
      website,
      formStartedAt,
    }),
    [
      fullName,
      position,
      company,
      email,
      signingDate,
      signatureDataUrl,
      agreed,
      website,
      formStartedAt,
    ],
  );

  const clientResult = useMemo(() => signFormSchema.safeParse(values), [values]);

  const canSubmit =
    clientResult.success &&
    Boolean(signatureDataUrl) &&
    agreed &&
    !submitting &&
    !isPending;

  useEffect(() => {
    if (!showErrors) return;
    if (!clientResult.success) {
      const next: FieldErrors = {};
      for (const issue of clientResult.error.issues) {
        const key = issue.path[0] as keyof SignFormClientValues | undefined;
        if (key && !next[key] && key !== "website" && key !== "formStartedAt") {
          next[key] = issue.message;
        }
      }
      setErrors(next);
    } else {
      setErrors({});
    }
  }, [clientResult, showErrors]);

  const resetForm = () => {
    setFullName("");
    setPosition("");
    setCompany("");
    setEmail("");
    setSigningDate(getDefaultSigningDate());
    setSignatureDataUrl(null);
    setAgreed(false);
    setWebsite("");
    setErrors({});
    setShowErrors(false);
    setSubmitError(null);
    setReceipt(null);
    setSubmitting(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setShowErrors(true);

    const parsed = signFormSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SignFormClientValues | undefined;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    startTransition(async () => {
      try {
        const response = await fetch("/api/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        const data = (await response.json()) as {
          ok?: boolean;
          error?: string;
          receipt?: ReceiptData;
        };

        if (!response.ok || !data.ok || !data.receipt) {
          setSubmitError(
            data.error ??
              "We could not complete signing. Please try again in a moment.",
          );
          setSubmitting(false);
          return;
        }

        setReceipt(data.receipt);
        setSubmitting(false);
      } catch {
        setSubmitError(
          "We could not complete signing. Please check your connection and try again.",
        );
        setSubmitting(false);
      }
    });
  };

  if (receipt) {
    return <ReceiptScreen receipt={receipt} onStartNew={resetForm} />;
  }

  const inputClass =
    "mt-1 w-full rounded border border-border bg-paper px-3 py-2.5 text-base text-body transition-colors placeholder:text-muted focus:border-action disabled:opacity-60";

  return (
    <section
      className="mt-12 border-t border-border pt-10 font-sans"
      aria-labelledby="signing-heading"
    >
      <h2 id="signing-heading" className="text-xl font-semibold text-ink">
        Sign this agreement
      </h2>
      <p className="mt-2 text-sm text-muted">
        Complete the fields below and draw your signature. Required fields are
        marked.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Honeypot — leave empty */}
        <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="text-sm font-medium text-ink">
              Full name <span className="text-error">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              disabled={submitting}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={inputClass}
            />
            {errors.fullName ? (
              <p id="fullName-error" className="mt-1 text-sm text-error" role="alert">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="position" className="text-sm font-medium text-ink">
              Position / job title <span className="text-error">*</span>
            </label>
            <input
              id="position"
              name="position"
              type="text"
              autoComplete="organization-title"
              required
              disabled={submitting}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              aria-invalid={Boolean(errors.position)}
              aria-describedby={errors.position ? "position-error" : undefined}
              className={inputClass}
            />
            {errors.position ? (
              <p id="position-error" className="mt-1 text-sm text-error" role="alert">
                {errors.position}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="company" className="text-sm font-medium text-ink">
              Company <span className="text-error">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              disabled={submitting}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "company-error" : undefined}
              className={inputClass}
            />
            {errors.company ? (
              <p id="company-error" className="mt-1 text-sm text-error" role="alert">
                {errors.company}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email address <span className="text-error">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              disabled={submitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
            />
            {errors.email ? (
              <p id="email-error" className="mt-1 text-sm text-error" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="signingDate" className="text-sm font-medium text-ink">
              Signing date <span className="text-error">*</span>
            </label>
            <input
              id="signingDate"
              name="signingDate"
              type="date"
              required
              disabled={submitting}
              value={signingDate}
              onChange={(e) => setSigningDate(e.target.value)}
              aria-invalid={Boolean(errors.signingDate)}
              aria-describedby={errors.signingDate ? "signingDate-error" : undefined}
              className={inputClass}
            />
            {errors.signingDate ? (
              <p id="signingDate-error" className="mt-1 text-sm text-error" role="alert">
                {errors.signingDate}
              </p>
            ) : null}
          </div>
        </div>

        <SignaturePad
          disabled={submitting}
          error={
            errors.signatureDataUrl ??
            (!signatureDataUrl && Object.keys(errors).length > 0
              ? fieldError(
                  clientResult.success ? [] : clientResult.error.issues,
                  "signatureDataUrl",
                )
              : undefined)
          }
          onSignatureChange={setSignatureDataUrl}
        />

        <div className="flex items-start gap-3">
          <input
            id="agreed"
            name="agreed"
            type="checkbox"
            checked={agreed}
            disabled={submitting}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-invalid={Boolean(errors.agreed)}
            aria-describedby={errors.agreed ? "agreed-error" : undefined}
            className="mt-1 size-5 shrink-0 rounded border-border text-action accent-action"
          />
          <label htmlFor="agreed" className="text-sm leading-relaxed text-body">
            I confirm that I have read and agree to the Terms and Conditions
            shown above. <span className="text-error">*</span>
          </label>
        </div>
        {errors.agreed ? (
          <p id="agreed-error" className="-mt-3 text-sm text-error" role="alert">
            {errors.agreed}
          </p>
        ) : null}

        {submitError ? (
          <div
            className="rounded border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
            role="alert"
          >
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-11 w-full items-center justify-center rounded bg-action px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting || isPending ? "Signing and sending…" : "Sign and Send"}
        </button>
      </form>
    </section>
  );
}
