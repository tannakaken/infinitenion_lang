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
    type: "String";
    value: string;
};

type WordResult = {
  type: "Word";
  value: string;
};

type NewWordResult = {
  type: "NewWord";
  value: string;
};

const OPERATORS = [
  "if",
  "else",
  "then",
  "do",
  "loop",
  "dup",
  "drop",
  "swap",
  "rot",
  "-rot",
  "over",
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
  ";",
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
export type SuccessResult = IntegerResult | FloatResult | StringResult | WordResult | NewWordResult | OperatorResult;
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

export let words: {[key: string]: Instruction[]} = {};

export const wordParser: Parser = (line) => {
  const word = line.split(/\s+/, 1)[0];
  if (word in words) {
    return [{type: "Word", value: word}, line.substring(word.length)];
  }
  return [NULL_RESULT, line];
}

export const newWordParser: Parser = (line) => {
  if (!line.startsWith(":")) {
    return [NULL_RESULT, line];
  }
  const trimmed = line.substring(1).trim();
  const word = trimmed.split(/\s+/, 1)[0];
  if (word === undefined) {
    return [NULL_RESULT, line];
  }
  if (numberParser(word)[1] === "") { // 数字として読めるのはいけない。
    return [NULL_RESULT, line];
  }
  if ((OPERATORS as readonly string[]).includes(word)) { // 組み込み演算子の上書きはいけない。
    return [NULL_RESULT, line];
  }
  if (!(word in words)) {
    words[word] = [];
  }
  return [{type: "NewWord", value: word}, trimmed.substring(word.length)];
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
 * 浮動小数点数、整数の順に取得しようとする{@link Parser}
 */
export const numberParser = makeOrParser([floatParser, integerParser]);

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
 * まずワード、次に数、その後文字列、そして演算子、最後に新しいワードを取得しようとするパーサー
 */
export const tokenParser = makeOrParser([wordParser, numberParser, stringParser, operatorsParser, newWordParser]);

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
      console.warn("error before:" + rest);
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
export const CODE_SWAP = -22;
export const CODE_DROP = -23;
export const CODE_ROT = -24;
export const CODE_MROT = -25;
export const CODE_OVER = -26;
export const CODE_CR = -27;
export const CODE_CALL = -28;
export const CODE_RETURN = -29;
export const CODE_PLACEFOLDER = -30;

const branchStack: number[] = [];

export const inBranch = () => {
  return branchStack.length > 0;
};

export type Instruction = string | number;

export const instructionsParser = (
  line: string,
  instructions: (number | string)[]
): Instruction[] | null => {
  const savedWords = {...words};
  const tokens = tokenizer(line);
  if (tokens === null) {
    console.warn("tokenize failed");
    return null;
  }
  let programCounter = instructions.length;
  let currentWord: string | null = null;
  for (const token of tokens) {
    const currentInstructions = currentWord !== null ? words[currentWord] : instructions;
    switch (token.type) {
      case "Integer":
      case "Float":
      case "String":
        currentInstructions.push(CODE_PUSH, token.value);
        programCounter += 2;
        break;
      case "NewWord": {
        if (inBranch()) {
          console.warn("you can define function only at top");
          words = savedWords;
          return null;
        }
        branchStack.push(programCounter);
        programCounter = 0;
        const word = token.value;
        currentWord = word;
        break;
      }
      case "Word": {
        const word = token.value;
        currentInstructions.push(CODE_CALL);
        currentInstructions.push(word);
        programCounter += 2;
        break;
      }
      case "Operator":
        switch (token.value) {
          case "if":
            currentInstructions.push(CODE_IF);
            currentInstructions.push(CODE_PLACEFOLDER);
            branchStack.push(programCounter + 1);
            programCounter += 2;
            break;
          case "else": {
            const idx = branchStack.pop();
            if (idx === undefined) {
              console.warn("not inside if block");
              words = savedWords;
              return null;
            }
            currentInstructions.push(CODE_ELSE);
            currentInstructions[idx] = programCounter + 2;
            currentInstructions.push(CODE_PLACEFOLDER);
            branchStack.push(programCounter + 1);
            programCounter += 2;
            break;
          }
          case "then": {
            const idx = branchStack.pop();
            if (idx === undefined) {
              console.warn("not inside if block");
              words = savedWords;
              return null;
            }
            currentInstructions.push(CODE_THEN);
            currentInstructions[idx] = programCounter + 1;
            programCounter++;
            break;
          }
          case "do": {
            currentInstructions.push(CODE_DO);
            branchStack.push(programCounter + 1);
            programCounter++;
            break;
          }
          case "loop": {            
            const idx = branchStack.pop();
            if (idx === undefined) {
              console.warn("not inside do loop");
              words = savedWords;
              return null;
            }
            currentInstructions.push(CODE_LOOP);
            currentInstructions.push(idx);
            programCounter += 2;
            break;
          }
          case "+": {
            currentInstructions.push(CODE_PLUS);
            programCounter++;
            break;
          }
          case "-": {
            currentInstructions.push(CODE_MINUS);
            programCounter++;
            break;
          }
          case "*": {
            currentInstructions.push(CODE_MULT);
            programCounter++;
            break;
          }
          case "/": {
            currentInstructions.push(CODE_DIV);
            programCounter++;
            break;
          }
          case "%": {
            currentInstructions.push(CODE_MOD);
            programCounter++;
            break;
          }
          case "^": {
            currentInstructions.push(CODE_POW);
            programCounter++;
            break;
          }
          case "=": {
            currentInstructions.push(CODE_EQUAL);
            programCounter++;
            break;
          }
          case "<=": {
            currentInstructions.push(CODE_LEQ);
            programCounter++;
            break;
          }
          case "<": {
            currentInstructions.push(CODE_LESS);
            programCounter++;
            break;
          }
          case ">=": {
            currentInstructions.push(CODE_GEQ);
            programCounter++;
            break;
          }
          case ">": {
            currentInstructions.push(CODE_GREAT);
            programCounter++;
            break;
          }
          case ".": {
            currentInstructions.push(CODE_PRINT);
            programCounter++;
            break;
          }
          case "cr": {
            currentInstructions.push(CODE_CR);
            programCounter++;
            break;
          }
          case "i": {
            currentInstructions.push(CODE_INDEX);
            programCounter++;
            break;
          }
          case "dup": {
            currentInstructions.push(CODE_DUP);
            programCounter++;
            break;
          }
          case "swap": {
            currentInstructions.push(CODE_SWAP);
            programCounter++;
            break;
          }
          case "drop": {
            currentInstructions.push(CODE_DROP);
            programCounter++;
            break;
          }
          case "rot": {
            currentInstructions.push(CODE_ROT);
            programCounter++;
            break;
          }
          case "-rot": {
            currentInstructions.push(CODE_MROT);
            programCounter++;
            break;
          }
          case "over": {
            currentInstructions.push(CODE_OVER);
            programCounter++;
            break;
          }
          case "e": {
            currentInstructions.push(CODE_IMAGINARY);
            programCounter++;
            break;
          }
          case ";": {
            const idx = branchStack.pop();
            if (idx === undefined) {
              console.warn("not inside function block");
              words = savedWords;
              return null;
            }
            if (inBranch()) {
              console.warn("unclosed if block or do loop");
              words = savedWords;
              return null;
            }
            currentInstructions.push(CODE_RETURN);
            programCounter = idx; 
            currentWord = null;
            break;
          }          
        }
    }
  }
  instructions.push(CODE_END);
  return instructions;
};
