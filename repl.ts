import * as fs from "fs";
import * as readline from "readline";
import { evaluate, makeStack, stackToString } from "./src/calculator/machine";
import { inBranch } from "./src/calculator/parser";

const repl = () => {
    let stack = makeStack();
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });
    r.on("line", (line) => {
        stack = evaluate(line, stack);
        if (inBranch()) {
            r.setPrompt("..");
        } else {
            console.log(stackToString(stack));
            r.setPrompt("> ");
        }
        r.prompt();
    });
    r.prompt();
}

const evaluateFile = (fileName: string) => {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.warn("can not open file: " + fileName);
        } else {
            const code = data.toString();
            const stack = evaluate(code, makeStack());
            console.log(stackToString(stack));
        }
    })
}

const fileName = process.argv[2];

if (fileName === undefined) {
    repl();
} else {
    evaluateFile(fileName);
}
