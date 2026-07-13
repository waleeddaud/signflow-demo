import { ShieldCheck } from "lucide-react";
import { termsDocument } from "@/content/terms";

export function SiteHeader() {
  return (
    <header className="no-print border-b border-border bg-paper">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="text-lg font-semibold tracking-tight text-ink">
            SignFlow
          </span>
          <span className="hidden truncate text-sm text-muted sm:inline">
            Agreement portal
          </span>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-verify"
          title="This document is served over a secure connection"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>Secure document</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2 text-xs text-muted sm:px-6">
        <span className="font-medium text-body">{termsDocument.title}</span>
        <span>Version {termsDocument.version}</span>
        <span>Effective {termsDocument.effectiveDate}</span>
      </div>
    </header>
  );
}
