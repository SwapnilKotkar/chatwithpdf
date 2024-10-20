"use server";

import Chat from "@/components/Chat";
import PDFView from "@/components/PDFView";
import { connectToDatabase } from "@/lib/database";
import { getUserDataFromToken } from "@/lib/getUser";
import Chats from "@/models/chats.model";
import Files from "@/models/files.model";
import { Message } from "@/types";

async function ChatToFilePage({
	params: { id },
}: {
	params: {
		id: string;
	};
}) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_ChatToFilePage----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	await connectToDatabase();

	let fileData = await Files.findOne({ user: userData.userId, fileId: id });

	if (!fileData) {
		throw new Error("File not found!");
	}

	console.log("fileData_inside_ChatToFilePage----", fileData);

	const downloadUrl = fileData.downloadUrl;
	console.log("downloadUrl_inside_ChatToFilePage----", downloadUrl);

	let chats = await Chats.find({ fileId: id, user: userData.userId })
		.sort({
			createdAt: 1,
		})
		.lean();

	console.log("chats_inside_ChatToFilePage----", chats);

	const formattedChats: Message[] = chats.map((chat) => ({
		_id: chat._id?.toString(), // Convert _id to string
		role: chat.role, // Assuming 'role' is part of your chat document
		message: chat.message, // Assuming 'message' is part of your chat document
		createdAt: chat.createdAt, // Use Date or format as needed
	}));

	console.log("formattedChats_inside_ChatToFilePage----", formattedChats);

	return (
		<div className="grid lg:grid-cols-5 h-full overflow-hidden">
			<div className="col-span-5 lg:col-span-2 overflow-y-auto">
				<Chat id={id} chats={formattedChats} />
			</div>
			<div className="col-span-5 lg:col-span-3 bg-muted border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto scrollbar-thin">
				<PDFView url={downloadUrl} />
			</div>
		</div>
	);
}

export default ChatToFilePage;
