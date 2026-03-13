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
});
