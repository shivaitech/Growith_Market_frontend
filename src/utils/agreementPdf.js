// Private Participation Agreement: prefill, e-sign and flatten using the AcroForm in the template PDF.
// pdf-lib is loaded lazily so it stays out of the main bundle.

export const AGREEMENT_PDF = '/assets/documents/ShivAI_DOS_Private_Participation_Agreement.pdf';
export const AGREEMENT_VERSION = '1.0';

// Field names match the form fields inside the template PDF.
export const FIELD_GROUPS = [
  {
    title: 'Your details',
    fields: [
      { name: 'participant_full_name', label: 'Full name', required: true },
      { name: 'participant_email', label: 'Email', required: true },
      { name: 'participant_phone', label: 'Telephone' },
      { name: 'country_of_residence', label: 'Country of residence' },
      { name: 'nominee', label: 'Nominee (optional)' },
    ],
  },
  {
    title: 'Participation (set when you invest)',
    fields: [
      { name: 'participation_level', label: 'Participation level (USD)', fixed: true },
      { name: 'participation_amount', label: 'Participation amount', fixed: true },
      { name: 'price_per_dos', label: 'Price per DOS (USD)', fixed: true },
      { name: 'dos_allocated', label: 'DOS allocated', fixed: true },
      { name: 'hold_bonus_percent', label: 'Hold bonus', fixed: true },
      { name: 'credit_date', label: 'Credit date', fixed: true },
      { name: 'month_12_date', label: 'Month 12 date', fixed: true },
      { name: 'month_24_date', label: 'Month 24 date', fixed: true },
    ],
  },
  {
    title: 'Company details',
    fields: [
      { name: 'company_licence_no', label: 'Licence number', fixed: true },
      { name: 'company_registered_address', label: 'Registered address', fixed: true },
      { name: 'company_notice_contact', label: 'Notice contact', fixed: true },
      { name: 'dispute_forum', label: 'Dispute forum', fixed: true },
      { name: 'company_authorised_representative', label: 'Authorised representative', fixed: true },
      { name: 'company_representative_title', label: 'Representative title', fixed: true },
    ],
  },
  {
    title: 'Agreement record',
    fields: [
      { name: 'effective_date', label: 'Effective date', fixed: true },
      { name: 'growith_account_id', label: 'Growith account ID', fixed: true },
      { name: 'agreement_version', label: 'Agreement version', fixed: true },
      { name: 'kyc_status', label: 'KYC status', fixed: true },
      { name: 'payment_reference', label: 'Payment reference', fixed: true },
    ],
  },
];

/** The value printed for a field that the user cannot edit. */
export const fixedValue = (name, values = {}) =>
  PARTICIPATION_PLACEHOLDERS[name] ?? COMPANY_DETAILS[name] ?? values[name] ?? '';

// Not shown to the user. The investment is made after the agreement is signed, so these cannot be
// known yet; the agreement states how each one will be determined instead.
export const PARTICIPATION_PLACEHOLDERS = {
  participation_level: 'As per Final Participated amount',
  participation_amount: 'As per Final Participated amount',
  price_per_dos: 'Per Schedule 2',
  dos_allocated: 'As per Final Participated amount',
  hold_bonus_percent: 'Per Schedule 2',
  credit_date: 'On wallet credit',
  month_12_date: 'Credit date + 12 mo.',
  month_24_date: 'Credit date + 24 mo.',
  payment_reference: 'Assigned at payment',
};

// Not shown to the user. Fixed ShivAI company details printed on every agreement.
// TODO: fill these in (values are not final until provided by ShivAI).
export const COMPANY_DETAILS = {
  company_licence_no: '',
  company_registered_address: '',
  company_notice_contact: '',
  dispute_forum: '',
  company_authorised_representative: '',
  company_representative_title: '',
};

const longDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** Initial values for the form, filled from the investor's KYC / profile data. */
export function buildPrefill(investor = {}) {
  const kyc = String(investor.kycStatus || '');
  return {
    participant_full_name: investor.name || '',
    participant_email: investor.email || '',
    participant_phone: investor.phone || '',
    country_of_residence: investor.country || '',
    effective_date: longDate(new Date()),
    growith_account_id: investor.accountId || '',
    agreement_version: AGREEMENT_VERSION,
    kyc_status: kyc ? kyc.charAt(0).toUpperCase() + kyc.slice(1).replace(/_/g, ' ') : '',
  };
}

