/**
 * JavaScriptのnumberは不動点小数なので、
 * その中で整数を表すものを幽霊型を使って特定する。
 */
export type Integer = number & { __Integer: never };

/**
 * {@link Integer}型の型ガード
 */
export const isInteger = (a: number): a is Integer => Number.isInteger(a);

/**
 * {@link Integer}型の中さらに非負整数のみの型。
 */
export type NonNegativeInteger = number & { __NonNegativeInteger: never };
/**
 * {@link NonNegativeInteger}の型ガード
 */
export const isNonNegativeInteger = (a: number): a is NonNegativeInteger =>
  Number.isInteger(a) && a >= 0;

/**
 * 最大公約数を求める関数。
 * @param x
 * @param y
 * @returns とyの最大公約数。xとyがどんな値でも正の値を返す。
 */
export const gcd = (x: Integer, y: Integer): Integer => {
  const r = (x % y) as Integer;
  if (r !== 0) {
    return gcd(y, r);
  }
  return Math.abs(y) as Integer;
};
