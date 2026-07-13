import { SiteHeader } from "@/components/SiteHeader";
import { TermsDocument } from "@/components/TermsDocument";
import { SigningForm } from "@/components/SigningForm";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div
          className="no-print mx-auto mb-6 max-w-3xl rounded border border-border bg-paper px-4 py-3 text-sm text-body"
          role="note"
        >
          Demonstration agreement — not intended to create a legally binding
          contract.
        </div>

        <div className="mx-auto max-w-3xl rounded border border-border bg-paper px-5 py-8 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:px-10 sm:py-12">
          <div className="mx-auto max-w-[72ch]">
            <TermsDocument />
            <SigningForm />
          </div>
        </div>
      </main>
      <footer className="no-print border-t border-border py-4 text-center text-xs text-muted">
        SignFlow demonstration portal
      </footer>
    </>
  );
}
