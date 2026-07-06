import type { Ticket } from "./types/tickets.types";

export function formatTicket(ticket: Ticket) {
	return {
		status: ticket.status,
		ticketId: ticket.ticketId,
		ticketNumber: ticket.ticketNumber,
		createdAt: ticket.createdAt.toDate().toLocaleTimeString(),
	};
}
