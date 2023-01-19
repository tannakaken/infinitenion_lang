import * as fs from "fs";
import * as readline from "readline";

const repl = () => {
    const r = readline.createInterface({
        input: process.stdin,
        terminal: false,
    });
    r.on("line", (line) => {
        console.log(line);
    });
}

repl();
