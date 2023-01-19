import { convertInteger, gcd, Integer } from "./integer";

test('an integer is an integer', () => {
    expect(convertInteger(-1)).toBe(-1);
    expect(convertInteger(0)).toBe(0);
    expect(convertInteger(3)).toBe(3);
});

test('a float is not an integer', () => {
    expect(convertInteger(1.4)).toBe(null);
    expect(convertInteger(0.1)).toBe(null);
    expect(convertInteger(-0.3)).toBe(null);
    expect(convertInteger(NaN)).toBe(null);
    expect(convertInteger(Infinity)).toBe(null);
    expect(convertInteger(-Infinity)).toBe(null);
});

test('gcd', () => {
    expect(gcd(54 as Integer, 111 as Integer)).toBe(3);
    expect(gcd(-54 as Integer, 111 as Integer)).toBe(3);
    expect(gcd(54 as Integer, -111 as Integer)).toBe(3);
    expect(gcd(53 as Integer, 111 as Integer)).toBe(1);
    expect(gcd(-53 as Integer, 111 as Integer)).toBe(1);
    expect(gcd(53 as Integer, -111 as Integer)).toBe(1);
});