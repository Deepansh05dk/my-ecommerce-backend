import { Router } from "express";
import { db } from "../../../utils/db";
import { sendEventToAll } from "../sseRouter";
export const adminRouter = Router();

adminRouter.post("/product", async (req, res, next) => {
  try {
    const product = await db.product.create({
      data: req.body,
      select: {
        id: true,
        imageUrl: true,
        name: true,
        price: true,
        stock: true,
      },
    });
    // Notify all clients about the new product
    sendEventToAll({ type: "products_added", product },);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

adminRouter.put("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db.product.update({
      where: { id: parseInt(id) },
      data: req.body,
      select: {
        id: true,
        imageUrl: true,
        name: true,
        price: true,
        stock: true,
      },
    });
    // Notify all clients about the updated product
    sendEventToAll({ type: "products_update", product });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db.product.delete({
      where: { id: Number(id) },
    });
    sendEventToAll({ type: "products_deleted", product });
    res.json({
      message: "Successfully Deleted",
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/orders", async (req, res, next) => {
  try {
    const orders = await db.order.findMany({
      select: {
        id: true,
        total: true,
        status: true,
      },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});
