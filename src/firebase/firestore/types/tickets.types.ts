import type { Timestamp } from "firebase-admin/firestore";

type Status = "preparing" | "next" | "ready for pickup";
//TODO: USE ZOD TO VALIDATE TICKET DATA AND STATUS

export interface Ticket {
	ticketId: string;
	ticketNumber: string;
	status: Status;
	createdAt: Timestamp;
}

export type NewTicket = Ticket;

export type NewTicketData = Omit<Ticket, "createdAt" | "status">;
