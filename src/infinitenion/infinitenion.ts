import { isRational, Rational } from "./rational";
import { addBase, Base, baseToString, inverseBase, mulBase, negateBase } from "./base";
import { Integer, NonNegativeInteger } from "./integer";

/**
 * ケーリーディクソン構成された超複素数
 */
export type CayleyDickson = {
    real: Infinitenion;
    image: Infinitenion;
    height: number;
};

/**
 * Infinitenionは基底体に含まれる数かケーリーディクソン構成された超複素数
 */
export type Infinitenion = CayleyDickson | Base;

/**
 * {@link Infinitenion}の高さ
 */
export const heightInfinitenion = (a: Infinitenion): number => {
    if (typeof a === "number") {
        return 0;
    }
    if (isRational(a)) {
        return 0;
    }
    return a.height;
}

/**
 * 基底体の値かどうかを判定する{@link Base}の型ガード
 */
export const isBase  = (x : Infinitenion): x is Base => {
    return heightInfinitenion(x) === 0;
}

/**
 * {@link Infinitenion}の実部
 */
export const realOfInfinitenion = (a: Infinitenion): Infinitenion => {
    return isBase(a) ? a : a.real;
}
/**
 * {@link Infinitenion}の虚部
 */
export const imageOfInfinitenion = (a: Infinitenion): Infinitenion => {
    return isBase(a) ? 0 : a.image;
}

/**
 * nに含まれる最大の2の冪乗と、その冪
 */
const calcGreatestPowerOfTwo = (n: number, current = 1, height = 1): [number, number] => {
    const next = current * 2;
    if (next > n) {
        return [current, height];
    }
    return calcGreatestPowerOfTwo(n, next, height + 1);
}

/**
 * nth番目の虚数単位
 */
export const nthImaginary = (nth: NonNegativeInteger): Infinitenion => {
    if (nth === 0) {
        return 1;
    }
    const [greatestPowerOfTwo, height] = calcGreatestPowerOfTwo(nth);
    return {
        real: 0,
        image: nthImaginary(nth - greatestPowerOfTwo as NonNegativeInteger),
        height,
    }
}

/**
 * {@link Infinitenion}の足し算
 */
export const addInfinitenion = (a: Infinitenion, b: Infinitenion): Infinitenion => {
    const heightA = heightInfinitenion(a);
    const heightB = heightInfinitenion(b);
    if (heightA === 0 && heightB === 0) {
        return addBase(a as Base, b as Base);
    }
    if (heightA === heightB) {
        const a2 = a as CayleyDickson;
        const b2 = b as CayleyDickson;
        return simplifyCayleyDickson({real: addInfinitenion(a2.real, b2.real), image: addInfinitenion(a2.image, b2.image), height: heightA});
    }
    if (heightA > heightB) {
        const a2 = a as CayleyDickson;
        return simplifyCayleyDickson({real: addInfinitenion(a2.real, b), image: a2.image, height: heightA});
    }
    const b2 = b as CayleyDickson;
    return simplifyCayleyDickson({real: addInfinitenion(a, b2.real), image: b2.image, height: heightB});
}

/**
 * {@link Infinitenion}の引き算
 */
export const subInfinitenion = (a: Infinitenion, b: Infinitenion): Infinitenion => {
    return addInfinitenion(a, negInfinitenion(b));
}

/**
 * {@link Infinitenion}の和の逆元
 */
export const negInfinitenion = (a: Infinitenion): Infinitenion => {
    if (isBase(a)) {
        return negateBase(a);
    }
    return {real: negInfinitenion(a.real), image: negInfinitenion(a.image), height: a.height};
}

/**
 * {@link}の共役
 */
export const conjInfinitenion = (a: Infinitenion): Infinitenion => {
    if (isBase(a)) {
        return a;
    }
    return {real: conjInfinitenion(a.real), image: negInfinitenion(a.image), height: a.height};
}

/**
 * {@link}の掛け算
 * 
 * https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
 * を参考にした。
 */
