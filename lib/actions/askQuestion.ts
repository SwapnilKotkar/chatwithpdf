"use server";

import Files from "@/models/files.model";
import { connectToDatabase } from "../database";
import { getUserDataFromToken } from "../getUser";
import Chats from "@/models/chats.model";
import { generateLangchainCompletion } from "../langchain";
import { Message } from "@/types";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_askQuestion----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	await connectToDatabase();

	let ChatsData = await Chats.find({ fileId: id, user: userData.userId });

	if (!ChatsData) {
		throw new Error("Chats not found!");
	}
	console.log("ChatsData_inside_generateDocs----", ChatsData);

	const userMessages = await ChatsData.filter(
		(chat: any) => chat.role === "human"
	);

	const userMessage: Message = {
		role: "human",
		message: question,
		createdAt: new Date(),
	};

	await Chats.create({
		user: userData.userId,
		fileId: id,
		...userMessage,
	});

	const reply = await generateLangchainCompletion(id, question);

	const aiMessage: Message = {
		role: "ai",
		message: reply,
		createdAt: new Date(),
	};

	await Chats.create({
		user: userData.userId,
		fileId: id,
		...aiMessage,
	});

	return { success: true, message: reply };
}
