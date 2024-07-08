"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const v1_1 = require("./router/v1");
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
//middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
}));
//routes
app.use("/api/v1", v1_1.v1Router);
//error middleware
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
