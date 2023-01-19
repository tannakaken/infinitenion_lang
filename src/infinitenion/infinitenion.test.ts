import { addCayleyDickson, mulCayleyDickson, nthImaginary, subCayleyDickson } from "./infinitenion"
import { negateRational, oneRational, Rational, zeroRational } from "./rational";

test("test number", () => {
    const e0 = nthImaginary<number>(0, 0, 1);
    expect(e0).toBe(1);

    const e1 = nthImaginary<number>(1, 0, 1);

    expect(mulCayleyDickson(e1, e1)).toBe(-1);
    const e2 = nthImaginary<number>(2, 0, 1);

    expect(mulCayleyDickson(e2, e2)).toBe(-1);
    const e3 = nthImaginary<number>(3, 0, 1);
    expect(mulCayleyDickson(e3, e3)).toBe(-1);
    expect(mulCayleyDickson(e1, mulCayleyDickson(e2, e3))).toBe(-1);
    expect(addCayleyDickson(mulCayleyDickson(e2, e3), mulCayleyDickson(e3, e2))).toBe(0);

    const e6 = nthImaginary<number>(6, 0, 1);
    const e10 = nthImaginary<number>(10, 0, 1);
    const e15 = nthImaginary<number>(15, 0, 1);
    expect(mulCayleyDickson(addCayleyDickson(e3, e10), subCayleyDickson(e6, e15))).toBe(0);
});

test("test rational", () => {
    const e0 = nthImaginary(0, zeroRational, oneRational);
    expect(e0).toEqual(oneRational);

    const e1 = nthImaginary(1, zeroRational, oneRational);

    expect(mulCayleyDickson(e1, e1)).toEqual(negateRational(oneRational));
    const e2 = nthImaginary(2, zeroRational, oneRational);

    expect(mulCayleyDickson(e2, e2)).toEqual(negateRational(oneRational));
    const e3 = nthImaginary(3, zeroRational, oneRational);
    expect(mulCayleyDickson(e3, e3)).toEqual(negateRational(oneRational));
    expect(mulCayleyDickson(e1, mulCayleyDickson(e2, e3))).toEqual(negateRational(oneRational));
    expect(addCayleyDickson(mulCayleyDickson(e2, e3), mulCayleyDickson(e3, e2))).toEqual(zeroRational);

    const e6 = nthImaginary(6, zeroRational, oneRational);
    const e10 = nthImaginary(10, zeroRational, oneRational);
    const e15 = nthImaginary(15, zeroRational, oneRational);
    expect(mulCayleyDickson(addCayleyDickson(e3, e10), subCayleyDickson(e6, e15))).toEqual(zeroRational);
});