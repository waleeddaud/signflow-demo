"use client";

import { CheckCircle2, Printer, RotateCcw } from "lucide-react";
import type { ReceiptData } from "@/lib/receipt-types";

type ReceiptScreenProps = {
  receipt: ReceiptData;
  onStartNew: () => void;
};

function formatDisplayDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ReceiptScreen({ receipt, onStartNew }: ReceiptScreenProps) {
  return (
    <div className="receipt-print rounded border border-border bg-paper p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 size-7 shrink-0 text-success"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-success">
            Verified
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
            Agreement signed successfully
          </h2>
          <p className="mt-2 text-sm text-muted">
            Email sent to signer and supplier
          </p>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Receipt ID</dt>
          <dd className="mt-1 break-all font-medium tabular-nums text-ink">
            {receipt.receiptId}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Document version</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.documentVersion}</dd>
        </div>
        <div>
          <dt className="text-muted">Signer name</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.fullName}</dd>
        </div>
        <div>
          <dt className="text-muted">Company</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.company}</dd>
        </div>
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="mt-1 break-all font-medium text-ink">{receipt.email}</dd>
        </div>
        <div>
          <dt className="text-muted">Position</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.position}</dd>
        </div>
        <div>
          <dt className="text-muted">IP address</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.ipAddress}</dd>
        </div>
        <div>
          <dt className="text-muted">Server date and time (UTC)</dt>
          <dd className="mt-1 font-medium text-ink">
            {formatDisplayDate(receipt.auditedAt)}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted">Document</dt>
          <dd className="mt-1 font-medium text-ink">{receipt.documentTitle}</dd>
        </div>
      </dl>

      <p className="print-only mt-6 text-xs text-muted">
        SignFlow demonstration receipt · Not a legally binding contract
      </p>

      <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-page"
        >
          <Printer className="size-4" aria-hidden="true" />
          Print / Save Receipt
        </button>
        <button
          type="button"
          onClick={onStartNew}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded bg-action px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Start New Agreement
        </button>
      </div>
    </div>
  );
}
