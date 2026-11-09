export function countAcousticEventsAboveThreshold(samples: number[], thresholdDb: number): number {
  return samples.filter(s => s >= thresholdDb).length;
}

export function isAcousticDelaminationDetected(burstCount: number, timeWindowS: number, rateLimitPerSec: number = 5): boolean {
  return (burstCount / timeWindowS) >= rateLimitPerSec;
}
