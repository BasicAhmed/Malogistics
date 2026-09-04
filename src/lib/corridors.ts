export interface Corridor {
  slug: string;
  origin: string;
  destination: string;
  distanceKm: number;
  transitTime: string;
  crossBorder: boolean;
  borderPost?: string;
  blurb: string;
}

export const CORRIDORS: Corridor[] = [
  {
    slug: "johannesburg-durban",
    origin: "Johannesburg",
    destination: "Durban",
    distanceKm: 580,
    transitTime: "8–10 hours",
    crossBorder: false,
    blurb:
      "The busiest domestic corridor in South Africa — Durban's port on one end, Gauteng's industrial base on the other. Daily capacity, no border delays.",
  },
  {
    slug: "johannesburg-cape-town",
    origin: "Johannesburg",
    destination: "Cape Town",
    distanceKm: 1400,
    transitTime: "20–24 hours",
    crossBorder: false,
    blurb:
      "Long-haul domestic freight connecting Gauteng to the Western Cape — a full day's transit, typically run overnight to overnight.",
  },
  {
    slug: "johannesburg-gaborone",
    origin: "Johannesburg",
    destination: "Gaborone, Botswana",
    distanceKm: 360,
    transitTime: "6–8 hours (plus border processing)",
    crossBorder: true,
    borderPost: "Kopfontein / Tlokweng",
    blurb:
      "A short cross-border run through Kopfontein — one of the more predictable SADC border posts, with same-day clearance in most cases.",
  },
  {
    slug: "johannesburg-harare",
    origin: "Johannesburg",
    destination: "Harare, Zimbabwe",
    distanceKm: 1130,
    transitTime: "18–24 hours (plus border processing)",
    crossBorder: true,
    borderPost: "Beit Bridge",
    blurb:
      "The main road link into Zimbabwe via Beit Bridge — one of the busiest border posts in the region, so clearance time varies by season and documentation readiness.",
  },
  {
    slug: "johannesburg-lusaka",
    origin: "Johannesburg",
    destination: "Lusaka, Zambia",
    distanceKm: 1500,
    transitTime: "24–30 hours (plus border processing)",
    crossBorder: true,
    borderPost: "Beit Bridge, then Chirundu",
    blurb:
      "A two-border route through Zimbabwe into Zambia — needs transit documentation sorted before departure to avoid delays at Chirundu.",
  },
  {
    slug: "johannesburg-maputo",
    origin: "Johannesburg",
    destination: "Maputo, Mozambique",
    distanceKm: 550,
    transitTime: "8–10 hours (plus border processing)",
    crossBorder: true,
    borderPost: "Lebombo / Ressano Garcia",
    blurb:
      "A fast route to Mozambique's main port via Lebombo — often used for both port-bound export cargo and direct Maputo deliveries.",
  },
];

export function getCorridor(slug: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.slug === slug);
}
