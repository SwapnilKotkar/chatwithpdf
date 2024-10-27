"use server";

import Files from "@/models/files.model";
import { connectToDatabase } from "../database";
import { getUserDataFromToken } from "../getUser";
import Chats from "@/models/chats.model";
import { generateLangchainCompletion } from "../langchain";
import { Message } from "@/types";
import User from "@/models/user.model";
import { FREE_LIMIT, PRO_LIMIT } from "../TierLimits";

// const FREE_LIMIT = 3;
// const PRO_LIMIT = 100;

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

	console.log("userMessages111", userMessages.length);
	console.log("FREE_LIMIT_____", FREE_LIMIT);
	console.log("PRO_LIMIT_____", PRO_LIMIT);

	const user = await User.findById(userData.userId);

	console.log("user_inside_askquestions", user);

	//check if user is on FREE plan and has asked more than FREE_LIMIT of qustions
	if (!user.activeMembership) {
		if (userMessages.length >= FREE_LIMIT) {
			return {
				success: false,
				message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions! 😕`,
			};
		}
	}

	if (user.activeMembership) {
		if (userMessages.length >= PRO_LIMIT) {
			return {
				success: false,
				message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document`,
			};
		}
	}

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
