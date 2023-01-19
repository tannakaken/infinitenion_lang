/**
 * このファイルは型を調べて演算を割り当てているだけなのでテストしない。
 */
import { addRational, mulRational, negateRational, Rational } from "./rational";

/**
 * ケーリーディクソン構成の規定型
 */
export type Base = number | Rational;

export const isZeroBase = (a: Base): boolean => {
    if (typeof a === "number") {
        return a === 0;
    }
    return a.numerator === 0;
}

export const addBase = <B extends Base>(a: B, b: B): B => {
    if (typeof a === "number" && typeof b === "number") {
        return a + b as B;
    }
    return addRational(a as Rational, b as Rational) as B;
}

export const mulBase = <B extends Base>(a: B, b: B): B => {
    if (typeof a === "number" && typeof b === "number") {
        return a * b as B;
    }
    return mulRational(a as Rational, b as Rational) as B;
}

export const negateBase = <B extends Base>(a : B): B => {
    if (typeof a === "number") {
        return -a as B;
    }
    return negateRational(a) as B;
}

