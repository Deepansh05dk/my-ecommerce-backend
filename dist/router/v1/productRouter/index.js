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
exports.productRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../../utils/db");
exports.productRouter = (0, express_1.Router)();
//routes
exports.productRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.db.product.findMany();
        res.json(products);
    }
    catch (err) {
        next(err);
    }
}));
exports.productRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = JSON.parse(req.body);
        console.log(data);
        const products = yield db_1.db.product.findMany({
            where: {
                id: {
                    in: data
                }
            }
        });
        res.json(products);
    }
    catch (err) {
        res.json([]);
    }
}));
