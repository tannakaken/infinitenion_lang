import { gcd, Integer } from "./integer";

/**
 * 分数の約分に使うためのgcd
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

export type Rational = {
    numerator: Integer,
    denominator: Integer,
};

const reduceRational = (a: Rational): Rational => {
    const g = reducer(a.numerator, a.denominator);
    if (g === 1) {
        return a;
    }
    const numerator = a.numerator / g;
    
    return {
        numerator: toPositiveZeroIfZero(a.numerator / g as Integer), // -0避け
        denominator: a.denominator / g as Integer,
    }
}

/**
 * 有理数を作る関数。分母が0の時はnullを返す。
 */
export const makeRational = (numerator: Integer, denominator: Integer): Rational | null => {
    if (denominator === 0) {
        return null;
    } 
    return reduceRational({
        numerator,
        denominator
    });
};

/**
 * 有理数を足し算する関数。
 */
export const addRational = (a: Rational, b: Rational): Rational => {
    const g = gcd(a.denominator, b.denominator);
    return reduceRational({
        numerator: a.numerator * b.denominator / g + b.numerator * a.denominator / g as Integer,
        denominator: a.denominator * b.denominator / g as Integer
    });
}

/**
 * 有理数を掛け算する関数。
 */
export const mulRational = (a: Rational, b: Rational): Rational => {
    return reduceRational({
        numerator: a.numerator * b.numerator as Integer,
        denominator: a.denominator * b.denominator as Integer,
    });
}

/**
 * 有理数を逆数にする関数。
 */
export const inverseRational = (a: Rational): Rational | null => {
    if (a.numerator === 0) {
        return null;
    }
    if (a.numerator > 0) {
        return {
            numerator: a.denominator,
            denominator: a.numerator,
        };
    }
    return {
        numerator: -a.denominator as Integer,
        denominator: -a.numerator as Integer
    };
}

/**
 * 有理数の富豪を反転する関数。
 */
export const negateRational = (a: Rational): Rational => {
    return {
        numerator: toPositiveZeroIfZero(-a.numerator as Integer),
        denominator: a.denominator
    };
}

/**
 * 有理数の0
 */
export const zeroRational: Rational = {
    numerator: 0 as Integer,
    denominator: 1 as Integer,
} as const;

/**
 * 有理数の1
 */
export const oneRational: Rational = {
    numerator: 1 as Integer,
    denominator: 1 as Integer,
} as const;