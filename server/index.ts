import { Hono } from "hono";
import { logger } from "hono/logger";
import sseRouter from "./routes/ticket/sse.router.js";
import ticketsRouter from "./routes/ticket/ticket.router.js";

const app = new Hono();

app.use(logger());

app.notFound((c) => {
	return c.text("Custom 404 Message", 404);
});

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Custom Error Message", 500);
});

app.get("/", (c) => {
	return c.text("KatlehoMotloung.com");
});

app.route("/tickets", ticketsRouter);

app.route("/sse", sseRouter);

export default app;
