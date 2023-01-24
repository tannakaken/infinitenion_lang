import { Integer } from "./integer";
import { addRational,invRational,makeRational, mulRational, negateRational, Rational, rationalToString } from "./rational";

test("make rational number", () => {
    const r0 = makeRational(1 as Integer, 0 as Integer);
    expect(r0).toBeNull();
    const r1 = makeRational(2 as Integer, 3 as Integer);
    if (r1 === null) {
        fail();
        return;
    }
    expect((r1 as Rational).numerator).toBe(2);
    expect((r1 as Rational).denominator).toBe(3);
    const r2 = makeRational(6 as Integer, 10 as Integer);
    if (r2 === null) {
        fail();
        return;
    }
    expect((r2 as Rational).numerator).toBe(3);
    expect((r2 as Rational).denominator).toBe(5);

    const r3 = makeRational(-6 as Integer, 10 as Integer);
    if (r3 === null) {
        fail();
        return;
    }
    expect((r3 as Rational).numerator).toBe(-3);
    expect((r3 as Rational).denominator).toBe(5);

    const r4 = makeRational(6 as Integer, -10 as Integer);
    if (r4 === null) {
        fail();
        return;
    }
    expect((r4 as Rational).numerator).toBe(-3);
    expect((r4 as Rational).denominator).toBe(5);

    const r5 = makeRational(-6 as Integer, -10 as Integer);
    if (r5 === null) {
        fail();
        return;
    }
    expect((r5 as Rational).numerator).toBe(3);
    expect((r5 as Rational).denominator).toBe(5);

    const r6 = makeRational(0 as Integer, -10 as Integer);
    if (r6 === null) {
        fail();
        return;
    }
    expect(r6).toBe(0);

    const r7 = makeRational(2 as Integer, 1 as Integer);
    if (r7 === null) {
        fail();
        return;
    }
    expect(r7).toBe(2);
});

test("add rational", () => {
    const r0 = makeRational(1 as Integer, 2 as Integer) as Rational;
    const r1 = makeRational(1 as Integer, 3 as Integer) as Rational;
    const r3 = addRational(r0, r1);
    expect((r3 as Rational).numerator).toBe(5);
    expect((r3 as Rational).denominator).toBe(6);

    const r4 = makeRational(1 as Integer, 4 as Integer) as Rational;
    const r5 = makeRational(3 as Integer, 4 as Integer) as Rational;
    const r6 = addRational(r4, r5);
    expect(r6).toBe(1);
});

test("add rational", () => {
    const r0 = makeRational(1 as Integer, 2 as Integer) as Rational;
    const r1 = makeRational(1 as Integer, 3 as Integer) as Rational;
    const r3 = addRational(r0, r1);
    expect((r3 as Rational).numerator).toBe(5);
    expect((r3 as Rational).denominator).toBe(6);

    const r4 = makeRational(1 as Integer, 4 as Integer) as Rational;
    const r5 = makeRational(3 as Integer, 4 as Integer) as Rational;
    const r6 = addRational(r4, r5);
    expect(r6).toBe(1);
});

test("multiply rational", () => {
    const r0 = makeRational(-2 as Integer, 3 as Integer) as Rational;
    const r1 = makeRational(1 as Integer, 6 as Integer) as Rational;
    const r3 = mulRational(r0, r1);
    expect((r3 as Rational).numerator).toBe(-1);
    expect((r3 as Rational).denominator).toBe(9);
});

test("inverse rational", () => {

    const r2 = makeRational(2 as Integer, 3 as Integer) as Rational;
    const r3 = invRational(r2) as Rational;
    expect(r3.numerator).toBe(3);
    expect(r3.denominator).toBe(2);

    const r4 = makeRational(1 as Integer, 6 as Integer) as Rational;
    expect(invRational(r4)).toBe(6);

    const r5 = makeRational(-1 as Integer, 6 as Integer) as Rational;
    expect(invRational(r5)).toBe(-6);
});

test("negate rational", () => {
    const r0 = makeRational(2 as Integer, 3 as Integer) as Rational;
    const r1 = negateRational(r0);
    expect((r1 as Rational).numerator).toBe(-2);
    expect((r1 as Rational).denominator).toBe(3);
    const r2 = makeRational(-2 as Integer, 3 as Integer) as Rational;
    const r3 = negateRational(r2);
    expect((r3 as Rational).numerator).toBe(2);
    expect((r3 as Rational).denominator).toBe(3);
});

test("rational to string", () => {
    expect(rationalToString(makeRational(2 as Integer, 3 as Integer) as Rational)).toBe("2 3 /");
});
