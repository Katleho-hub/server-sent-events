import { Timestamp } from "firebase-admin/firestore";
import z from "zod";
export const TimestampType = z.custom<Timestamp>(
	(value) => value instanceof Timestamp,
);

export const ticketStatusSchema = z.enum([
	"preparing",
	"next",
	"readyForPickup",
]);

export const ticketSchema = z.object({
	status: ticketStatusSchema,
	ticketId: z.string().startsWith("ticket_").min(1, "Ticket ID is required"),
	createdAt: TimestampType,
});

export const newTicketSchema = ticketSchema.pick({
	ticketId: true,
});

export const updateTicketSchema = ticketSchema.pick({
	status: true,
});

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type NewTicketPayload = z.infer<typeof newTicketSchema>;
export type UpdateTicketPayload = z.infer<typeof updateTicketSchema>;
