import { Router } from "express";
import { stripe } from "../../../utils/stripe";
import { db } from "../../../utils/db";
export const paymentRouter = Router();

paymentRouter.post("/success", async (req, res, next) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'unpaid') return res.json({ message: 'Invalid request' })
    const metadata = session.metadata;

    if (metadata) {
      const order = await db.order.update({
        where: {
          id: Number(metadata.orderId),
        },
        data: {
          status: "PAID",
        },
      });
      JSON.parse(metadata.productIds).map(async (id: number) => {
        await db.product.update({
          where: {
            id,
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        });
      });
    }
  } catch (error) {
    next(error);
  }
});

paymentRouter.post("/cancelled", async (req, res, next) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') return res.json({ message: 'Invalid request' })
    const metadata = session.metadata;
    if (metadata) {
      const order = await db.order.update({
        where: {
          id: Number(metadata.orderId),
        },
        data: {
          status: "CANCELLED",
        },
      });
    }
  } catch (error) {
    next(error);
  }
});
