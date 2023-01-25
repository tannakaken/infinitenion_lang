import { Integer, isInteger } from "./integer";
import {
  addRational,
  addRationalInteger,
  equalRational,
  equalRationalNumber,
  invRational,
  isRational,
  mulRational,
  mulRationalInteger,
  negateRational,
  Rational,
  rationalToString,
} from "./rational";

/**
 * ケーリーディクソン構成の規定型
 */
export type Base = number | Rational;

export const toNumber = (x: Base): number => {
  if (isRational(x)) {
    return x.numerator / x.denominator;
  }
  return x;
};

/**
 * 基底型{@link Base}の足し算
 */
export const addBase = (a: Base, b: Base): Base => {
  if (isRational(a)) {
    if (isRational(b)) {
      return addRational(a, b);
    }
    if (isInteger(b)) {
      return addRationalInteger(a, b);
    }
    return toNumber(a) + b;
  }
  if (isInteger(a)) {
    if (isRational(b)) {
      return addRationalInteger(b, a);
    }
  }
  return toNumber(a) + toNumber(b);
};

/**
 * 基底型{@link Base}の掛け算
 */
export const mulBase = (a: Base, b: Base): Base => {
  if (isRational(a)) {
    if (isRational(b)) {
      return mulRational(a, b);
    }
    if (isInteger(b)) {
      return mulRationalInteger(a, b);
    }
    return toNumber(a) * b;
  }
  if (isInteger(a)) {
    if (isRational(b)) {
      return mulRationalInteger(b, a);
    }
  }
  return toNumber(a) * toNumber(b);
};

/**
 * 基底型{@link Base}の符号反転
 */
export const negateBase = (a: Base): Base => {
  if (typeof a === "number") {
    if (a === 0) {
      return a;
    }
    return -a;
  }
  return negateRational(a);
};

/**
 * 基底型{@link Base}の逆数
 *
 * 0徐算になる場合はnull
 */
export const inverseBase = (a: Base): Base | null => {
  if (typeof a === "number") {
    if (a === 0) {
      return null;
    }
    if (a === 1) {
      return 1;
    }
    if (isInteger(a)) {
      return {
        numerator: Math.sign(a) as Integer,
        denominator: Math.abs(a) as Integer,
      };
    }
    return 1 / a;
  }
  return invRational(a);
};

export const equalBase = (a: Base, b: Base): 0 | 1 => {
  if (typeof a === "number") {
    if (typeof b === "number") {
      return a === b ? 1 : 0;
    }
    return equalRationalNumber(b, a);
  } else {
    if (typeof b === "number") {
      return equalRationalNumber(a, b);
    }
    return equalRational(a, b);
  }
};

export const baseToString = (a: Base): string => {
  if (typeof a === "number") {
    return a.toString(10);
  }
  return rationalToString(a);
};
