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
exports.paymentRouter = void 0;
const express_1 = require("express");
const stripe_1 = require("../../../utils/stripe");
const db_1 = require("../../../utils/db");
exports.paymentRouter = (0, express_1.Router)();
exports.paymentRouter.post("/success", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.body;
        const session = yield stripe_1.stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'unpaid')
            return res.json({ message: 'Invalid request' });
        const metadata = session.metadata;
        if (metadata) {
            const order = yield db_1.db.order.update({
                where: {
                    id: Number(metadata.orderId),
                },
                data: {
                    status: "PAID",
                },
            });
            JSON.parse(metadata.productIds).map((id) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.db.product.update({
                    where: {
                        id,
                    },
                    data: {
                        stock: {
                            decrement: 1,
                        },
                    },
                });
            }));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.paymentRouter.post("/cancelled", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.body;
        const session = yield stripe_1.stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid')
            return res.json({ message: 'Invalid request' });
        const metadata = session.metadata;
        if (metadata) {
            const order = yield db_1.db.order.update({
                where: {
                    id: Number(metadata.orderId),
                },
                data: {
                    status: "CANCELLED",
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
