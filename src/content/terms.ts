export type TermsSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type TermsDocument = {
  title: string;
  version: string;
  effectiveDate: string;
  sections: TermsSection[];
};

export const termsDocument: TermsDocument = {
  title: "Master Professional Services Terms and Conditions",
  version: "2026.1",
  effectiveDate: "1 January 2026",
  sections: [
    {
      id: "introduction",
      heading: "1. Introduction",
      paragraphs: [
        "These Master Professional Services Terms and Conditions (the “Agreement”) govern the engagement between the supplier named in the associated statement of work or order form (the “Supplier”) and the client entity identified at the time of signing (the “Client”). By signing this Agreement, the Client confirms that it has read, understood, and accepts the terms set out below.",
        "This document is presented through SignFlow as a portfolio demonstration of an electronic signing workflow. It is labelled as a demonstration agreement and is not intended to create a legally binding contract between any parties in a production commercial engagement.",
        "Capitalized terms used but not defined in a particular section have the meanings given in this Agreement. Where a statement of work, proposal, or order form conflicts with these terms, these terms prevail unless the statement of work expressly states otherwise in writing and is signed by authorized representatives of both parties.",
      ],
    },
    {
      id: "scope",
      heading: "2. Scope of services",
      paragraphs: [
        "The Supplier will provide professional services as described in the applicable statement of work, proposal, or order form (the “Services”). Services may include advisory consulting, project delivery, technical implementation, construction management support, documentation, training, and related deliverables.",
        "Unless otherwise agreed in writing, the Supplier’s obligations are limited to the Services expressly described. Work outside that scope is treated as a change request and may require additional fees, revised timelines, or both.",
        "The Supplier will perform the Services with reasonable skill and care consistent with professional standards ordinarily applied by reputable firms providing similar services under similar circumstances. Timelines are estimates unless the statement of work expressly designates a firm delivery date.",
      ],
      bullets: [
        "Discovery, planning, and requirements workshops",
        "Delivery of agreed artefacts, reports, or work products",
        "Coordination with Client stakeholders as reasonably required",
        "Handover, documentation, and knowledge transfer activities",
      ],
    },
    {
      id: "client-responsibilities",
      heading: "3. Client responsibilities",
      paragraphs: [
        "The Client will provide timely access to personnel, information, systems, premises, and decisions reasonably required for the Supplier to perform the Services. Delays attributable to the Client may extend delivery dates and may result in additional charges where the Supplier incurs unavoidable standby or remobilization costs.",
        "The Client remains responsible for the accuracy and completeness of information it supplies, for obtaining internal approvals, and for any decisions regarding the adoption or use of deliverables.",
        "The Client will designate a primary contact with authority to provide instructions and accept deliverables. Instructions from that contact are treated as authorized Client instructions unless the Client notifies the Supplier otherwise in writing.",
      ],
      bullets: [
        "Provide access credentials, documentation, and background materials promptly",
        "Ensure key stakeholders are available for scheduled workshops and reviews",
        "Review draft deliverables within the periods stated in the statement of work",
        "Comply with applicable laws, safety rules, and site protocols when Supplier personnel attend Client premises",
      ],
    },
    {
      id: "payment",
      heading: "4. Payment terms",
      paragraphs: [
        "Fees, expenses, and billing milestones are set out in the applicable statement of work or order form. Unless otherwise stated, invoices are payable within thirty (30) days of the invoice date in the currency specified.",
        "Late payments may accrue interest at the lower of 1.5% per month or the maximum rate permitted by law, calculated from the due date until payment is received in full. The Supplier may suspend Services after providing written notice if undisputed amounts remain unpaid for more than fifteen (15) days after the due date.",
        "Taxes, duties, and similar governmental charges (other than taxes based on the Supplier’s net income) are payable by the Client in addition to the stated fees, unless the Client provides a valid exemption certificate acceptable to the relevant authority.",
        "Expenses that are pre-approved in writing, or that fall within expense categories listed in the statement of work, are reimbursable at cost. Travel will be booked in a commercially reasonable manner consistent with any Client travel policy provided in advance.",
      ],
    },
    {
      id: "confidentiality",
      heading: "5. Confidentiality",
      paragraphs: [
        "Each party may receive Confidential Information of the other in connection with the Services. “Confidential Information” means non-public information designated as confidential or that a reasonable person would understand to be confidential given its nature and the circumstances of disclosure, including business plans, pricing, technical designs, personal data, and project materials.",
        "The receiving party will use Confidential Information only to perform under this Agreement, will protect it with at least the same degree of care it uses for its own similar information (and in no event less than reasonable care), and will not disclose it to third parties except to personnel and contractors with a need to know who are bound by confidentiality obligations no less protective than those in this section.",
        "Obligations do not apply to information that is or becomes public other than through breach, was already known without confidentiality duty, is independently developed, or is required to be disclosed by law or court order, provided the receiving party gives prompt notice where legally permitted and cooperates reasonably in seeking protective treatment.",
        "Confidentiality obligations survive for five (5) years after termination or expiry of this Agreement, except that trade secrets remain protected for so long as they qualify as trade secrets under applicable law.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "6. Intellectual property",
      paragraphs: [
        "Each party retains all right, title, and interest in and to its pre-existing intellectual property, tools, methodologies, templates, and materials. Nothing in this Agreement transfers ownership of pre-existing materials except as expressly stated.",
        "Upon full payment of fees due for the relevant deliverables, the Supplier grants the Client a non-exclusive, non-transferable, worldwide license to use deliverables created specifically for the Client under the Services for the Client’s internal business purposes, subject to any third-party licence restrictions identified in writing.",
        "The Supplier may retain and reuse generic know-how, residual knowledge, and non-Client-specific materials developed or employed in the course of the Services, provided such reuse does not disclose Client Confidential Information.",
        "The Client grants the Supplier a limited license to use Client materials solely as needed to perform the Services. The Client represents that it has the rights necessary to provide such materials for that purpose.",
      ],
    },
    {
      id: "liability",
      heading: "7. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, neither party is liable to the other for indirect, incidental, special, consequential, punitive, or exemplary damages, or for loss of profits, revenue, goodwill, or anticipated savings, whether arising in contract, tort (including negligence), or otherwise, even if advised of the possibility of such damages.",
        "Subject to the preceding paragraph and excluding liability that cannot be limited by law (including liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation), each party’s aggregate liability arising out of or relating to this Agreement is limited to the total fees paid or payable by the Client to the Supplier under the applicable statement of work in the twelve (12) months preceding the claim.",
        "The parties acknowledge that the fees reflect this allocation of risk and that the limitations are a fundamental element of the bargain. The Client is responsible for maintaining appropriate insurance and for implementing backups, access controls, and operational safeguards for its own systems and data.",
      ],
    },
    {
      id: "termination",
      heading: "8. Termination",
      paragraphs: [
        "Either party may terminate this Agreement or an individual statement of work for convenience by providing thirty (30) days’ prior written notice, unless the statement of work specifies a different notice period or a fixed non-cancellable engagement period.",
        "Either party may terminate immediately by written notice if the other party materially breaches this Agreement and fails to cure the breach within fifteen (15) days after receiving written notice describing the breach in reasonable detail, or if the other party becomes insolvent, ceases operations, or enters bankruptcy or similar proceedings.",
        "Upon termination, the Client will pay for Services performed and authorized expenses incurred through the effective termination date. Provisions that by their nature should survive (including confidentiality, intellectual property, limitation of liability, and governing terms) continue in accordance with their terms.",
        "At the Client’s written request and subject to payment of outstanding amounts, the Supplier will reasonably cooperate in an orderly transition, including return or destruction of Client Confidential Information, except for archival copies retained under legal or professional obligations.",
      ],
    },
    {
      id: "governing",
      heading: "9. Governing terms",
      paragraphs: [
        "This Agreement is governed by the laws of England and Wales, without regard to conflict-of-law principles. The parties submit to the exclusive jurisdiction of the courts of England and Wales, except that the Supplier may seek injunctive or other equitable relief in any court of competent jurisdiction to protect Confidential Information or intellectual property.",
        "If any provision is held unenforceable, it will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions continue in full force. Failure to enforce a provision is not a waiver of future enforcement of that or any other provision.",
        "This Agreement, together with the applicable statements of work and any documents expressly incorporated by reference, constitutes the entire agreement between the parties regarding its subject matter and supersedes prior or contemporaneous agreements, proposals, and representations relating to that subject matter. Amendments must be in writing and signed by authorized representatives of both parties.",
        "Notices under this Agreement must be in writing and delivered by hand, tracked courier, or email with confirmation of receipt to the addresses set out in the statement of work or as updated by notice. Notices are deemed received on the business day of delivery if delivered before 17:00 local time, otherwise on the next business day.",
      ],
    },
    {
      id: "acceptance",
      heading: "10. Acceptance",
      paragraphs: [
        "By completing the signing form below, drawing a signature, and confirming the agreement checkbox, the individual representing the Client affirms that they have authority to bind the Client to these Terms and Conditions, that they have read the document in full, and that the Client accepts the terms as presented.",
        "The electronic signature captured through this portal, together with the audit receipt generated by the server (including receipt identifier, timestamp, IP address, and user agent), constitutes the record of acceptance for this demonstration workflow.",
        "Demonstration notice: This agreement is provided solely to demonstrate SignFlow’s document review, signature capture, PDF generation, and email delivery capabilities. It is not intended to create a legally binding contract.",
      ],
    },
  ],
};
