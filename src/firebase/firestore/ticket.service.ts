import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import {
	createTicket,
	deleteTicket,
	getAllTickets,
	getTicket,
	updateTicket,
} from "./collections/tickets/tickets.collections";
import { formatTicket } from "./format-ticket.helper";
import {
	type NewTicketPayload,
	type Ticket,
	updateTicketSchema,
} from "./types/tickets.types";

const app = admin.initializeApp({
	credential: admin.cert({
		projectId: Bun.env.ADMIN_FIREBASE_PROJECT_ID,
		clientEmail: Bun.env.ADMIN_FIREBASE_CLIENT_EMAIL,
		privateKey: Bun.env.ADMIN_FIREBASE_PRIVATE_KEY,
	}),
});

export const db = getFirestore(app);

export const createNewTicket = async () => {
	const data: NewTicketPayload = {
		ticketId: `ticket_${nanoid()}`,
	};

	const ticket = await createTicket(db, data);
	return ticket;
};

export const fetchAllTickets = async () => {
	const tickets = await getAllTickets(db);
	return ((tickets as unknown[]) || []).map((ticket) =>
		formatTicket(ticket as Ticket),
	);
};

export const fetchTicketById = async (id: string) => {
	const ticket = await getTicket(db, id);
	return formatTicket(ticket as Ticket);
};

export const modifyTicket = async (
	id: string,
	updateData: Record<string, unknown>,
) => {
	const body = updateTicketSchema.parse(updateData);

	const result = await updateTicket(db, id, body);
	return result;
};

export const removeTicket = async (id: string) => {
	await deleteTicket(db, id);
	return true;
};
