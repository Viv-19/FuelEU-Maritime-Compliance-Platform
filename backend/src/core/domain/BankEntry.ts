export class BankEntry {
  constructor(
    public readonly shipId: string,
    public readonly year: number,
    public readonly amount: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount <= 0) {
      throw new Error('amount must be positive');
    }
  }
}
