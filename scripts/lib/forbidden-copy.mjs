// Copy that must never reappear on the enterprise site: public prices, old
// service packages and time-boxed ROI claims. Shared by the rendered-content
// verifier and the catalogue unit tests.
export const forbiddenCopy = [
  ["public price", /[£€$]\s*\d/iu],
  [
    "pricing or availability offer",
    /\b(?:pricing|VAT|availability|slots booked)\b/iu,
  ],
  ["free offer", /\bfree\b/iu],
  ["fractional leadership", /\bfractional\b/iu],
  ["full-time cost comparison", /full[- ]time cost|30% (?:the )?cost/iu],
  [
    "old service package",
    /getting started (?:with AI )?workshop|full AI roadmap package|3.month trial/iu,
  ],
  [
    "fixed ROI deadline",
    /within (?:the first )?(?:\d+ )?(?:weeks|days)|weeks,? not months|weeks,? not years|ROI.{0,45}(?:\d+ days|\d+ months)/iu,
  ],
];

/** Returns the names of every forbidden pattern found in `content`. */
export function findForbiddenCopy(content) {
  return forbiddenCopy
    .filter(([, pattern]) => pattern.test(content))
    .map(([name]) => name);
}
