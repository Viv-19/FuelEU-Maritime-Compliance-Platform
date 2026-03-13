import { PoolMember } from '../PoolMember';

describe('PoolMember', () => {
  it('should instantiate correctly', () => {
    const member = new PoolMember('POOL_2024', 'SHIP_001', -150, 0);
    
    expect(member.poolId).toBe('POOL_2024');
    expect(member.shipId).toBe('SHIP_001');
    expect(member.cbBefore).toBe(-150);
    expect(member.cbAfter).toBe(0);
  });
});
