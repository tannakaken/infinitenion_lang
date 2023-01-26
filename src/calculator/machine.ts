import {
  addInfinitenion,
  divInfinitenion,
  equalInfinitenion,
  Infinitenion,
  infinitenionToString,
  mulInfinitenion,
  nthImaginary,
  powInfinitenion,
  subInfinitenion,
} from "../infinitenion/infinitenion";
import { isInteger, isNonNegativeInteger } from "../infinitenion/integer";
import {
  CODE_CALL,
  CODE_CLEAR,
  CODE_CR,
  CODE_DIV,
  CODE_DO,
  CODE_DROP,
  CODE_DUP,
  CODE_ELSE,
  CODE_END,
  CODE_EQUAL,
  CODE_GEQ,
  CODE_GREAT,
  CODE_IF,
  CODE_IMAGINARY,
  CODE_INDEX,
  CODE_LEQ,
  CODE_LESS,
  CODE_LOOP,
  CODE_MINUS,
  CODE_MOD,
  CODE_MROT,
  CODE_MULT,
  CODE_OVER,
  CODE_PLACEFOLDER,
  CODE_PLUS,
  CODE_POW,
  CODE_PRINT,
  CODE_PUSH,
  CODE_RETURN,
  CODE_ROT,
  CODE_SWAP,
  CODE_THEN,
  inBranch,
  instructionsParser,
  environment,
  resolveCurrentInstructions,
  CODE_BIND,
} from "./parser";

type Stack = (Infinitenion | string)[];

export const makeStack = (): Stack => [];

export const pushStack = (x: Infinitenion | string, stack: Stack): Stack => {
  stack.push(x);
  return stack;
};

export const popStack = (stack: Stack): [Infinitenion | string | undefined, Stack] => {
  const x = stack.pop();
  return [x, stack];
};

let formerInstructions: number[] = [];

