import z from "zod";

export type NewTicket = Omit<Ticket, "createdAt" | "status">;

export const ticketStatusSchema = z.enum([
	"preparing",
	"next",
	"readyForPickup",
]);

export const ticketSchema = z.object({
	status: ticketStatusSchema,
	ticketId: z.string().min(1, "Ticket ID is required"),
	ticketNumber: z.string().min(1, "Ticket Number is required"),
	createdAt: z.iso.datetime(),
});

export const newTicketSchema = ticketSchema.pick({
	ticketId: true,
	ticketNumber: true,
});

export const updateTicketSchema = ticketSchema.pick({
	ticketId: true,
	status: true,
});

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type NewTicketPayload = z.infer<typeof newTicketSchema>;
export type UpdateTicketPayload = z.infer<typeof updateTicketSchema>;
