import type { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../serviceAccount.json";
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
	updateTicketSchema,
} from "./types/tickets.types";

const app = admin.initializeApp({
	credential: admin.cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore(app);

export const createNewTicket = async (data?: NewTicketPayload) => {
	if (!data) throw new Error("Missing Todo Title");
	const ticket = await createTicket(db, data);
	return ticket;
};

export const fetchAllTickets = async () => {
	const tickets = await getAllTickets(db);
	return tickets;
};

export const fetchTicketById = async (id: string) => {
	const tickets = await getTicket(db, id);
	return tickets.data.map(formatTicket);
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
