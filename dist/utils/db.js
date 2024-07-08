"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
let client = new client_1.PrismaClient();
client
    .$connect()
    .then(() => {
    console.log("Prisma Client connected successfully.");
})
    .catch((error) => {
    console.error("Error connecting Prisma Client:", error);
});
exports.db = client;
