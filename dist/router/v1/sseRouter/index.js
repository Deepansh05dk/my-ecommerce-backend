"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseRouter = void 0;
exports.sendEventToAll = sendEventToAll;
const express_1 = require("express");
exports.sseRouter = (0, express_1.Router)();
const clients = new Set();
function sendEventToAll(data) {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}
exports.sseRouter.get("/", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    clients.add(res);
    const keepAlive = setInterval(() => {
        res.write(": keepalive\n\n");
    }, 1500);
    req.on("close", () => {
        clearInterval(keepAlive);
        clients.delete(res);
    });
});
