import server from "server/index.js";

Bun.serve({
	idleTimeout: 255,
	fetch: server.fetch,
	port: process.env.PORT || 3000,
});
