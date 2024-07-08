"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutRouter = void 0;
const express_1 = require("express");
const stripe_1 = require("../../../utils/stripe");
const db_1 = require("../../../utils/db");
exports.checkoutRouter = (0, express_1.Router)();
exports.checkoutRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds, total } = req.body;
        if (!productIds || productIds.length === 0) {
            throw new Error("Product ids are required");
        }
        const products = yield db_1.db.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        const line_items = [];
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
        const order = yield db_1.db.order.create({
            data: {
                status: "PENDING",
                items: {
                    connect: productIds.map((id) => ({ id })),
                },
                total,
            },
        });
        const session = yield stripe_1.stripe.checkout.sessions.create({
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
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
