// Country dial codes for phone inputs. Loaded lazily (shares the dataset with countryStates).
import { ALIASES, norm } from './countryStates';

let cache = null;

const mainCode = (raw) => String(raw || '').replace(/[^\d-]/g, '').split('-')[0];

/** [{ iso, name, flag, code }] sorted by country name. `code` is digits only, e.g. "91". */
export async function getDialCodes() {
  if (cache) return cache;
  try {
    const mod = await import('country-state-city');
    const { Country } = mod.default && mod.default.Country ? mod.default : mod;
    cache = Country.getAllCountries()
      .map((c) => ({ iso: c.isoCode, name: c.name, flag: c.flag || '', code: mainCode(c.phonecode) }))
      .filter((c) => c.code)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    cache = [];
  }
  return cache;
}

/** ISO of the dial-code entry that matches a country name from the KYC country list. */
export function isoForCountryName(list, countryName) {
  if (!countryName) return '';
  const target = norm(ALIASES[countryName] || countryName);
  const hit = list.find((c) => norm(c.name) === target);
  return hit ? hit.iso : '';
}

/** Split "+919876543210" / "+91 98765 43210" into { iso, number }. Prefers the residence country on ties. */
export function splitInternationalPhone(list, raw, preferIso = '') {
  const digits = String(raw || '').replace(/[^\d+]/g, '');
  if (!digits.startsWith('+')) return null;
  const body = digits.slice(1);
  for (let len = 4; len >= 1; len -= 1) {
    const prefix = body.slice(0, len);
    const matches = list.filter((c) => c.code === prefix);
    if (matches.length) {
      const pick = matches.find((c) => c.iso === preferIso) || matches[0];
      return { iso: pick.iso, number: body.slice(len) };
    }
  }
  return null;
}
