import {
  addInfinitenion,
  divInfinitenion,
  heightInfinitenion,
  imageOfInfinitenion,
  infinitenionToString,
  invInfinitenion,
  mulInfinitenion,
  negInfinitenion,
  nthImaginary,
  powInfinitenion,
  realOfInfinitenion,
  subInfinitenion,
} from "./infinitenion";
import { Integer, NonNegativeInteger } from "./integer";
import { makeRational, Rational } from "./rational";

test("height of infinitenion", () => {
  expect(heightInfinitenion(1)).toBe(0);
  expect(
    heightInfinitenion(makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toBe(0);
  expect(heightInfinitenion(nthImaginary(1 as NonNegativeInteger))).toBe(1);
  expect(heightInfinitenion(nthImaginary(2 as NonNegativeInteger))).toBe(2);
  expect(heightInfinitenion(nthImaginary(3 as NonNegativeInteger))).toBe(2);
  expect(heightInfinitenion(nthImaginary(4 as NonNegativeInteger))).toBe(3);
});

test("real of infinitenion", () => {
  expect(realOfInfinitenion(1)).toBe(1);
  expect(realOfInfinitenion(1.5)).toBe(1.5);
  expect(
    realOfInfinitenion(makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toStrictEqual({
    numerator: 1,
    denominator: 2,
  });
  expect(realOfInfinitenion(nthImaginary(1 as NonNegativeInteger))).toBe(0);
  expect(realOfInfinitenion(nthImaginary(2 as NonNegativeInteger))).toBe(0);
  expect(realOfInfinitenion(nthImaginary(3 as NonNegativeInteger))).toBe(0);
  expect(
    realOfInfinitenion(
      addInfinitenion(nthImaginary(1 as NonNegativeInteger), 1)
    )
  ).toBe(1);
  expect(
    realOfInfinitenion(
      addInfinitenion(
        nthImaginary(1 as NonNegativeInteger),
        nthImaginary(3 as NonNegativeInteger)
      )
    )
  ).toStrictEqual(nthImaginary(1 as NonNegativeInteger));
});

test("image of infinitenion", () => {
  expect(imageOfInfinitenion(1)).toBe(0);
  expect(imageOfInfinitenion(1.5)).toBe(0);
  expect(
    imageOfInfinitenion(makeRational(1 as Integer, 2 as Integer) as Rational)
  ).toBe(0);
  expect(imageOfInfinitenion(nthImaginary(1 as NonNegativeInteger))).toBe(1);
  expect(imageOfInfinitenion(nthImaginary(2 as NonNegativeInteger))).toBe(1);
  expect(
    imageOfInfinitenion(nthImaginary(3 as NonNegativeInteger))
  ).toStrictEqual(nthImaginary(1 as NonNegativeInteger));
  expect(
    imageOfInfinitenion(
      addInfinitenion(nthImaginary(1 as NonNegativeInteger), 1)
    )
  ).toBe(1);
  expect(
    imageOfInfinitenion(
      addInfinitenion(
        nthImaginary(1 as NonNegativeInteger),
        nthImaginary(3 as NonNegativeInteger)
      )
    )
  ).toStrictEqual(nthImaginary(1 as NonNegativeInteger));
});

test("inverse of infinitenion", () => {
  expect(invInfinitenion(1)).toBe(1);
  expect(invInfinitenion(2)).toStrictEqual({
    numerator: 1,
    denominator: 2,
  });
  expect(invInfinitenion(nthImaginary(1 as NonNegativeInteger))).toStrictEqual(
    negInfinitenion(nthImaginary(1 as NonNegativeInteger))
  );
  expect(invInfinitenion(0)).toBeNull();
});

test("div infinitenion", () => {
  expect(divInfinitenion(1, 0)).toBeNull();
  expect(
    divInfinitenion(
      nthImaginary(3 as NonNegativeInteger),
      nthImaginary(2 as NonNegativeInteger)
    )
  ).toStrictEqual(nthImaginary(1 as NonNegativeInteger));
});

test("power of infinitenion", () => {
  const e1 = nthImaginary(1 as NonNegativeInteger);
  expect(powInfinitenion(0, 1000000000 as Integer)).toBe(0);
  expect(powInfinitenion(e1, 0 as Integer)).toBe(1);
  expect(powInfinitenion(2, 10 as Integer)).toBe(1024);
  expect(powInfinitenion(0, -10 as Integer)).toBeNull();
  expect(powInfinitenion(0.5, -1 as Integer)).toBe(2);
  expect(powInfinitenion(e1, 4 as Integer)).toBe(1);
  expect(powInfinitenion(e1, 5 as Integer)).toStrictEqual(e1);
  expect(
    powInfinitenion(nthImaginary(11111111 as NonNegativeInteger), 12 as Integer)
  ).toBe(1);
});

test("test imaginary number", () => {
  // 単位元
  const e0 = nthImaginary(0 as NonNegativeInteger);
  expect(e0).toBe(1);

  // 最初の虚数、複素数
  const e1 = nthImaginary(1 as NonNegativeInteger);
  expect(mulInfinitenion(e1, e1)).toBe(-1);

  // 四元数
  const e2 = nthImaginary(2 as NonNegativeInteger);
  expect(mulInfinitenion(e2, e2)).toBe(-1);
  const e3 = nthImaginary(3 as NonNegativeInteger);
  expect(mulInfinitenion(e3, e3)).toBe(-1);
  // 四元数の三つの虚数の関係
  expect(mulInfinitenion(e1, mulInfinitenion(e2, e3))).toBe(-1);
  // 可換則のやぶれ
  expect(
    addInfinitenion(mulInfinitenion(e2, e3), mulInfinitenion(e3, e2))
  ).toBe(0);

  // 八元数
  const e6 = nthImaginary(6 as NonNegativeInteger);
  // 結合則の敗れ
  expect(
    addInfinitenion(
      mulInfinitenion(mulInfinitenion(e2, e3), e6),
      mulInfinitenion(e2, mulInfinitenion(e3, e6))
    )
  ).toBe(0);

  // 十六元数
  const e10 = nthImaginary(10 as NonNegativeInteger);
  const e15 = nthImaginary(15 as NonNegativeInteger);
  // ノルム則の敗れ
  expect(
    mulInfinitenion(addInfinitenion(e3, e10), subInfinitenion(e6, e15))
  ).toBe(0);
});

test("infinitenion to string", () => {
  expect(infinitenionToString(0)).toBe("0");
  expect(infinitenionToString(1.5)).toBe("1.5");
  expect(
    infinitenionToString(makeRational(2 as Integer, 3 as Integer) as Rational)
  ).toBe("2 3 /");
  expect(infinitenionToString(nthImaginary(1 as NonNegativeInteger))).toBe(
    "1 e"
  );
  expect(infinitenionToString(nthImaginary(2 as NonNegativeInteger))).toBe(
    "2 e"
  );
  expect(infinitenionToString(nthImaginary(3 as NonNegativeInteger))).toBe(
    "3 e"
  );
  expect(infinitenionToString(nthImaginary(10 as NonNegativeInteger))).toBe(
    "10 e"
  );
  expect(
    infinitenionToString(
      addInfinitenion(1, nthImaginary(10 as NonNegativeInteger))
    )
  ).toBe("1 10 e +");
  expect(
    infinitenionToString(
      addInfinitenion(
        1,
        mulInfinitenion(
          makeRational(1 as Integer, 2 as Integer) as Rational,
          nthImaginary(10 as NonNegativeInteger)
        )
      )
    )
  ).toBe("1 1 2 / 10 e * +");
});
