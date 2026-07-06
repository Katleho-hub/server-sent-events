import { type Firestore, Timestamp } from "firebase-admin/firestore";
import {
	createDocumentWithCustomID,
	deleteDocument,
	getAllCollectionDocuments,
	getDocument,
	updateDocument,
} from "../../document.utils";
import type {
	NewTicket,
	Ticket,
	UpdateTicketPayload,
} from "../../types/tickets.types";

const COLLECTION = "tickets";

/*------------------Create ticket----------------------*/
async function createTicket(db: Firestore, data: NewTicket) {
	if (data?.ticketId === undefined || data?.ticketNumber === undefined) {
		throw new Error("Invalid data: ticketId and ticketNumber are required.");
	}

	try {
		const newTicket: Ticket = {
			ticketId: data.ticketId,
			ticketNumber: data.ticketNumber,
			createdAt: new Date().toISOString(),
			status: "preparing",
		};

		await createDocumentWithCustomID(
			db,
			COLLECTION,
			newTicket.ticketId,
			newTicket,
		);
		console.log(`✅ Ticket ${newTicket.ticketNumber} created successfully!`);
	} catch (error) {
		console.error("Error creating ticket:", error);
		throw new Error("Failed to create ticket.");
	}
}

/*------------------Read ticket----------------------*/
async function getAllTickets(db: Firestore) {
	try {
		return await getAllCollectionDocuments(
			db,
			COLLECTION,
			undefined,
			"createdAt",
		);
	} catch (error) {
		console.error("Error getting all tickets:", error);
		throw new Error("Failed to retrieve tickets.");
	}
}

async function getTicket(db: Firestore, documentID: string) {
	try {
		const response = await getDocument(db, COLLECTION, documentID);
		if (!response) {
			throw new Error(`Ticket with ID ${documentID} not found.`);
		}
		return response;
	} catch (error) {
		console.error("Error getting ticket:", error);
		throw new Error("Failed to retrieve ticket.");
	}
}

/*------------------Update ticket----------------------*/
async function updateTicket(
	db: Firestore,
	documentID: string,
	data: UpdateTicketPayload,
) {
	try {
		const ticket = {
			...data,
			updatedAt: Timestamp.now(),
		};

		await updateDocument(db, COLLECTION, documentID, ticket);
		return { updatedAt: ticket.updatedAt };
	} catch (error) {
		console.error("Error updating ticket:", error);
		throw new Error("Failed to update ticket.");
	}
}

/*------------------Delete ticket----------------------*/
async function deleteTicket(db: Firestore, documentID: string) {
	try {
		const response = await deleteDocument(db, COLLECTION, documentID);
		return { writeTime: response.writeTime, success: true };
	} catch (error) {
		console.error("Error deleting ticket:", error);
		throw new Error("Failed to delete ticket.");
	}
}

export { createTicket, deleteTicket, getAllTickets, getTicket, updateTicket };
