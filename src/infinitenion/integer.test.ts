import { gcd, Integer, isInteger, isNonNegativeInteger } from "./integer";



test('an integer is an integer', () => {
    expect(isInteger(-1)).toBe(true);
    expect(isInteger(0)).toBe(true);
    expect(isInteger(3)).toBe(true);
});

test('a float is not an integer', () => {
    expect(isInteger(1.4)).toBe(false);
    expect(isInteger(0.1)).toBe(false);
    expect(isInteger(-0.3)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
});

test('a non negative integer is a non negative integer', () => {
    expect(isNonNegativeInteger(-1)).toBe(false);
    expect(isNonNegativeInteger(0)).toBe(true);
    expect(isNonNegativeInteger(3)).toBe(true);
    expect(isNonNegativeInteger(1.5)).toBe(false);
    expect(isNonNegativeInteger(NaN)).toBe(false);
    expect(isNonNegativeInteger(Infinity)).toBe(false);
    expect(isNonNegativeInteger(-Infinity)).toBe(false);
});

test('gcd', () => {
    expect(gcd(54 as Integer, 111 as Integer)).toBe(3);
    expect(gcd(-54 as Integer, 111 as Integer)).toBe(3);
    expect(gcd(54 as Integer, -111 as Integer)).toBe(3);
    expect(gcd(53 as Integer, 111 as Integer)).toBe(1);
    expect(gcd(-53 as Integer, 111 as Integer)).toBe(1);
    expect(gcd(53 as Integer, -111 as Integer)).toBe(1);
});