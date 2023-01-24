import * as readline from "readline";
import { evaluate, makeStack } from "./src/calculator/machine";

const repl = () => {
    let stack = makeStack();
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });
    r.on("line", (line) => {
        stack = evaluate(line, stack);
        console.log(stack);
        r.prompt();
    });
    r.prompt();
}

repl();