export const evaluate = (line: string, stack: Stack): Stack => {
  const loopCountStack: number[] = [];
  const loopEndStack: number[] = [];
  const saved = [...stack];
  const instructions = instructionsParser(line, formerInstructions);
  const callStack: {name: string | null, programCounter: number}[] = [];
  let currentName: string | null = null;
  if (instructions === null) {
    console.warn("parse error: " + line);
    formerInstructions = [];
    return saved;
  }
  if (inBranch()) {
    return saved;
  } else {
    formerInstructions = [];
  }
  let programCounter = 0;
  while (programCounter >= 0) {
    const currentInstructions = resolveCurrentInstructions(currentName, instructions);
    if (currentInstructions === null) {
      return saved;
    }
    const instruction = currentInstructions[programCounter];
    switch (instruction) {
      case CODE_IF: {
        const condition = stack.pop();
        if (condition === 0) {
          const jump = currentInstructions[programCounter + 1];
          if (typeof jump === "number") {
            programCounter = jump;
          } else {
            console.warn("invalid jump:" + jump);
            return saved;
          }
        } else {
          programCounter += 2;
        }
        break;
      }
      case CODE_ELSE: {
        const jump = currentInstructions[programCounter + 1];
        if (typeof jump == "number") {
            programCounter = jump;
        } else {
            console.warn("invalid jump:" + jump);
            return saved;
        }
        break;
      }
      case CODE_THEN: {
        programCounter++;
        break;
      }
      case CODE_DO: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 !== "number") {
          console.warn("not integer loop start");
          return saved;
        }
        if (typeof i2 !== "number") {
          console.warn("not integer loop start");
          return saved;
        }
        loopCountStack.push(i1);
        loopEndStack.push(i2);
        programCounter++;
        break;
      }
      case CODE_LOOP: {
        loopCountStack[loopCountStack.length - 1]++;
        if (
          loopCountStack[loopCountStack.length - 1] >=
          loopEndStack[loopEndStack.length - 1]
        ) {
          loopCountStack.pop();
          loopEndStack.pop();
          programCounter += 2;
        } else {
            const jump = currentInstructions[programCounter + 1];
            if (typeof jump === "number") {
                programCounter = jump;
            } else {
                console.warn("invalid jump:" + jump);
                return saved;
            }
        }
        break;
      }
      case CODE_INDEX: {
        const index = loopCountStack[loopCountStack.length - 1];
        if (index === undefined) {
          console.warn("not inside of loop\n");
          return saved;
        }
        stack.push(index);
        programCounter++;
        break;
      }
      case CODE_PUSH: {
        const value = currentInstructions[programCounter + 1];
        pushStack(value, stack);
        programCounter += 2;
        break;
      }
      case CODE_PLUS: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          console.warn(currentName);
          console.warn(programCounter);
          return saved;
        }
        if (typeof i1 === "string" && typeof i2 === "string") {
            stack.push(i2 + i1);
        } else if (typeof i1 === "string" || typeof i2 === "string") {
            console.warn("can not add string and infinitenion");
            return saved;
        } else {
            stack.push(addInfinitenion(i2, i1));
        }
        programCounter++;
        break;
      }
      case CODE_MINUS: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 === "string" || typeof i2 === "string") {
            console.warn("only infinitenion can substract");
            return saved;
        }
        stack.push(subInfinitenion(i2, i1));
        programCounter++;
        break;
      }
      case CODE_MULT: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 === "string" || typeof i2 === "string") {
            console.warn("only infinitenion can multiply");
            return saved;
        }
        stack.push(mulInfinitenion(i2, i1));
        programCounter++;
        break;
      }
      case CODE_DIV: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 === "string" || typeof i2 === "string") {
            console.warn("only infinitenion can divide");
            return saved;
        }
        const result = divInfinitenion(i2, i1);
        if (result === null) {
          console.warn("division by zero error!\n");
          return saved;
        }
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_MOD: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 !== "number" || typeof i2 !== "number") {
          console.warn("not integer mod\n");
          return saved;
        }
        const result = i2 % i1;
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_POW: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }if (typeof i2 === "string") {
            console.warn("only infinitenion can exponent");
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
        programCounter++;
        break;
      }
      case CODE_EQUAL: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          return saved;
        }
        if (typeof i1 === "string" && typeof i2 === "string") {
            stack.push(i1 === i2 ? 1 : 0);
        } else if (typeof i1 === "string" || typeof i2 === "string") {
            console.warn("can not compare infinitenion and string");
            return saved;
        } else {
            stack.push(equalInfinitenion(i1, i2));
        }
        programCounter++;
        break;
      }
      case CODE_LEQ: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          return saved;
        }
        if (typeof i1 !== "number" || typeof i2 !== "number") {
          console.warn("not integer\n");
          return saved;
        }
        const result = i2 <= i1 ? 1 : 0;
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_LESS: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 !== "number" || typeof i2 !== "number") {
          console.warn("not integer\n");
          return saved;
        }
        const result = i2 < i1 ? 1 : 0;
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_GEQ: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 !== "number" || typeof i2 !== "number") {
          console.warn("not integer\n");
          return saved;
        }
        const result = i2 >= i1 ? 1 : 0;
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_GREAT: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof i1 !== "number" || typeof i2 !== "number") {
          console.warn("not integer\n");
          return saved;
        }
        const result = i2 > i1 ? 1 : 0;
        stack.push(result);
        programCounter++;
        break;
      }
      case CODE_DUP: {
        const i1 = stack[stack.length - 1];
        if (i1 === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          return saved;
        }
        stack.push(i1);
        programCounter++;
        break;
      }
      case CODE_DROP: {
        stack.pop();
        programCounter++;
        break;
      }
      case CODE_SWAP: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        if (i1 === undefined || i2 === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          return saved;
        }
        stack.push(i1);
        stack.push(i2);
        programCounter++;
        break;
      }
      case CODE_ROT: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        const i3 = stack.pop();
        if (i1 === undefined || i2 === undefined || i3 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        stack.push(i2);
        stack.push(i1);
        stack.push(i3);
        programCounter++;
        break;
      }
      case CODE_MROT: {
        const i1 = stack.pop();
        const i2 = stack.pop();
        const i3 = stack.pop();
        if (i1 === undefined || i2 === undefined || i3 === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        stack.push(i1);
        stack.push(i3);
        stack.push(i2);
        programCounter++;
        break;
      }
      case CODE_OVER: {
        const item = stack[stack.length - 2];
        if (item === undefined) {
          console.warn("stack underflow!\n");
          console.warn(stackToString(stack));
          console.warn(instruction);
          return saved;
        }
        stack.push(item);
        programCounter++;
        break;
      }
      case CODE_CLEAR: {
        stack.splice(0);
        programCounter++;
        break;
      }
      case CODE_CR: {
        process.stdin.write("\n");
        programCounter++;
        break;
      }
      case CODE_IMAGINARY: {
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
        programCounter++;
        break;
      }
      case CODE_PRINT: {
        const n = stack.pop();
        if (n === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        if (typeof n === "string") {
            process.stdin.write(n);
        } else {
            process.stdin.write(infinitenionToString(n));
        }
        programCounter++;
        break;
      }
      case CODE_BIND: {
        const n = stack.pop();
        if (n === undefined) {
          console.warn("stack underflow!\n");
          return saved;
        }
        const name = currentInstructions[programCounter + 1];
        if (typeof name !== "string") {
          console.warn("invalid state");
          return saved;
        }
        if (typeof n === "string") {
          environment[name] = {type: "String", value: n};
        } else {
          environment[name] = {type: "Infinitenion", value: n}
        }
        programCounter += 2;
        break;
      }
      case CODE_CALL: {
        const name = currentInstructions[programCounter + 1];
        if (typeof name !== "string") {
          console.warn("invalid state");
          return saved;
        }
        const value = environment[name];
        if (value === undefined) {
          console.warn("undefined variable:" + name);
          return saved;
        }
        if (value.type === "Executable") {
          callStack.push({name: currentName, programCounter});
          currentName = name;
          programCounter = 0;
        } else {
          stack.push(value.value);
          programCounter += 2;
        }
        break;
      }
      case CODE_RETURN: {
        const callData = callStack.pop();
        if (callData === undefined) {
          console.warn("invalid state");
          return saved;
        }
        currentName = callData.name;
        programCounter = callData.programCounter + 2;
        break;
      } 
      case CODE_END:
        return stack;
      case CODE_PLACEFOLDER:
      default: {
        console.warn(`invalid state: ${instructions}`);
        return saved;
      }
    }
  }
  return stack;
};

export const stackToString = (stack: Stack): string => {
  return "[" + stack.map((val) => typeof val == "string" ? JSON.stringify(val) : infinitenionToString(val)).join(",") + "]";
};
