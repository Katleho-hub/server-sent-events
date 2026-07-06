import { nanoid } from "nanoid";
import { todoUpdateSchema } from "server/validation/todo.validation.js";
import {
	createTicket,
	deleteTicket,
	getAllTickets,
	updateTicket,
} from "./collections/tickets/tickets.collections";
import { formatTicket } from "./format-ticket.helper";

export const createNewTodo = async (title?: string) => {
	if (!title) throw new Error("Missing Todo Title");
	const ticket = await createTicket(title, nanoid());
	return formatTicket(ticket.data);
};

export const fetchAllTickets = async () => {
	const tickets = await getAllTickets();
	return tickets.data.map(formatTicket);
};

export const fetchTicketById = async (id: string) => {
	const tickets = await getTicketById(id);
	return tickets.data.map(formatTicket);
};

export const modifyTicket = async (
	id: string,
	updateData: Record<string, unknown>,
) => {
	const body = todoUpdateSchema.parse({
		...updateData,
		public_id: id,
	});

	const result = await updateTicket(id, body);
	return result;
};

export const removeTicket = async (id: string) => {
	await deleteTicket(id);
	return true;
};
