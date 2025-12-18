import type { Customer } from "@/types/metric";
import { daysSince, cancelRate, noShowRate } from "./metrics";

export type Segment =
  | "VIP"
  | "Novo"
  | "Em risco"
  | "Risco no-show"
  | "Cancelador frequente"
  | "Regular";

export type SegmentThresholds = {
  vipVisits: number; // ex: 10
  newMaxVisits: number; // ex: 2
  atRiskDays: number; // ex: 60
  noShowRateHigh: number; // ex: 0.2
  cancelRateHigh: number; // ex: 0.3
  noShowsMin: number; // ex: 2
  cancelledMin: number; // ex: 2
};

export const defaultThresholds: SegmentThresholds = {
  vipVisits: 10,
  newMaxVisits: 2,
  atRiskDays: 60,
  noShowRateHigh: 0.2,
  cancelRateHigh: 0.3,
  noShowsMin: 2,
  cancelledMin: 2,
};

export function segmentOf(
  c: Customer,
  t: SegmentThresholds = defaultThresholds,
  now = new Date()
): Segment {
  const ds = daysSince(c.last_visit_date, now);

  if (c.visits >= t.vipVisits) return "VIP";
  if (c.visits <= t.newMaxVisits) return "Novo";
  if (ds >= t.atRiskDays) return "Em risco";

  const nsr = noShowRate(c);
  const cr = cancelRate(c);

  if (c.reservations.no_shows >= t.noShowsMin || nsr >= t.noShowRateHigh)
    return "Risco no-show";
  if (c.reservations.cancelled >= t.cancelledMin || cr >= t.cancelRateHigh)
    return "Cancelador frequente";

  return "Regular";
}
