import {
  addBase,
  baseToString,
  inverseBase,
  mulBase,
  negateBase,
} from "./base";
import { Integer } from "./integer";
import { makeRational, Rational } from "./rational";

test("add base", () => {
  expect(addBase(1, 2)).toBe(3);
  expect(
    addBase(1, makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toStrictEqual({
    numerator: 3,
    denominator: 2,
  });
  expect(
    addBase(makeRational(1 as Integer, 2 as Integer) as Rational, -2)
  ).toStrictEqual({
    numerator: -3,
    denominator: 2,
  });
  expect(
    addBase(
      makeRational(1 as Integer, 2 as Integer) as Rational,
      makeRational(1 as Integer, 3 as Integer) as Rational
    )
  ).toStrictEqual({
    numerator: 5,
    denominator: 6,
  });
  expect(
    addBase(1.5, makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toBe(2);
  expect(
    addBase(makeRational(1 as Integer, 2 as Integer) as Rational, 2.3)
  ).toBe(2.8);
});

test("mul base", () => {
  expect(mulBase(1, 2)).toBe(2);
  expect(
    mulBase(
      makeRational(3 as Integer, 2 as Integer) as Rational,
      makeRational(2 as Integer, 3 as Integer) as Rational
    )
  ).toBe(1);
  expect(mulBase(2, makeRational(1 as Integer, 2 as Integer) as Rational)).toBe(
    1
  );
  expect(
    mulBase(makeRational(1 as Integer, 2 as Integer) as Rational, -3)
  ).toStrictEqual({
    numerator: -3,
    denominator: 2,
  });
  expect(
    mulBase(1.5, makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toBe(0.75);
  expect(
    mulBase(makeRational(2 as Integer, 5 as Integer) as Rational, 2.5)
  ).toBe(1);
});

test("negate base", () => {
  expect(negateBase(1)).toBe(-1);
  expect(
    negateBase(makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toStrictEqual({
    numerator: -1,
    denominator: 2,
  });
});

test("inverse base", () => {
  expect(inverseBase(0)).toBeNull();
  expect(inverseBase(1)).toBe(1);
  expect(inverseBase(-2)).toStrictEqual({
    numerator: -1,
    denominator: 2,
  });
  expect(
    inverseBase(makeRational(-2 as Integer, 3 as Integer) as Rational)
  ).toStrictEqual({
    numerator: -3,
    denominator: 2,
  });
  expect(inverseBase(1.5)).toBe(2 / 3);
});

test("base to string", () => {
  expect(baseToString(0)).toBe("0");
  expect(baseToString(1.5)).toBe("1.5");
  expect(
    baseToString(makeRational(2 as Integer, 3 as Integer) as Rational)
  ).toBe("2 3 /");
});
