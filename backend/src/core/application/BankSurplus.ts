/**
 * Stores surplus Compliance Balance (CB) for future use.
 * 
 * @param currentCB - The current compliance balance of the ship
 * @param bankedAmount - The amount of CB that has already been banked
 * @returns The new total banked amount
 * @throws Error if currentCB is not positive
 */
export function bankSurplus(
  currentCB: number,
  bankedAmount: number
): number {
  if (currentCB <= 0) {
    throw new Error('Only positive Compliance Balance (surplus) can be banked');
  }

  return bankedAmount + currentCB;
}
