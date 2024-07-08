import { PrismaClient } from "@prisma/client";

let client = new PrismaClient();

client
  .$connect()
  .then(() => {
    console.log("Prisma Client connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting Prisma Client:", error);
  });

export const db = client;
