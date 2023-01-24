import { Base } from "./base";
import { Infinitenion } from "./infinitenion";
import { gcd, Integer } from "./integer";

/**
 * 分数の約分に使うための符号を調節した共通因数
 * 
 * @param numerator
 * @param denominator 
 * @returns xとyの最小公約数。ただし、約分の際分母をいつも正にするため、
 * 
 * numerator > 0 かつ denominator > 0 => 正
 * 
 * numerator > 0 かつ denominator < 0 => 負
 * 
 * numerator < 0 かつ denominator > 0 => 正
 * 
 * numerator < 0 かつ denominator < 0 => 負
 * 
 * とする。
 */
const reducer = (numerator: Integer, denominator: Integer): Integer => {
    const g = gcd(numerator, denominator);
    if (denominator >= 0) {
        return g;
    }
    return -g as Integer;
}

/**
 * JavaScriptのnumberは浮動小数点数なので、-0が存在する。
 * これが悪さしないように、-0は全て0に変換する。
 */
const toPositiveZeroIfZero = (integer: Integer): Integer => {
    if (integer === 0) {
        return 0 as Integer;
    }
    return integer;
}

/**
 * 基底体としての有理数
 * 
 * 整数同士の計算はできるだけ有理数として計算する。
 */
export type Rational = {
    numerator: Integer,
    denominator: Integer,
};

/**
 * 可能な限り約分する。
 * 
 * 整数になる場合は整数にする。
 */
const reduceRational = (a: Rational): Base => {
    if (a.denominator === 1) {
        return a.numerator;
    }
    const r = reducer(a.numerator, a.denominator);
    if (r === 1) {
        return a;
    }
    const newNumerator = a.numerator / r as Integer;
    const newDenominator = a.denominator / r as Integer;
    if (newDenominator === 1) {
        return toPositiveZeroIfZero(newNumerator); // -0避け
    }
    return {
        numerator: toPositiveZeroIfZero(newNumerator), // -0避け
        denominator: newDenominator,
    }
}

/**
 * 有理数を作る関数。分母が0の時はnullを返す。
 */
export const makeRational = (numerator: Integer, denominator: Integer): Base | null => {
    if (denominator === 0) {
        return null;
    } 
    return reduceRational({
        numerator,
        denominator
    });
};

/**
 * 有理数の足し算
 */
export const addRational = (a: Rational, b: Rational): Base => {
    const g = gcd(a.denominator, b.denominator);
    return reduceRational({
        numerator: a.numerator * b.denominator / g + b.numerator * a.denominator / g as Integer,
        denominator: a.denominator * b.denominator / g as Integer
    });
}

/**
 * 有理数と整数との足し算
 */
export const addRationalInteger = (a: Rational, b: Integer): Base => {
    return reduceRational({
        numerator: a.numerator + (b * a.denominator) as Integer,
        denominator: a.denominator
    });
}


/**
 * 有理数の掛け算
 */
export const mulRational = (a: Rational, b: Rational): Base => {
    return reduceRational({
        numerator: a.numerator * b.numerator as Integer,
        denominator: a.denominator * b.denominator as Integer,
    });
}

/**
 * 有理数と整数の足し算
 */
export const mulRationalInteger = (a: Rational, b: Integer): Base => {
    return reduceRational({
        numerator: a.numerator * b as Integer,
        denominator: a.denominator
    });
}

/**
 * 有理数の逆数
 */
export const invRational = (a: Rational): Base | null => {
    if (a.numerator > 0) {
        if (a.numerator === 1) {
            return a.denominator;
        }
        return {
            numerator: a.denominator,
            denominator: a.numerator,
        };
    }
    if (-a.numerator === 1) {
        return -a.denominator;
    }
    return {
        numerator: -a.denominator as Integer,
        denominator: -a.numerator as Integer
    };
}

/**
 * 有理数の符号反転
 */
export const negateRational = (a: Rational): Base => {
    return {
        numerator: toPositiveZeroIfZero(-a.numerator as Integer),
        denominator: a.denominator
    };
}

/**
 * {@link Rational}の型ガード
 */
export const isRational = (x: Infinitenion): x is Rational => {
    return typeof x === "object" && "numerator" in x && "denominator" in x;
}