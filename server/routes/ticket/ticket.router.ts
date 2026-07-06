import { Hono } from "hono";
import {
	createNewTicket,
	fetchAllTickets,
	fetchTicketById,
	modifyTicket,
	removeTicket,
} from "../../../src/firebase/firestore/ticket.service";
import { handleError } from "../todo/helpers/handle-error.helper";

const ticketsRouter = new Hono();

ticketsRouter.onError((err, c) => {
	return handleError(c, err);
});

ticketsRouter.post("/", async ({ json }) => {
	const formattedticket = await createNewTicket();
	return json(formattedticket, 201);
});

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

ticketsRouter.patch("/:id", async ({ req, json }) => {
	const ticketId = req.param("id");
	const bodyData = await req.parseBody();

	const { updatedAt } = await modifyTicket(ticketId, bodyData);

	return json({ message: "Successfully updated ticket", updatedAt }, 200);
});

ticketsRouter.delete("/:id", async ({ req, json }) => {
	const ticketId = req.param("id");
	await removeTicket(ticketId);
	return json({ message: "ticket successfully deleted!" }, 200);
});

export default ticketsRouter;
