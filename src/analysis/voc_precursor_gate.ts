export function evaluateVocPrecursor(vocPpm: number, basePpm: number = 50, alertDeltaPpm: number = 100): boolean {
  return (vocPpm - basePpm) >= alertDeltaPpm;
}
