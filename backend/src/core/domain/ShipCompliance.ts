export class ShipCompliance {
  constructor(
    public readonly shipId: string,
    public readonly year: number,
    public readonly complianceBalance: number
  ) {}

  public isSurplus(): boolean {
    return this.complianceBalance > 0;
  }

  public isDeficit(): boolean {
    return this.complianceBalance < 0;
  }
}
