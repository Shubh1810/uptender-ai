/**
 * `profiles.onboarding_completed` has historically been written as a boolean,
 * a string, or a number. Normalise it in one place.
 */
export function isOnboardingComplete(value: unknown): boolean {
  return value === true || value === 'true' || value === 1;
}
