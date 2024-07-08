import { Response, Router } from "express";

export const sseRouter = Router();

interface clients { }

const clients: Set<Response> = new Set();

function sendEventToAll(data: unknown): void {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}
sseRouter.get("/", (req, res: Response) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    clients.add(res);

    const keepAlive: NodeJS.Timeout = setInterval(() => {
        res.write(": keepalive\n\n");
    }, 1500);

    req.on("close", () => {
        clearInterval(keepAlive);
        clients.delete(res);
    });
});

export { sendEventToAll };
