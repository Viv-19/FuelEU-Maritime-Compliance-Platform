export interface ApplyBankedResult {
  applied: number;
  newCB: number;
  remainingBank: number;
}

/**
 * Uses stored banked compliance to offset a deficit.
 * 
 * @param deficitCB - The current deficit Compliance Balance (must be negative)
 * @param bankedAmount - The amount of compliance banked previously
 * @returns The applied amount, the new CB, and the remaining banked amount
 * @throws Error if deficitCB is positive or zero
 */
export function applyBanked(
  deficitCB: number,
  bankedAmount: number
): ApplyBankedResult {
  if (deficitCB >= 0) {
    throw new Error('Deficit CB must be negative to apply banked compliance');
  }

  const deficitMagnitude = Math.abs(deficitCB);
  const amountApplied = Math.min(bankedAmount, deficitMagnitude);
  
  const newCB = deficitCB + amountApplied;
  const remainingBank = bankedAmount - amountApplied;

  return {
    applied: amountApplied,
    newCB,
    remainingBank
  };
}
