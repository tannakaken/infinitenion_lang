import { Integer } from "../infinitenion/integer";

/**
 * 整数をテストする正規表現
 */
const integerRegex = /^[+-]?[0-9]+/;
/**
 * 浮動小数点数を判定する正規表現
 */
const floatRegex = /^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/;

/**
 * 失敗
 */
type NullResult = {
    type: "Null",
    value: null,
};
/**
 * 整数取得の成功
 */
type IntegerResult = {
    type: "Integer",
    value: Integer,
};
/**
 * 浮動小数点数取得の成功
 */
type FloatResult = {
    type: "Float",
    value: number,
};

const OPERATORS = ["+", "-", "*", "/" , "^", "i", "."] as const;
type Operator = typeof OPERATORS[number];
/**
 * オペレーター取得の成功
 */
type OperatorResult = {
    type: "Operator",
    value: Operator,
};

const OPERATOR_RESULTS = OPERATORS.reduce((acc, value) => {
    acc[value] = {type: "Operator", value};
    return acc;
}, {} as {[key in Operator]: OperatorResult})
/**
 * 成功
 */
export type SuccessResult = IntegerResult | FloatResult | OperatorResult;
export type Result = NullResult | SuccessResult;
/**
 * 文字列をパースして結果と残りの文字列を返す関数
 */
type Parser = (line: string) => [Result, string];
const NULL_RESULT = {type: "Null", value: null} as const;

/**
 * 文字列の冒頭から自然数を取得しようとする{@link Parser}
 */
export const integerParser: Parser = (line) => {
    const matchResult = line.match(integerRegex);
    if (matchResult === null) {
        return [NULL_RESULT, line];
    }
    const resultString = matchResult[0];
    const rest = line.substring(resultString.length);
    const result = {
        type: "Integer",
        value: parseInt(resultString, 10) as Integer
    } as const;
    return [result, rest];
}

/**
 * 文字列の冒頭から不動小数点数を取得しようとする{@link Parser}
 */
export const floatParser: Parser = (line) => {
    const matchResult = line.match(floatRegex);
    if (matchResult === null) {
        return [NULL_RESULT, line];
    }
    const resultString = matchResult[0];
    const rest = line.substring(resultString.length);
    const result = {
        type: "Float",
        value: parseFloat(resultString),
    } as const;
    return [result, rest];
}

/**
 * 与えられた{@link Parser}を一つずつ試していき、うまくいったものがあればその結果を返し、
 * 全てうまくいかなかったら失敗にする{@link Parser}を作る。
 */
export const makeOrParser = (parsers: Parser[]): Parser => {
    return (line) => {
        for (const parser of parsers) {
            const [result, rest] = parser(line);
            if (result.type !== "Null") {
                return [result, rest];
            }
        }
        return [NULL_RESULT, line];
    }
}

/**
 * まず浮動小数点数を取得しようとし、それが失敗したら整数を取得しようとする{@link Parser}
 */
export const numberParser = makeOrParser([floatParser, integerParser]);

const makeOperatorParser = (operator: Operator): Parser => {
    return (line) => {
        if (line.startsWith(operator)) {
            return [OPERATOR_RESULTS[operator], line.substring(operator.length)];
        }
        return [NULL_RESULT, line];
    };
}
const OPERATOR_PARSERS = OPERATORS.map((operator) => makeOperatorParser(operator));
/**
 * 演算子を{@link OPERATORS}の順番で取得しようとする{@link Parser}
 */
export const operatorsParser = makeOrParser(OPERATOR_PARSERS);

/**
 * まず数を取得しようとし、その後演算子を取得しようとするパーサー
 */
export const tokenParser = makeOrParser([numberParser, operatorsParser]);


type ArrayResylt = SuccessResult[] | null;

/**
 * 文字列を{@link Parser}でパースしていき、全て分解できたら{@link SuccessResult}のリストを返し、
 * 失敗したらnullを返す
 */
export const makeArrayParser = (parser: Parser): (line: string) => ArrayResylt => {
    const arrayParser = (line: string): ArrayResylt => {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
            return [];
        }
        const [result, rest] = parser(line.trim());
        if (result.type === "Null") {
            return null;
        }
        const arrayResult = arrayParser(rest);
        if (arrayResult === null) {
            return null;
        }
        arrayResult.unshift(result);
        return arrayResult;
    };
    return arrayParser;
}

/**
 * 文字列をトークンに分解し切る関数。
 */
export const tokensParser = makeArrayParser(tokenParser);