import { Rational } from "./rational";
import { addBase, Base, isZeroBase, mulBase, negateBase } from "./base";
import { number } from "yargs";

/**
 * ケーリーディクソン構成された超複素数
 */
export type CayleyDickson<B extends Base> = {
    real: Infinitenion<B>;
    image: Infinitenion<B>;
    height: number;
};

export type Infinitenion<B extends Base> = CayleyDickson<B> | B;

export const isZero = <B extends Base>(a: Infinitenion<B>) => {
    if (heightCayleyDickson(a) === 0) {
        return isZeroBase(a as B);
    }
    return false;
}

export const realCayleyDickson = <B extends Base>(a: Infinitenion<B>): Infinitenion<B> => {
    return heightCayleyDickson(a) === 0 ? (a as B) : (a as CayleyDickson<B>).real;
}
export const imageCayleyDickson = <B extends Base>(a: Infinitenion<B>, zero: B): Infinitenion<B> => {
    return heightCayleyDickson(a) === 0 ? zero : (a as CayleyDickson<B>).image;
}

export const heightCayleyDickson = <B extends Base>(a: Infinitenion<B>): number => {
    if (typeof a === "number") {
        return 0;
    }
    const a2 = a as Rational | CayleyDickson<B>;
    if ('numerator' in a2) {
        return 0;
    }
    return a2.height;
}

export const makeInfinitenion = <B extends Base>(real: Infinitenion<B>, image: Infinitenion<B>): Infinitenion<B> => {
    const realHeight = heightCayleyDickson(real);
    const imageHeight = heightCayleyDickson(image);
    const height = Math.max(realHeight, imageHeight) + 1;
    return {
        real,
        image,
        height
    };
}

const calcGreatestPowerOfTwo = (n: number, current = 1, height = 1): [number, number] => {
    const next = current * 2;
    if (next > n) {
        return [current, height];
    }
    return calcGreatestPowerOfTwo(n, next, height + 1);
}

export const nthImaginary = <B extends Base>(nth: number, zero: B, one: B): Infinitenion<B> => {
    if (nth === 0) {
        return one;
    }
    const [greatestPowerOfTwo, height] = calcGreatestPowerOfTwo(nth);
    return {
        real: zero,
        image: nthImaginary(nth - greatestPowerOfTwo, zero, one),
        height,
    }
}

export const addCayleyDickson = <B extends Base>(a: Infinitenion<B>, b: Infinitenion<B>): Infinitenion<B> => {
    const heightA = heightCayleyDickson(a);
    const heightB = heightCayleyDickson(b);
    if (heightA === 0 && heightB === 0) {
        const a2 = a as B;
        const b2 = b as B;
        return addBase(a2, b2);
    }
    if (heightA === heightB) {
        const a2 = a as CayleyDickson<B>;
        const b2 = b as CayleyDickson<B>;
        return simplifyCayleyDickson({real: addCayleyDickson(a2.real, b2.real), image: addCayleyDickson(a2.image, b2.image), height: heightA});
    }
    if (heightA > heightB) {
        const a2 = a as CayleyDickson<B>;
        return simplifyCayleyDickson({real: addCayleyDickson(a2.real, b), image: a2.image, height: heightA});
    }
    const b2 = b as CayleyDickson<B>;
    return simplifyCayleyDickson({real: addCayleyDickson(a, b2.real), image: b2.image, height: heightB});
}

export const subCayleyDickson = <B extends Base>(a: Infinitenion<B>, b: Infinitenion<B>): Infinitenion<B> => {
    return addCayleyDickson(a, negateCayleyDickson(b));
}


export const negateCayleyDickson = <B extends Base>(a: Infinitenion<B>): Infinitenion<B> => {
    if (heightCayleyDickson(a) === 0) {
        return negateBase(a as B);
    }
    const a2 = a as CayleyDickson<B>;
    return {real: negateCayleyDickson(a2.real), image: negateCayleyDickson(a2.image), height: a2.height};
}


export const conjugateCayleyDickson = <B extends Base>(a: Infinitenion<B>): Infinitenion<B> => {
    if (heightCayleyDickson(a) === 0) {
        return a;
    }
    const a2 = a as CayleyDickson<B>;
    return {real: conjugateCayleyDickson(a2.real), image: negateCayleyDickson(a2.image), height: a2.height};
}

/**
 * https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
 * を参考にした。
 */
export const mulCayleyDickson = <B extends Base>(a: Infinitenion<B>, b: Infinitenion<B>): Infinitenion<B> => {
    const heightA = heightCayleyDickson(a);
    const heightB = heightCayleyDickson(b);
    if (heightA === 0 && heightB === 0) {
        return mulBase(a as B, b as B);
    }
    if (heightA === heightB) {
        // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
        // に従った
        const a2 = a as CayleyDickson<B>;
        const b2 = b as CayleyDickson<B>;
        const c = mulCayleyDickson(a2.real, b2.real);
        const d = mulCayleyDickson(conjugateCayleyDickson(b2.image), a2.image);
        const e = mulCayleyDickson(b2.image, a2.real);
        const f = mulCayleyDickson(a2.image, conjugateCayleyDickson(b2.real));
        return simplifyCayleyDickson({real: subCayleyDickson(c,d), image: addCayleyDickson(e, f), height: heightA});
    }
    if (heightA > heightB) {
        // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
        // における共役作用素に注意順序に注意
        const a2 = a as CayleyDickson<B>;
        return simplifyCayleyDickson({real: mulCayleyDickson(a2.real, b), image: mulCayleyDickson(a2.image, conjugateCayleyDickson(b)), height: heightA});
    }
    const b2 = b as CayleyDickson<B>;
    // https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%87%E3%82%A3%E3%82%AF%E3%82%BD%E3%83%B3%E3%81%AE%E6%A7%8B%E6%88%90%E6%B3%95
    // の掛け算の順序に注意
    return simplifyCayleyDickson({real: mulCayleyDickson(a, b2.real), image: mulCayleyDickson(b2.image, a), height: heightB});
}

const simplifyCayleyDickson = <B extends Base>(a: Infinitenion<B>): Infinitenion<B> => {
    if (heightCayleyDickson(a) === 0) {
        return a;
    }
    const a2 = a as CayleyDickson<B>;
    if (isZero(a2.image)) {
        return a2.real;
    }
    return a2;
}
