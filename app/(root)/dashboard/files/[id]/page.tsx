import { connectToDatabase } from "@/lib/database";
import { getUserDataFromToken } from "@/lib/getUser";
import Files from "@/models/files.model";

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

	let fileData = await Files.findOne({ user: userData.userId });

	if (!fileData) {
		throw new Error("File not found!");
	}

	console.log("fileData_inside_ChatToFilePage----", fileData);

	const downloadUrl = fileData.downloadUrl;
	console.log("downloadUrl_inside_ChatToFilePage----", downloadUrl);

	return (
		<div className="grid lg:grid-cols-5 h-full overflow-hidden">
			<div className="col-span-5 lg:col-span-2 overflow-y-auto">hello</div>
			<div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
				hiii
			</div>
		</div>
	);
}

export default ChatToFilePage;
