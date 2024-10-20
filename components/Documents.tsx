import React from "react";
import PlaceholderDocument from "./PlaceholderDocument";
import { getUserDataFromToken } from "@/lib/getUser";
import { connectToDatabase } from "@/lib/database";
import Files from "@/models/files.model";
import Document from "./Document";

const Documents = async () => {
	const userData = getUserDataFromToken();

	console.log("userData_Documents----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	await connectToDatabase();

	let fileData = await Files.find({ user: userData.userId }).lean();

	if (!fileData) {
		throw new Error("File not found!");
	}

	console.log("fileData_inside_Documents----", fileData);
	return (
		<div className="flex flex-wrap p-5 bg-muted justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
			{fileData &&
				fileData.length > 0 &&
				fileData.map((file, index) => {
					const { name, downloadUrl, size } = file;

					return (
						<Document
							key={file._id?.toString()}
							id={file.fileId}
							name={name}
							size={size}
							downloadUrl={downloadUrl}
						/>
					);
				})}
			<PlaceholderDocument />
		</div>
	);
};

export default Documents;
