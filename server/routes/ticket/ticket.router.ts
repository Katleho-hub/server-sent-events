import { Hono } from "hono";
import {
	fetchAllTickets,
	fetchTicketById,
	removeTicket,
} from "../../../src/firebase/firestore/ticket.service";
import { handleError } from "../todo/helpers/handle-error.helper";

const ticketsRouter = new Hono();

ticketsRouter.onError((err, c) => {
	return handleError(c, err);
});

// ticketsRouter.post("/", async ({ req, json }) => {
// 	const { title } = await req.parseBody<{ title?: string }>();

// 	if (!title) return json({ error: "Missing ticket Title" }, 400);

// 	const formattedticket = await createNewTicket(title);
// 	return json(formattedticket, 201);
// });

ticketsRouter.get("/", async ({ json }) => {
	console.log("1. Route hit");
	const tickets = await fetchAllTickets();
	console.log("2. Firebase data fetched successfully");
	return json({ tickets }, 200);
});

ticketsRouter.get("/:id", async ({ req, json }) => {
	const ticketId = req.param("id");
	const tickets = await fetchTicketById(ticketId);
	return json({ tickets }, 200);
});

// ticketsRouter.patch("/:id", async ({ req, json }) => {
// 	const ticketId = req.param("id");
// 	const bodyData = await req.parseBody();

// 	// Call the shared helper
// 	const { status } = await modifyTicket(ticketId, bodyData);

// 	return json(
// 		{ message: "Successfully updated ticket" },
// 		status as ContentfulStatusCode,
// 	);
// });

ticketsRouter.delete("/:id", async ({ req, json }) => {
	const ticketId = req.param("id");
	await removeTicket(ticketId);
	return json({ message: "ticket successfully deleted!" }, 200);
});

export default ticketsRouter;
