import { termsDocument } from "@/content/terms";

export function TermsDocument() {
  return (
    <article className="font-serif text-body">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-pretty text-ink sm:text-3xl">
          {termsDocument.title}
        </h1>
        <p className="mt-3 text-sm text-muted" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
          Version {termsDocument.version} · Effective {termsDocument.effectiveDate}
        </p>
      </header>

      <div className="mt-8 space-y-10 text-[1.05rem] leading-[1.7]">
        {termsDocument.sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
            <h2
              id={`heading-${section.id}`}
              className="mb-3 scroll-mt-24 text-xl font-semibold text-pretty text-ink"
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
