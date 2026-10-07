// Country → state/province list. The dataset is loaded lazily so it stays out of the main bundle.
// Returns [] when a country has no subdivisions in the dataset (caller falls back to free text).

const ALIASES = {
  'Bahamas': 'The Bahamas',
  'Cabo Verde': 'Cape Verde',
  'Congo (DRC)': 'Democratic Republic of the Congo',
  'Congo (Republic)': 'Congo',
  'Eswatini': 'Swaziland',
  'North Macedonia': 'Macedonia',
  'Palestine': 'Palestinian Territory Occupied',
  'Timor-Leste': 'East Timor',
  'Vatican City': 'Vatican City State (Holy See)',
  'São Tomé & Príncipe': 'Sao Tome and Principe',
};

const norm = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

let cache = null;

async function load() {
  if (!cache) {
    const mod = await import('country-state-city');
    cache = mod.default && mod.default.Country ? mod.default : mod;
  }
  return cache;
}

export async function getStatesForCountry(countryName) {
  if (!countryName) return [];
  try {
    const { Country, State } = await load();
    const target = norm(ALIASES[countryName] || countryName);
    const country = Country.getAllCountries().find((c) => norm(c.name) === target);
    if (!country) return [];
    const names = State.getStatesOfCountry(country.isoCode).map((s) => s.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}
