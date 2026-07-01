import type { Firestore } from "firebase-admin/firestore";

/**
 * ==========================================
 * CREATE OPERATIONS
 * ==========================================
 */

/**
 * Adds a new document to the specified collection using an auto-generated ID.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the target collection.
 * @param data - The payload to be saved in the document.
 * @returns A promise that resolves to a DocumentReference pointing to the newly created document.
 */
export function createDocument(db: Firestore, collection: string, data: any) {
	const collectionRef = db.collection(collection);
	return collectionRef.add(data);
}

/**
 * Creates a new document in the specified collection using a custom-defined ID.
 * Note: `create()` will fail if a document with this ID already exists.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the target collection.
 * @param documentID - The custom string identifier for the document.
 * @param data - The payload to be saved in the document.
 * @returns A promise that resolves to a WriteResult containing the creation time.
 */
export function createDocumentWithCustomID(
	db: Firestore,
	collection: string,
	documentID: string,
	data: any,
) {
	const docRef = db.collection(collection).doc(documentID);
	return docRef.create(data);
}

/**
 * ==========================================
 * READ OPERATIONS
 * ==========================================
 */

/**
 * Retrieves a single document's data by its collection and document ID.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the target collection.
 * @param documentID - The identifier of the document to retrieve.
 * @returns A promise that resolves to the document data, or undefined if the document does not exist.
 */
export async function getDocument(
	db: Firestore,
	collection: string,
	documentID: string,
) {
	const docRef = db.collection(collection).doc(documentID);
	const docSnap = await docRef.get();
	const docData = docSnap.data();

	return docData;
}

/**
 * Fetches all documents from a specific collection, optionally ordered by a field.
 * Allows passing a custom callback to map the document data.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the collection to fetch.
 * @param callback - Optional function to format or map each document snapshot.
 * @param orderBy - Optional field name to sort the documents by (descending order).
 * @returns A promise that resolves to an array of document data, or catches and returns the error.
 */
export async function getAllCollectionDocuments(
	db: Firestore,
	collection: string,
	callback?: (
		doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
	) => u,
	orderBy?: string,
) {
	try {
		const data: FirebaseFirestore.DocumentData[] = [];

		const collectionRef =
			orderBy === undefined
				? db.collection(collection)
				: db.collection(collection).orderBy(orderBy, "desc");

		const querySnap = await collectionRef.get();
		querySnap.forEach((doc) => {
			if (callback) {
				data.push(callback(doc));
			} else {
				data.push({
					...doc.data(),
					id: doc.id,
					createTime: `${!doc.data()?.createdAt ? doc.createTime.toDate() : doc.data().createdAt?.toDate()}`,
				});
			}
		});

		return data;
	} catch (error) {
		return error;
	}
}

/**
 * ==========================================
 * UPDATE OPERATIONS
 * ==========================================
 */

/**
 * Updates an existing document with the provided data.
 * Note: `update()` will fail if the document does not exist.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the collection containing the document.
 * @param documentID - The identifier of the document to update.
 * @param data - An object containing the fields and values to update.
 * @returns A promise that resolves to a WriteResult detailing the update time.
 */
export async function updateDocument(
	db: Firestore,
	collection: string,
	documentID: string,
	data: any,
) {
	const docRef = db.collection(collection).doc(documentID);

	return docRef.update(data);
}

/**
 * ==========================================
 * DELETE OPERATIONS
 * ==========================================
 */

/**
 * Deletes a document from the specified collection.
 * * @param db - The initialized Firestore instance.
 * @param collection - The name of the collection containing the document.
 * @param documentID - The identifier of the document to delete.
 * @returns A promise that resolves to a WriteResult once the deletion is complete.
 */
export async function deleteDocument(
	db: Firestore,
	collection: string,
	documentID: string,
) {
	const docRef = db.collection(collection).doc(documentID);

	return docRef.delete();
}
