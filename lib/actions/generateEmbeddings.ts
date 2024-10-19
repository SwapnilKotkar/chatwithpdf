"use server";

import { generateEmbeddingsInpineconeVectorStore } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
	// turn a PDF into embeddings [0.012344, 0.234342, ...]
	await generateEmbeddingsInpineconeVectorStore(docId);

	revalidatePath("/dashbaord");

	return {
		completed: true,
	};
}
