export function calculateTemperatureRateOfRise(t1DegC: number, t2DegC: number, deltaSeconds: number): number {
  if (deltaSeconds <= 0) throw new Error("Delta seconds must be positive");
  return (t2DegC - t1DegC) / deltaSeconds;
}

export function isThermalRunawayImminent(rateDegPerSec: number, criticalThreshold: number = 1.0): boolean {
  return rateDegPerSec >= criticalThreshold;
}
