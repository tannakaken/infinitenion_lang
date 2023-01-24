import {
  addInfinitenion,
  divInfinitenion,
  Infinitenion,
  infinitenionToString,
  mulInfinitenion,
  nthImaginary,
  powInfinitenion,
  subInfinitenion,
} from "../infinitenion/infinitenion";
import { isInteger, isNonNegativeInteger } from "../infinitenion/integer";
import { tokensParser } from "./parser";

type Stack = Infinitenion[];

export const makeStack = (): Stack => [];

export const pushStack = (x: Infinitenion, stack: Stack): Stack => {
  stack.push(x);
  return stack;
};

export const popStack = (stack: Stack): [Infinitenion | undefined, Stack] => {
  const x = stack.pop();
  return [x, stack];
};

export const evaluate = (line: string, stack: Stack): Stack => {
  const saved = [...stack];
  const parsed = tokensParser(line);
  if (parsed === null) {
    console.warn("parse error: " + line);
    return saved;
  }
  for (const result of parsed) {
    switch (result.type) {
      case "Integer":
        pushStack(result.value, stack);
        break;
      case "Float":
        pushStack(result.value, stack);
        break;
      case "Operator": {
        switch (result.value) {
          case "+": {
            const i1 = stack.pop();
            const i2 = stack.pop();
            if (i1 === undefined || i2 === undefined) {
              return saved;
            }
            stack.push(addInfinitenion(i2, i1));
            break;
          }
          case "-": {
            const i1 = stack.pop();
            const i2 = stack.pop();
            if (i1 === undefined || i2 === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            stack.push(subInfinitenion(i2, i1));
            break;
          }
          case "*": {
            const i1 = stack.pop();
            const i2 = stack.pop();
            if (i1 === undefined || i2 === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            stack.push(mulInfinitenion(i2, i1));
            break;
          }
          case "/": {
            const i1 = stack.pop();
            const i2 = stack.pop();
            if (i1 === undefined || i2 === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            const result = divInfinitenion(i2, i1);
            if (result === null) {
              console.warn("division by zero error!\n");
              return saved;
            }
            stack.push(result);
            break;
          }
          case "^": {
            const i1 = stack.pop();
            const i2 = stack.pop();
            if (i1 === undefined || i2 === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            if (typeof i1 === "number" && isInteger(i1)) {
              const result = powInfinitenion(i2, i1);
              if (result === null) {
                console.warn("division by zero error!\n");
                return saved;
              }
              stack.push(result);
            } else {
              console.warn(`non integer index: ${i1}\n`);
              return saved;
            }
            break;
          }
          case "i": {
            const n = stack.pop();
            if (n === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            if (typeof n === "number" && isNonNegativeInteger(n)) {
              stack.push(nthImaginary(n));
            } else {
              console.warn(`invalid imaginary index: ${n}\n`);
              return saved;
            }
            break;
          }
          case ".": {
            const n = stack.pop();
            if (n === undefined) {
              console.warn("stack underflow!\n");
              return saved;
            }
            console.log(infinitenionToString(n));
            break;
          }
        }
        break;
      }
    }
  }
  return stack;
};

export const stackToString = (stack: Stack): string => {
  return "[" + stack.map(infinitenionToString).join(",") + "]";
};
