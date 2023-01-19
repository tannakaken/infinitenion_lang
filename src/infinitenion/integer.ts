export type Integer = number & { __Integer: never }

/**
 * numberが整数の場合は型変換し、そうで場合はnullを返す。
 */
export const convertInteger = (n: number): Integer | null => {
    if (Number.isInteger(n)) {
        return n as Integer;
    }
    return null;
}

/**
 * 最大公約数を求める関数。
 * @param x 
 * @param y 
 * @returns xとyの最大公約数。xとyがどんな値でも正の値を返す。
 */
export const gcd = (x: Integer, y: Integer): Integer => {
    const r = x % y as Integer;
    if (r !== 0){
      return gcd(y, r);
    }
    return Math.abs(y) as Integer;
}