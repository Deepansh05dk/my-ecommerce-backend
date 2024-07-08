import { Router } from "express";

import { sseRouter } from "./sseRouter";
import { productRouter } from "./productRouter";
import { orderRouter } from "./orderRouter";
import { adminRouter } from "./adminRouter";
import { checkoutRouter } from "./checkoutRouter";
import { paymentRouter } from "./paymentRouter";

const v1Router = Router();

//routes
v1Router.use("/products", productRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/sse", sseRouter);
v1Router.use("/checkout", checkoutRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/payment", paymentRouter);

export { v1Router };
