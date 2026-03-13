export class PoolMember {
  constructor(
    public readonly poolId: string,
    public readonly shipId: string,
    public readonly cbBefore: number,
    public readonly cbAfter: number
  ) {}
}
