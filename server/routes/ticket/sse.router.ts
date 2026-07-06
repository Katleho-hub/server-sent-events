import { Hono } from "hono";
import { cors } from "hono/cors";
import { type SSEStreamingApi, streamSSE } from "hono/streaming";
import { modifyTicket } from "../../../src/firebase/firestore/ticket.service.js";

const sseRouter = new Hono();

type Client =
	| {
			ticketId: string;
			stream: SSEStreamingApi;
	  }
	| SSEStreamingApi;

const clients = new Set<Client>();

sseRouter.use(
	"/*",
	cors({
		origin: "*",
	}),
);

sseRouter.get("/", async (c) => {
	return streamSSE(c, async (stream) => {
		clients.add(stream);

		stream.onAbort(() => {
			clients.delete(stream);
		});

		while (!stream.aborted) {
			await stream.writeSSE({ event: "ping", data: "heartbeat" });
			await stream.sleep(15000);
		}
	});
});

sseRouter.get("/:id", async (c) => {
	return streamSSE(c, async (stream) => {
		const id = c.req.param("id");
		const client: Client = { stream, ticketId: id };

		clients.add(client);

		stream.onAbort(() => {
			clients.delete(client);
		});

		while (!stream.aborted) {
			await stream.writeSSE({ event: "ping", data: "heartbeatzzz" });
			await stream.sleep(15000);
		}
	});
});

sseRouter.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const payload = await c.req.parseBody();

	clients.forEach(async (client) => {
		try {
			await modifyTicket(id, payload);

			if ("ticketId" in client) {
				if (client.ticketId !== id) return;

				await client.stream.writeSSE({
					event: "TICKET_UPDATE",
					data: JSON.stringify(payload, null, 12),
				});
			} else {
				await client.writeSSE({
					event: "TICKET_UPDATE",
					data: JSON.stringify(payload, null, 12),
				});
			}
		} catch (_error) {
			clients.delete(client);
		}
	});

	return c.json({ success: true, activeScreens: clients.size });
});

export default sseRouter;
