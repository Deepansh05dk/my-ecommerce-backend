import { Router } from "express";
import { db } from "../../../utils/db";

export const productRouter = Router();

//routes

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await db.product.findMany();
    res.json(products);
  } catch (err) {
    next(err);
  }
});
