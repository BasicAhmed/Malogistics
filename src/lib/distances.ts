// Known route distances in km. Keys are normalized "origin|destination"
// (lowercase, trimmed). Extend this as real routes come up — it's the
// fastest way to get accurate distances without a paid maps API.
// Unmatched routes fall back to a manual distance entry in the calculator.

const ROUTES: Record<string, number> = {
  "windhoek|johannesburg": 1720,
  "johannesburg|windhoek": 1720,
  "gaborone|maputo": 1140,
  "maputo|gaborone": 1140,
  "johannesburg|durban": 580,
  "durban|johannesburg": 580,
  "windhoek|cape town": 1490,
  "cape town|windhoek": 1490,
  "johannesburg|cape town": 1400,
  "cape town|johannesburg": 1400,
  "johannesburg|gaborone": 360,
  "gaborone|johannesburg": 360,
  "johannesburg|harare": 1130,
  "harare|johannesburg": 1130,
  "johannesburg|lusaka": 1500,
  "lusaka|johannesburg": 1500,
  "johannesburg|maputo": 550,
  "maputo|johannesburg": 550,
  "durban|maputo": 590,
  "maputo|durban": 590,
  "johannesburg|pretoria": 55,
  "pretoria|johannesburg": 55,
  "johannesburg|bulawayo": 830,
  "bulawayo|johannesburg": 830,
  "durban|harare": 1650,
  "harare|durban": 1650,
  "cape town|durban": 1650,
  "durban|cape town": 1650,

  // Germiston (company base) — East Rand, effectively same distances as Johannesburg
  "germiston|durban": 570,
  "durban|germiston": 570,
  "germiston|cape town": 1400,
  "cape town|germiston": 1400,
  "germiston|gaborone": 320,
  "gaborone|germiston": 320,
  "germiston|maputo": 520,
  "maputo|germiston": 520,
  "germiston|harare": 1100,
  "harare|germiston": 1100,
  "germiston|lusaka": 1480,
  "lusaka|germiston": 1480,
  "germiston|windhoek": 1650,
  "windhoek|germiston": 1650,
  "germiston|bulawayo": 800,
  "bulawayo|germiston": 800,
  "germiston|pretoria": 40,
  "pretoria|germiston": 40,
  "germiston|johannesburg": 20,
  "johannesburg|germiston": 20,
};

function normalize(place: string): string {
  // Strip the ", Province/Country" suffix used by the location picker so
  // "Johannesburg, Gauteng" still matches the "johannesburg" route keys.
  return place.split(",")[0].trim().toLowerCase();
}

export function lookupDistance(origin: string, destination: string): number | null {
  if (!origin || !destination) return null;
  const key = `${normalize(origin)}|${normalize(destination)}`;
  return ROUTES[key] ?? null;
}
