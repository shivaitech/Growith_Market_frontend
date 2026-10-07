// Client-side OCR + parsing for KYC documents. Runs entirely in the browser (tesseract.js),
// so document images are not sent anywhere until the user submits the form.
// Everything here is best-effort — callers must let the user review and edit the result.

const DEMONYMS = {
  India: 'Indian', 'United Arab Emirates': 'Emirati', 'United States': 'American',
  'United Kingdom': 'British', Canada: 'Canadian', Australia: 'Australian', Pakistan: 'Pakistani',
  Bangladesh: 'Bangladeshi', Nepal: 'Nepali', 'Sri Lanka': 'Sri Lankan', Singapore: 'Singaporean',
  Germany: 'German', France: 'French', Italy: 'Italian', Spain: 'Spanish', Netherlands: 'Dutch',
  'Saudi Arabia': 'Saudi', Qatar: 'Qatari', Oman: 'Omani', Kuwait: 'Kuwaiti', Bahrain: 'Bahraini',
  Egypt: 'Egyptian', Philippines: 'Filipino', Malaysia: 'Malaysian', Indonesia: 'Indonesian',
};

const MRZ_CODES = {
  IND: 'Indian', ARE: 'Emirati', USA: 'American', GBR: 'British', CAN: 'Canadian', AUS: 'Australian',
  PAK: 'Pakistani', BGD: 'Bangladeshi', NPL: 'Nepali', LKA: 'Sri Lankan', SGP: 'Singaporean',
  DEU: 'German', FRA: 'French', ITA: 'Italian', ESP: 'Spanish', NLD: 'Dutch', SAU: 'Saudi',
  QAT: 'Qatari', OMN: 'Omani', KWT: 'Kuwaiti', BHR: 'Bahraini', EGY: 'Egyptian', PHL: 'Filipino',
  MYS: 'Malaysian', IDN: 'Indonesian',
};

export const demonymFor = (country) => DEMONYMS[country] || '';

/** Run OCR on an image file. Returns '' for PDFs / unsupported files / failures. */
export async function extractText(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return '';
  if (/heic|heif/i.test(file.type)) return '';
  try {
    const mod = await import('tesseract.js');
    const T = mod.default || mod;
    const { data } = await T.recognize(file, 'eng');
    return data?.text || '';
  } catch {
    return '';
  }
}

const pad = (n) => String(n).padStart(2, '0');

function isAdultDob(y, m, d) {
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return false;
  const age = (Date.now() - dt.getTime()) / (365.25 * 24 * 3600 * 1000);
  return age >= 18 && age <= 100;
}

function parseDob(text) {
  // Passport MRZ (line 2): ...<9 doc no><check><3 nationality><YYMMDD><check><sex>
  const mrz = text.replace(/\s/g, '').match(/[A-Z0-9<]{9}\d([A-Z<]{3})(\d{2})(\d{2})(\d{2})\d[MF<]/);
  if (mrz) {
    const yy = Number(mrz[2]);
    const y = yy > new Date().getFullYear() % 100 ? 1900 + yy : 2000 + yy;
    if (isAdultDob(y, Number(mrz[3]), Number(mrz[4]))) return `${y}-${mrz[3]}-${mrz[4]}`;
  }

  const lines = text.split('\n');
  const re = /\b(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{4})\b/g;
  const found = [];
  lines.forEach((line) => {
    const labelled = /dob|d\.o\.b|birth|जन्म/i.test(line);
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(line))) {
      const d = Number(m[1]); const mo = Number(m[2]); const y = Number(m[3]);
      if (isAdultDob(y, mo, d)) found.push({ iso: `${y}-${pad(mo)}-${pad(d)}`, y, labelled });
    }
  });
  if (!found.length) return '';
  const labelled = found.find((f) => f.labelled);
  if (labelled) return labelled.iso;
  // Unlabelled: issue/expiry dates are later than the birth date, so take the oldest.
  return found.sort((a, b) => a.y - b.y)[0].iso;
}

function parseNationality(text, country) {
  const mrz = text.replace(/\s/g, '').match(/[A-Z0-9<]{9}\d([A-Z<]{3})\d{6}\d[MF<]/);
  if (mrz && MRZ_CODES[mrz[1]]) return MRZ_CODES[mrz[1]];
  const m = text.match(/nationality[^A-Za-z]{0,6}([A-Za-z][A-Za-z ]{2,30})/i);
  if (m) {
    const raw = m[1].trim().split('\n')[0].trim();
    const byCountry = Object.keys(DEMONYMS).find((c) => c.toLowerCase() === raw.toLowerCase());
    if (byCountry) return DEMONYMS[byCountry];
    return raw.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return demonymFor(country);
}

function parseAddress(text, state) {
  const m = text.match(/address\s*[:\-]?\s*([\s\S]{10,260}?)(?:\n\s*\n|vid\b|help@|www\.|$)/i);
  if (!m) return { address: '', city: '' };
  let address = m[1].replace(/\s*\n\s*/g, ', ').replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').trim();
  address = address.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '').replace(/,\s*,/g, ',');
  address = address.replace(/^[,.\s]+|[,.\s]+$/g, '').slice(0, 200);

  let city = '';
  const dist = address.match(/\b(?:dist(?:rict)?|city)\s*[:.\-]?\s*([A-Za-z ]{3,40})/i);
  if (dist) {
    city = dist[1].trim();
  } else {
    const parts = address.split(',').map((p) => p.replace(/\d{5,6}|[-–]/g, '').trim()).filter(Boolean);
    const stateLc = (state || '').toLowerCase();
    const cand = parts.filter((p) => p.toLowerCase() !== stateLc && /^[A-Za-z .]{3,40}$/.test(p));
    city = cand[cand.length - 1] || '';
  }
  return { address, city };
}

/**
 * texts: OCR text of each uploaded document. ctx: { country, state, fullName }.
 * Returns only the fields it could find; empty string = not found.
 */
export function parseKycText(texts, ctx = {}) {
  const joined = texts.filter(Boolean).join('\n');
  if (!joined.trim()) {
    return { dob: '', nationality: demonymFor(ctx.country), address: '', city: '', nameMatch: null };
  }
  const { address, city } = parseAddress(joined, ctx.state);

  let nameMatch = null;
  const tokens = (ctx.fullName || '').toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length) {
    const lc = joined.toLowerCase();
    nameMatch = tokens.every((t) => lc.includes(t));
  }

  return {
    dob: parseDob(joined),
    nationality: parseNationality(joined, ctx.country),
    address,
    city,
    nameMatch,
  };
}

export const parseAadhaarNumber = (text) => {
  const m = (text || '').match(/\b(\d{4})\s?(\d{4})\s?(\d{4})\b/);
  return m ? `${m[1]} ${m[2]} ${m[3]}` : '';
};

export const parsePanNumber = (text) => {
  const m = (text || '').toUpperCase().match(/\b[A-Z]{5}\d{4}[A-Z]\b/);
  return m ? m[0] : '';
};
