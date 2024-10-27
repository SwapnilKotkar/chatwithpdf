"use server";

import Files from "@/models/files.model";
import { indexName } from "../langchain";
import pineconeClient from "../pinecone";
import { revalidatePath } from "next/cache";
import { getUserDataFromToken } from "../getUser";
import { adminStorage } from "@/firebaseAdmin";

export async function deleteDocument(docId: string) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_deleteDocument----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	await Files.findOneAndDelete({ fileId: docId });

	//delete from firebase storage
	await adminStorage
		.bucket(process.env.FIREBASE_STORAGE_BUCKET)
		.file(`users/${userData.userId}/files/${docId}`)
		.delete();

	// Delete all embeddings associated with the document
	if (!indexName) {
		throw new Error("indexName is not set.");
	}
	const index = await pineconeClient.index(indexName);
	await index.namespace(docId).deleteAll();

	revalidatePath("/dashboard");
}
