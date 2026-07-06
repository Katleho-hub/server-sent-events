import * as admin from "firebase-admin";
import { cert } from "firebase-admin";
import { type Firestore, Timestamp } from "firebase-admin/firestore";
import type {
	NewTicket,
	NewTicketData,
	Ticket,
} from "../../types/tickets.types";
import {
	createDocumentWithCustomID,
	deleteDocument,
	getAllCollectionDocuments,
	getDocument,
	updateDocument,
} from "../../utils/document.utils";

const COLLECTION = "tickets";

admin.initializeApp({
	credential: cert({
		projectId: process.env.PROJECT_ID,
		clientEmail: process.env.CLIENT_EMAIL,
		privateKey: process.env.PRIVATE_KEY,
	}),
});

/*------------------Create ticket----------------------*/
async function createTicket(db: Firestore, data: NewTicketData) {
	if (data?.ticketId === undefined || data?.ticketNumber === undefined) {
		throw new Error("Invalid data: ticketId and ticketNumber are required.");
	}

	try {
		const newTicket: NewTicket = {
			ticketId: data.ticketId,
			ticketNumber: data.ticketNumber,
			createdAt: Timestamp.now(),
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
	data: Partial<Ticket>,
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
