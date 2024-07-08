import { Router } from "express";
import { stripe } from "../../../utils/stripe";
import { db } from "../../../utils/db";
import Stripe from "stripe";

export const checkoutRouter = Router();

checkoutRouter.post("/", async (req, res, next) => {
  try {
    const { productIds } = req.body;
    if (!productIds || productIds.length === 0) {
      throw new Error("Product ids are required");
    }
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    const total = products.reduce((total, item) => Number(item.price) + total, 0)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: Number(product.price) * 100,
        },
      });
    });
    const order = await db.order.create({
      data: {
        status: "PENDING",
        items: {
          connect: productIds.map((id: string) => ({ id })),
        },
        total,
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        orderId: order.id,
        productIds: JSON.stringify(productIds),
      },
    });
    res.json({
      url: session.url,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