export const mulInfinitenion = (a: Infinitenion, b: Infinitenion): Infinitenion => {
    const heightA = heightInfinitenion(a);
    const heightB = heightInfinitenion(b);
    if (heightA === 0 && heightB === 0) {
        return mulBase(a as Base, b as Base);
    }
    if (heightA === heightB) {
        // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
        // に従った
        const a2 = a as CayleyDickson;
        const b2 = b as CayleyDickson;
        const c = mulInfinitenion(a2.real, b2.real);
        const d = mulInfinitenion(conjInfinitenion(b2.image), a2.image);
        const e = mulInfinitenion(b2.image, a2.real);
        const f = mulInfinitenion(a2.image, conjInfinitenion(b2.real));
        return simplifyCayleyDickson({real: subInfinitenion(c,d), image: addInfinitenion(e, f), height: heightA});
    }
    if (heightA > heightB) {
        // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
        // における共役作用素に注意順序に注意
        const a2 = a as CayleyDickson;
        return simplifyCayleyDickson({real: mulInfinitenion(a2.real, b), image: mulInfinitenion(a2.image, conjInfinitenion(b)), height: heightA});
    }
    const b2 = b as CayleyDickson;
    // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
    // の掛け算の順序に注意
    return simplifyCayleyDickson({real: mulInfinitenion(a, b2.real), image: mulInfinitenion(b2.image, a), height: heightB});
}

/**
 * {@link Infinitenion}のノルムの２条
 */
export const squareNormInfinitenion = (a: Infinitenion): Base => {
    if (isBase(a)) {
        return mulBase(a, a);
    }
    return addBase(squareNormInfinitenion(a.real), squareNormInfinitenion(a.image));
}

/**
 * {@link Infinitenion}の積の逆元
 * 
 * ただし、{@link Infinitenion}の積は結合則を満たさないので、群の議論は使えず、
 * 高さが4以上では零因子も存在しているので、通常の群の逆元とはかなり性質が異なる。
 */
export const invInfinitenion = (a: Infinitenion): Infinitenion | null => {
    if (isBase(a)) {
        return inverseBase(a);
    }
    const squareNorm = squareNormInfinitenion(a);
    const inverseSquareNorm = inverseBase(squareNorm) as Rational; // squareNormは0にならない。
    return mulInfinitenion(inverseSquareNorm, conjInfinitenion(a));
}

/**
 * {@link Infinitenion}の割り算
 * 
 * 0で割り算をしたときはnull
 * 
 * ただし{@link Infinitenion}では、
 * 高さが4以上で零因子が存在しているので、通常の割り算とはかなり性質が異なる。
 */
export const divInfinitenion = (a: Infinitenion, b: Infinitenion): Infinitenion | null => {
    const inverseB = invInfinitenion(b);
    if (inverseB === null) {
        return null;
    }
    return mulInfinitenion(a, inverseB);
}

/**
 * {@link Infinitenion}の冪乗
 * 
 * 冪指数が整数の時のみ定義される。
 * 
 * 底が0で冪指数が負のときはnull
 */
export const powInfinitenion = (base: Infinitenion, pow: Integer): Infinitenion | null => {
    if (base === 0 && pow > 0) {
        return 0;
    }
    if (pow === 0) {
        return 1;
    }
    const newBase = pow > 0 ? base : invInfinitenion(base);
    if (newBase === null) {
        return null;
    }
    const positiveExp = Math.abs(pow) as NonNegativeInteger;
    return powInfinitenionAux(newBase, positiveExp, 1);
}

/**
 * 冪乗を求める補助関数
 */
const powInfinitenionAux = (base: Infinitenion, exp: NonNegativeInteger, acc: Infinitenion): Infinitenion => {
    if (exp === 0) {
        return acc;
    }
    const newExp = exp >> 1 as NonNegativeInteger;
    const newAcc = exp % 2 === 0 ? acc : mulInfinitenion(base, acc);
    return powInfinitenionAux(mulInfinitenion(base, base), newExp, newAcc)
}

/**
 * ケーリーディクソン構成の無駄な枝を刈る
 */
const simplifyCayleyDickson = (a: CayleyDickson): Infinitenion => {
    if (a.image === 0) {
        return a.real;
    }
    return a;
}

export const infinitenionToString = (a: Infinitenion, nth = 0): string => {
    if (isBase(a)) {
        if (nth === 0) {
            return baseToString(a);
        }
        if (a === 1) {
            return `${nth} i`;
        }
        return `${baseToString(a)} ${nth} i *`;
    }
    const offset = Math.pow(2, a.height - 1);
    if (a.real === 0) {
        return infinitenionToString(a.image, nth + offset);
    }
    return `${infinitenionToString(a.real, nth)} ${infinitenionToString(a.image, nth + offset)} +`
    
}