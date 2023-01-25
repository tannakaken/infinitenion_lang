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
  type: "Null";
  value: null;
};
/**
 * 整数取得の成功
 */
type IntegerResult = {
  type: "Integer";
  value: Integer;
};
/**
 * 浮動小数点数取得の成功
 */
type FloatResult = {
  type: "Float";
  value: number;
};
/**
 * 文字列取得の成功
 */
type StringResult = {
    type: "String",
    value: string;
}

const OPERATORS = [
  "if",
  "else",
  "then",
  "do",
  "loop",
  "dup",
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "=",
  "<=",
  "<",
  ">=",
  ">",
  "cr",
  "e",
  "i",
  ".",
  ":",
  ";"
] as const;
type Operator = (typeof OPERATORS)[number];
/**
 * オペレーター取得の成功
 */
type OperatorResult = {
  type: "Operator";
  value: Operator;
};

const OPERATOR_RESULTS = OPERATORS.reduce((acc, value) => {
  acc[value] = { type: "Operator", value };
  return acc;
}, {} as { [key in Operator]: OperatorResult });
/**
 * 成功
 */
export type SuccessResult = IntegerResult | FloatResult | StringResult | OperatorResult;
export type Result = NullResult | SuccessResult;
/**
 * 文字列をパースして結果と残りの文字列を返す関数
 */
type Parser = (line: string) => [Result, string];
const NULL_RESULT = { type: "Null", value: null } as const;

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
    value: parseInt(resultString, 10) as Integer,
  } as const;
  return [result, rest];
};

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
};

export const stringParser: Parser = (line) => {
    if (!line.startsWith("\"")) {
        return [NULL_RESULT, line];
    }
    const matchResult = line.substring(1).match(/[^\\]"/);
    if (matchResult === null || matchResult.index === undefined) {
        return [NULL_RESULT, line];
    }
    const result = JSON.parse(line.substring(0, matchResult.index + 3)) as string;
    const rest = line.substring(matchResult.index + 3);
    return [{type: "String", value: result}, rest];
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
  };
};

/**
 * 浮動小数点数、整数、文字列の順に取得しようとする{@link Parser}
 */
export const valueParser = makeOrParser([floatParser, integerParser, stringParser]);

const makeOperatorParser = (operator: Operator): Parser => {
  return (line) => {
    if (line.startsWith(operator)) {
      return [OPERATOR_RESULTS[operator], line.substring(operator.length)];
    }
    return [NULL_RESULT, line];
  };
};
const OPERATOR_PARSERS = OPERATORS.map((operator) =>
  makeOperatorParser(operator)
);
/**
 * 演算子を{@link OPERATORS}の順番で取得しようとする{@link Parser}
 */
export const operatorsParser = makeOrParser(OPERATOR_PARSERS);

/**
 * まず数を取得しようとし、その後演算子を取得しようとするパーサー
 */
export const tokenParser = makeOrParser([valueParser, operatorsParser]);

type ArrayResylt = SuccessResult[] | null;

/**
 * 文字列を{@link Parser}でパースしていき、全て分解できたら{@link SuccessResult}のリストを返し、
 * 失敗したらnullを返す
 */
export const makeArrayParser = (
  parser: Parser
): ((line: string) => ArrayResylt) => {
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
};

/**
 * 文字列をトークンに分解し切る関数。
 */
export const tokenizer = makeArrayParser(tokenParser);

export const CODE_END = 0;
export const CODE_PUSH = -1;
export const CODE_PLUS = -2;
export const CODE_MINUS = -3;
export const CODE_MULT = -4;
export const CODE_DIV = -5;
export const CODE_MOD = -6;
export const CODE_POW = -7;
export const CODE_EQUAL = -8;
export const CODE_LESS = -9;
export const CODE_LEQ = -10;
export const CODE_GREAT = -11;
export const CODE_GEQ = -12;
export const CODE_IMAGINARY = -13;
export const CODE_IF = -14;
export const CODE_ELSE = -15;
export const CODE_THEN = -16;
export const CODE_DO = -17;
export const CODE_LOOP = -18;
export const CODE_PRINT = -19;
export const CODE_INDEX = -20;
export const CODE_DUP = -21;
export const CODE_CR = -22;
export const CODE_PLACEFOLDER = -23;

const branchStack: number[] = [];

export const inBranch = () => {
  return branchStack.length > 0;
};

export const instructionsParser = (
  line: string,
  instructions: (number | string)[]
): (number | string)[] | null => {
  const tokens = tokenizer(line);
  if (tokens === null) {
    return null;
  }
  let programCounter = instructions.length;
  for (const token of tokens) {
    switch (token.type) {
      case "Integer":
      case "Float":
      case "String":
        instructions.push(CODE_PUSH, token.value);
        programCounter += 2;
        break;
      case "Operator":
        switch (token.value) {
          case "if":
            instructions.push(CODE_IF);
            instructions.push(CODE_PLACEFOLDER);
            branchStack.push(programCounter + 1);
            programCounter += 2;
            break;
          case "else": {
            instructions.push(CODE_ELSE);
            const idx = branchStack.pop();
            if (idx === undefined) {
              return null;
            }
            instructions[idx] = programCounter + 2;
            instructions.push(CODE_PLACEFOLDER);
            branchStack.push(programCounter + 1);
            programCounter += 2;
            break;
          }
          case "then": {
            instructions.push(CODE_THEN);
            const idx = branchStack.pop();
            if (idx === undefined) {
              return null;
            }
            instructions[idx] = programCounter + 1;
            programCounter++;
            break;
          }
          case "do": {
            instructions.push(CODE_DO);
            branchStack.push(programCounter + 1);
            programCounter++;
            break;
          }
          case "loop": {
            instructions.push(CODE_LOOP);
            const idx = branchStack.pop();
            if (idx === undefined) {
              return null;
            }
            instructions.push(idx);
            programCounter += 2;
            break;
          }
          case "+": {
            instructions.push(CODE_PLUS);
            programCounter++;
            break;
          }
          case "-": {
            instructions.push(CODE_MINUS);
            programCounter++;
            break;
          }
          case "*": {
            instructions.push(CODE_MULT);
            programCounter++;
            break;
          }
          case "/": {
            instructions.push(CODE_DIV);
            programCounter++;
            break;
          }
          case "%": {
            instructions.push(CODE_MOD);
            programCounter++;
            break;
          }
          case "^": {
            instructions.push(CODE_POW);
            programCounter++;
            break;
          }
          case "=": {
            instructions.push(CODE_EQUAL);
            programCounter++;
            break;
          }
          case "<=": {
            instructions.push(CODE_LEQ);
            programCounter++;
            break;
          }
          case "<": {
            instructions.push(CODE_LESS);
            programCounter++;
            break;
          }
          case ">=": {
            instructions.push(CODE_GEQ);
            programCounter++;
            break;
          }
          case ">": {
            instructions.push(CODE_GREAT);
            programCounter++;
            break;
          }
          case ".": {
            instructions.push(CODE_PRINT);
            programCounter++;
            break;
          }
          case "cr": {
            instructions.push(CODE_CR);
            programCounter++;
            break;
          }
          case "i": {
            instructions.push(CODE_INDEX);
            programCounter++;
            break;
          }
          case "dup": {
            instructions.push(CODE_DUP);
            programCounter++;
            break;
          }
          case "e": {
            instructions.push(CODE_IMAGINARY);
            programCounter++;
            break;
          }
        }
    }
  }
  return instructions;
};
