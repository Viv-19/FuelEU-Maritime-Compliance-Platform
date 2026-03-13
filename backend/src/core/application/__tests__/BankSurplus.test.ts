import { bankSurplus } from '../BankSurplus';

describe('BankSurplus', () => {
  it('should successfully add positive currentCB to bankedAmount', () => {
    const currentCB = 5000;
    const bankedAmount = 2000;
    
    const result = bankSurplus(currentCB, bankedAmount);
    
    expect(result).toBe(7000);
  });

  it('should throw an error if currentCB is negative', () => {
    const currentCB = -100;
    const bankedAmount = 2000;
    
    expect(() => {
      bankSurplus(currentCB, bankedAmount);
    }).toThrow('Only positive Compliance Balance (surplus) can be banked');
  });

  it('should throw an error if currentCB is exactly zero', () => {
    const currentCB = 0;
    const bankedAmount = 2000;
    
    expect(() => {
      bankSurplus(currentCB, bankedAmount);
    }).toThrow('Only positive Compliance Balance (surplus) can be banked');
  });

  it('should bank when bankedAmount starts at zero', () => {
    const result = bankSurplus(3000, 0);
    expect(result).toBe(3000);
  });

  it('should accumulate correctly across multiple bankings', () => {
    let banked = bankSurplus(1000, 0);
    banked = bankSurplus(2000, banked);
    banked = bankSurplus(500, banked);
    expect(banked).toBe(3500);
  });
});
