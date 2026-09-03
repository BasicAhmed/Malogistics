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
};

function normalize(place: string): string {
  return place.trim().toLowerCase();
}

export function lookupDistance(origin: string, destination: string): number | null {
  if (!origin || !destination) return null;
  const key = `${normalize(origin)}|${normalize(destination)}`;
  return ROUTES[key] ?? null;
}
