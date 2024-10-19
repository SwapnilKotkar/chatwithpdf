import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pinconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { getUserDataFromToken } from "./getUser";
import Files from "@/models/files.model";
import { connectToDatabase } from "./database";
// import { useSession } from "@/components/hooks/SessionProvider";
// const { user } = useSession();

const model = new ChatOpenAI({
	apiKey: process.env.OPENAI_KEY,
	modelName: "gpt",
});

export const indexName = process.env.PINECONE_INDEXNAME;

export async function generateDocs(docId: string) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_generateDocs----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	await connectToDatabase();

	let fileData = await Files.findOne({ fileId: docId });

	if (!fileData) {
		throw new Error("File not found!");
	}

	console.log("fileData_inside_generateDocs----", fileData);

	const downloadUrl = fileData.downloadUrl;

	if (!downloadUrl) {
		throw new Error("downloadUrl not found!");
	}

	const repsonse = await fetch(downloadUrl);
	const data = await repsonse.blob();

	console.log("--- loading PDF document ---");

	const loader = new PDFLoader(data);
	const docs = await loader.load();

	//spit the loaded document into smaller parts for easier processing
	const splitter = new RecursiveCharacterTextSplitter();
	const splitDocs = await splitter.splitDocuments(docs);
	console.log(`--- split into ${splitDocs.length} parts ---`);

	return splitDocs;
}

async function namespaceExists(
	index: Index<RecordMetadata>,
	namespace: string
) {
	if (namespace === null) throw new Error("No namespace value provided.");
	const { namespaces } = await index.describeIndexStats();
	return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInpineconeVectorStore(docId: string) {
	const userData = getUserDataFromToken();

	console.log(
		"userData_inside_generateEmbeddingsInpineconeVectorStore----",
		userData
	);

	if (!userData) {
		throw new Error("User not found!");
	}

	if (!indexName) {
		throw new Error("Pinecone index is not set!");
	}

	let pineconeVectoreStore;

	console.log("--------Generating embeddings for the split documents--------");

	const embeddings = new OpenAIEmbeddings({
		apiKey: process.env.OPENAI_KEY,
	});

	const index = await pinconeClient.index(indexName);
	const namespaceAlreadyExists = await namespaceExists(index, docId);

	if (namespaceAlreadyExists) {
		console.log(
			`--- Namespace ${docId} already exists, resuing existing embeddings... ---`
		);

		pineconeVectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
			pineconeIndex: index,
			namespace: docId,
		});

		return pineconeVectoreStore;
	} else {
		console.log(
			`--- Namespace ${docId} does not exist, creating new embeddings... ---`
		);

		const splitDocs = await generateDocs(docId);

		console.log(
			`--- Storing the embeddings in namepsace ${docId} in the ${indexName} Pinecone vectore store... ---`
		);

		pineconeVectoreStore = await PineconeStore.fromDocuments(
			splitDocs,
			embeddings,
			{
				pineconeIndex: index,
				namespace: docId,
			}
		);

		return pineconeVectoreStore;
	}
}