// Small boxes: shrink the font so longer values still fit on one line
const FONT_SIZE = {
  company_registered_address: 7, company_notice_contact: 7, dispute_forum: 7, participant_full_name: 8,
  month_12_date: 7, month_24_date: 7, participation_level: 6.5, participation_amount: 6.5, dos_allocated: 6.5, price_per_dos: 7.5, hold_bonus_percent: 7.5,
};

/**
 * Fill the template, stamp the e-signature on the last page, flatten the form and return PDF bytes.
 * signature: { bytes: Uint8Array, kind: 'png' | 'jpg' }
 */
export async function generateSignedAgreement({ values, signature, signerName, signedAt = new Date() }) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const res = await fetch(AGREEMENT_PDF);
  if (!res.ok) throw new Error('Could not load the agreement template.');
  const doc = await PDFDocument.load(await res.arrayBuffer());
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const form = doc.getForm();

  const stamp = signedAt.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
  const all = {
    ...values,
    ...PARTICIPATION_PLACEHOLDERS,
    ...COMPANY_DETAILS,
    acceptance_timestamp: stamp,
    acceptance_action: 'Electronically signed (e-signature)',
  };

  // The template prints each "@@placeholder@@" as page text underneath its field. Blank out that
  // area first so the placeholder can never show through the filled value after flattening.
  const widgetPage = new Map();
  doc.getPages().forEach((pg) => {
    const annots = pg.node.Annots();
    if (!annots) return;
    annots.asArray().forEach((ref) => {
      const dict = doc.context.lookup(ref);
      if (dict) widgetPage.set(dict, pg);
    });
  });
  form.getFields().forEach((field) => {
    field.acroField.getWidgets().forEach((widget) => {
      const pg = widgetPage.get(widget.dict);
      if (!pg) return;
      const r = widget.getRectangle();
      widget.getOrCreateAppearanceCharacteristics().setBackgroundColor([1, 1, 1]);
      pg.drawRectangle({ x: r.x - 0.5, y: r.y - 0.5, width: r.width + 1, height: r.height + 1, color: rgb(1, 1, 1), borderWidth: 0 });
    });
  });

  try {
    form.getFields().forEach((field) => {
      const name = field.getName();
      if (typeof field.setText !== 'function') return;
      field.setText(String(all[name] ?? '').trim());
      field.setFontSize(FONT_SIZE[name] || 8);
    });
    form.updateFieldAppearances(font);
  } catch {
    throw new Error('Some characters cannot be placed in the agreement. Please use English letters and numbers in the fields.');
  }
  form.flatten();

  // Signature block on the last page, below the PARTICIPANT box
  const page = doc.getPage(doc.getPageCount() - 1);
  const img = signature.kind === 'jpg' ? await doc.embedJpg(signature.bytes) : await doc.embedPng(signature.bytes);
  const maxW = 190;
  const maxH = 56;
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = 54;
  const lineY = 270;
  const ink = rgb(0.05, 0.08, 0.25);

  page.drawText('PARTICIPANT E-SIGNATURE', { x, y: lineY + h + 14, size: 8, font: bold, color: ink });
  page.drawImage(img, { x, y: lineY + 4, width: w, height: h });
  page.drawLine({ start: { x, y: lineY }, end: { x: x + 220, y: lineY }, thickness: 0.8, color: ink });
  const safeName = String(signerName || values.participant_full_name || '').replace(/[^\x20-\x7E]/g, '');
  page.drawText(`Signed electronically by ${safeName || 'the Participant'}`, { x, y: lineY - 12, size: 8, font, color: ink });
  page.drawText(`Date and time: ${stamp}`, { x, y: lineY - 23, size: 8, font, color: ink });
  page.drawText('This signature constitutes execution of the Agreement in accordance with Clause 24.', { x, y: lineY - 34, size: 7, font, color: rgb(0.35, 0.38, 0.5) });

  return doc.save();
}
