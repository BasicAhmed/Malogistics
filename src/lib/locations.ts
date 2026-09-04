// Curated locations for validation and autocomplete. Until Google Maps
// Places API is wired in (needs a billed API key we don't have yet), this
// is the source of truth for "is this a real place we can quote on" — it
// keeps customers from typing junk into origin/destination fields, which
// matters a lot for a freight company. Extend this list as new lanes open.

export const KNOWN_LOCATIONS: string[] = [
  // Company home base + East Rand
  "Germiston, Gauteng",
  "Lambton, Germiston, Gauteng",
  "Boksburg, Gauteng",
  "Alberton, Gauteng",
  "Kempton Park, Gauteng",
  "Benoni, Gauteng",
  "Springs, Gauteng",
  "Edenvale, Gauteng",

  // Major SA metros
  "Johannesburg, Gauteng",
  "Sandton, Gauteng",
  "Pretoria, Gauteng",
  "Centurion, Gauteng",
  "Durban, KwaZulu-Natal",
  "Pietermaritzburg, KwaZulu-Natal",
  "Richards Bay, KwaZulu-Natal",
  "Cape Town, Western Cape",
  "Stellenbosch, Western Cape",
  "Port Elizabeth (Gqeberha), Eastern Cape",
  "East London, Eastern Cape",
  "Bloemfontein, Free State",
  "Polokwane, Limpopo",
  "Nelspruit (Mbombela), Mpumalanga",
  "Kimberley, Northern Cape",
  "Rustenburg, North West",
  "Nigel, Gauteng",
  "Vereeniging, Gauteng",
  "Klerksdorp, North West",

  // Regional / cross-border
  "Gaborone, Botswana",
  "Francistown, Botswana",
  "Maputo, Mozambique",
  "Maseru, Lesotho",
  "Mbabane, Eswatini",
  "Harare, Zimbabwe",
  "Bulawayo, Zimbabwe",
  "Lusaka, Zambia",
  "Windhoek, Namibia",
];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function isKnownLocation(value: string): boolean {
  const v = normalize(value);
  return KNOWN_LOCATIONS.some((loc) => normalize(loc) === v);
}

export function searchLocations(query: string, limit = 6): string[] {
  const q = normalize(query);
  if (!q) return [];
  return KNOWN_LOCATIONS.filter((loc) => normalize(loc).includes(q)).slice(0, limit);
}
