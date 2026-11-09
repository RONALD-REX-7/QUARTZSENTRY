export interface ImpedancePoint {
  frequencyHz: number;
  realOhms: number;
  imagOhms: number;
}

export function calculateImpedanceMagnitude(real: number, imag: number): number {
  return Math.sqrt(real * real + imag * imag);
}

export function calculatePhaseAngleDegrees(real: number, imag: number): number {
  return Math.atan2(imag, real) * (180 / Math.PI);
}
