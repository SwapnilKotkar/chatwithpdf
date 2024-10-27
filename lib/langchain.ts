import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { getUserDataFromToken } from "./getUser";
import Files from "@/models/files.model";
import { connectToDatabase } from "./database";
import Chats from "@/models/chats.model";

const model = new ChatOpenAI({
	apiKey: process.env.OPENAI_KEY,
	modelName: "gpt-4o",
});

export const indexName = process.env.PINECONE_INDEXNAME;

async function fetchMessagesfromDB(docId: string) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_fetchMessagesfromDB----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	const chats = await Chats.find({ fileId: docId, user: userData.userId }).sort(
		{ createdAt: -1 }
	);
	// .limit(6);

	console.log("chats_fetched", chats);

	const chatHistory = chats.map((chat) => {
		return chat.role === "human"
			? new HumanMessage(chat.message)
			: new AIMessage(chat.message);
	});

	console.log(
		`--- fetched last ${chatHistory.length} messages successfully ---`
	);

	console.log(
		"chatHistory----",
		chatHistory.map((msg) => msg.content.toString())
	);

	return chatHistory;
}

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

	const index = await pineconeClient.index(indexName);
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

const generateLangchainCompletion = async (docId: string, question: string) => {
	let pineconeVectoreStore;

	pineconeVectoreStore = await generateEmbeddingsInpineconeVectorStore(docId);
	if (!pineconeVectoreStore) {
		throw new Error("Pinecone vectore store not found");
	}
	//create a retriever to search through the vector store
	console.log("--- Craeting a retriever... ---");
	const retriever = pineconeVectoreStore.asRetriever();

	//fetch the chat history from the database
	const chatHistory = await fetchMessagesfromDB(docId);

	//define a prompt template for generating search queries based on conversation history
	console.log("--- Defining a prompt template... ---");

	const historyAwarePrompt = ChatPromptTemplate.fromMessages([
		...chatHistory, // Insert the actual chat history here
		["user", "{input}"],
		[
			"user",
			"Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
		],
	]);

	//create a history-aware retriever chain that uses the model, retriever, and prompt
	console.log("--- creating a history-aware retriever chain... ---");
	const historyAwareRetrieverChain = await createHistoryAwareRetriever({
		llm: model,
		retriever,
		rephrasePrompt: historyAwarePrompt,
	});

	// define a prompt template for answering questions based on retrieved context
	console.log("--- defining a prompt template for answering questions... ---");
	const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
		[
			"system",
			"Answer the user's questions based on the below context:\n\n{context}",
		],
		...chatHistory,
		["user", "{input}"],
	]);

	//create a chain to combine the retieved documents into a coherent response
	console.log("--- Creating a document combing chain... ---");
	const historyAwareCombineDocsChain = await createStuffDocumentsChain({
		llm: model,
		prompt: historyAwareRetrievalPrompt,
	});

	//create the main retrieval chain that combines the history-aware retiever and documents combining chains
	console.log("--- creating the main retrieval chain... ---");
	const conversationalRetrievalChain = await createRetrievalChain({
		retriever: historyAwareRetrieverChain,
		combineDocsChain: historyAwareCombineDocsChain,
	});

	console.log("--- running the chain with a sample conversation... ---");
	const reply = await conversationalRetrievalChain.invoke({
		chat_history: chatHistory,
		input: question,
	});

	console.log("reply----", reply.answer);
	return reply.answer;
};

export { model, generateLangchainCompletion };
