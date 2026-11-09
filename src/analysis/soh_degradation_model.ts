export function estimateSohPercent(nominalCapacityAh: number, measuredCapacityAh: number): number {
  if (nominalCapacityAh <= 0) return 0;
  const ratio = (measuredCapacityAh / nominalCapacityAh) * 100;
  return Math.max(0, Math.min(100, Number(ratio.toFixed(1))));
}
