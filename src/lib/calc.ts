export type Duration = 10 | 15 | 20 | 25;
export type PropertyType = "p" | "a";
export type Situation = "l" | "p";

export const RATES: Record<Duration, number> = {
  10: 3.3,
  15: 3.45,
  20: 3.6,
  25: 3.75,
};

export const DEBT_RATIO = 0.35;

export interface SimulateInput {
  netMonthly: number;
  charges?: number;
  duration: Duration;
  apport?: number;
  propertyType?: PropertyType;
  kids?: number;
  situation?: Situation;
}

export interface SimulateOutput {
  rate: number;
  maxMonthly: number;
  capacity: number;
  ptz: number;
  notaryFees: number;
  totalPrice: number;
  apport: number;
}

export function ptzBonus(situation: Situation, propertyType: PropertyType, kids: number): number {
  if (situation !== "l" || propertyType !== "p") return 0;
  const table = [0, 12000, 15000, 18000];
  return table[Math.min(Math.max(kids, 0), 3)];
}

export function simulate(input: SimulateInput): SimulateOutput {
  const charges = input.charges ?? 0;
  const apport = input.apport ?? 0;
  const propertyType: PropertyType = input.propertyType ?? "p";
  const kids = input.kids ?? 0;
  const situation: Situation = input.situation ?? "l";

  const rate = RATES[input.duration] ?? RATES[20];
  const r = rate / 100 / 12;
  const n = input.duration * 12;
  const maxMonthly = Math.max(0, input.netMonthly * DEBT_RATIO - charges);
  const capacity = r > 0
    ? Math.floor((maxMonthly * (1 - Math.pow(1 + r, -n))) / r)
    : Math.floor(maxMonthly * n);

  const ptz = ptzBonus(situation, propertyType, kids);
  const subtotal = capacity + apport + ptz;
  const notaryRate = propertyType === "p" ? 0.03 : 0.08;
  const notaryFees = Math.round(subtotal * notaryRate);

  return {
    rate,
    maxMonthly: Math.round(maxMonthly),
    capacity,
    ptz,
    notaryFees,
    totalPrice: subtotal,
    apport,
  };
}
