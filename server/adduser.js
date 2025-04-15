import { PrismaClient } from "./generated/prisma/index.js";
import readline from "node:readline";
import {customAlphabet} from "nanoid";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is the user\'s name? >> ', (name) => {
    rl.question('What is the user\'s browser? >> ', (browser) => {
        prisma.user.create({
            data: {
                source: browser,
                name: name,
                runtimeId: nanoid(8),
            }
        }).then((user) => {
            rl.write(`User ${name} on ${browser} created with runtimeId: ${user.runtimeId}\n`);
            rl.close();
        })
    });
});
