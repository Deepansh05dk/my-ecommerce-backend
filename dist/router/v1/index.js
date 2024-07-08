"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
const sseRouter_1 = require("./sseRouter");
const productRouter_1 = require("./productRouter");
const orderRouter_1 = require("./orderRouter");
const adminRouter_1 = require("./adminRouter");
const checkoutRouter_1 = require("./checkoutRouter");
const paymentRouter_1 = require("./paymentRouter");
const v1Router = (0, express_1.Router)();
exports.v1Router = v1Router;
//routes
v1Router.use("/products", productRouter_1.productRouter);
v1Router.use("/admin", adminRouter_1.adminRouter);
v1Router.use("/sse", sseRouter_1.sseRouter);
v1Router.use("/checkout", checkoutRouter_1.checkoutRouter);
v1Router.use("/orders", orderRouter_1.orderRouter);
v1Router.use("/payment", paymentRouter_1.paymentRouter);
