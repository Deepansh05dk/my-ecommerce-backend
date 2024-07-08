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
exports.adminRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../../utils/db");
const sseRouter_1 = require("../sseRouter");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.post("/product", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield db_1.db.product.create({
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
        (0, sseRouter_1.sendEventToAll)({ type: "products_added", product });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
}));
exports.adminRouter.put("/product/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield db_1.db.product.update({
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
        (0, sseRouter_1.sendEventToAll)({ type: "products_update", product });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
}));
exports.adminRouter.delete("/product/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield db_1.db.product.delete({
            where: { id: Number(id) },
        });
        (0, sseRouter_1.sendEventToAll)({ type: "products_deleted", product });
        res.json({
            message: "Successfully Deleted",
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.adminRouter.get("/orders", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield db_1.db.order.findMany({
            select: {
                id: true,
                total: true,
                status: true,
            },
        });
        res.json(orders);
    }
    catch (err) {
        next(err);
    }
}));
