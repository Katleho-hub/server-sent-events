import z from "zod";

export const ticketStatusSchema = z.enum([
	"preparing",
	"next",
	"readyForPickup",
]);

export const ticketSchema = z.object({
	status: ticketStatusSchema,
	ticketId: z.string().startsWith("ticket_").min(1, "Ticket ID is required"),
	createdAt: z.iso.datetime(),
});

export const newTicketSchema = ticketSchema.pick({
	ticketId: true,
});

export const updateTicketSchema = ticketSchema.pick({
	ticketId: true,
	status: true,
});

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type NewTicketPayload = z.infer<typeof newTicketSchema>;
export type UpdateTicketPayload = z.infer<typeof updateTicketSchema>;
