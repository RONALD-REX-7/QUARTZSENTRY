export type SeverityTier = "NORMAL" | "ADVISORY" | "CRITICAL" | "EMERGENCY";

export function evaluateSeverityScore(tempAlert: boolean, acousticAlert: boolean, vocAlert: boolean): SeverityTier {
  const score = (tempAlert ? 1 : 0) + (acousticAlert ? 1 : 0) + (vocAlert ? 1 : 0);
  switch (score) {
    case 3: return "EMERGENCY";
    case 2: return "CRITICAL";
    case 1: return "ADVISORY";
    default: return "NORMAL";
  }
}
