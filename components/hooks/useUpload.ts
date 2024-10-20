"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
	getDownloadURL,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { User } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { generateEmbeddings } from "@/lib/actions/generateEmbeddings";
import { AXIOS } from "@/axios";
import { useSession } from "./SessionProvider";

export enum StatusText {
	UPLOADNG = "Uploading file...",
	UPLOADED = "File uploaded successfully",
	SAVING = "Saving file to database...",
	GENERATING = "Generating AI Embedding, This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

const useUpload = () => {
	const router = useRouter();

	const [progress, setProgress] = useState<number | null>(null);
	const [fileId, setFileId] = useState<string | null>(null);
	const [status, setStatus] = useState<Status | null>(null);
	// const [user, setUser] = useState<User | null>(null);

	const { user } = useSession();
	console.log("user_useUpload", user);

	const handleUpload = async (file: File) => {
		console.log("user_handleUpload", user);

		// let userData = {
		// 	userId: "670a148a7e09a291432ca75c",
		// 	email: "swapnilkotkar793@gmail.com",
		// 	isEmailVerified: true,
		// 	iat: 1728730535,
		// 	exp: 1729335335,
		// };

		console.log("filex", file);
		// console.log("userData---", userData);

		if (!file || !user) {
			return;
		}

		const fileIdToUploadTo = uuidv4();

		const storageRef = ref(
			storage,
			`users/${user.userId}/files/${fileIdToUploadTo}`
		);

		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);

				setStatus(StatusText.UPLOADNG);
				setProgress(percent);
			},
			(error) => {
				console.error("file upload error", error);
			},
			async () => {
				setStatus(StatusText.UPLOADED);

				const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

				setStatus(StatusText.SAVING);

				console.log("file_after_upload", file);
				console.log("file_id_to_upload_to", fileIdToUploadTo);
				console.log("file_uploadTask", uploadTask);
				console.log("download_url", downloadUrl);

				// await setDoc(
				// 	doc(db, "users", userData.userId, "files", fileIdToUploadTo),
				// 	{
				// 		name: file.name,
				// 		size: file.size,
				// 		type: file.type,
				// 		downloadUrl: downloadUrl,
				// 		ref: uploadTask.snapshot.ref.fullPath,
				// 	}
				// );

				try {
					const token = Cookies.get("token");
					const response = await AXIOS.post(
						"/api/upload_file",
						{
							fileId: fileIdToUploadTo,
							name: file.name,
							size: file.size,
							type: file.type,
							downloadUrl: downloadUrl,
							ref: uploadTask.snapshot.ref.fullPath,
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`, // Include the token in the Authorization header
							},
						}
					);

					console.log("File metadata saved:", response.data);
					setStatus(StatusText.GENERATING);

					//GENERATING EBEDDINGS....
					await generateEmbeddings(fileIdToUploadTo);

					setFileId(fileIdToUploadTo);
				} catch (error: any) {
					console.log("Error while saving file to mongo", error);
					setFileId(null);
				}

				// setStatus(StatusText.GENERATING);
				// setFileId(fileIdToUploadTo);
			}
		);
	};

	// useEffect(() => {
	// 	const token = Cookies.get("token");
	// 	if (token) {
	// 		const decoded = jwt.decode(token) as User;
	// 		console.log("Decoded_user---------", decoded);
	// 		setUser(decoded);
	// 	}
	// }, []);

	return { progress, status, fileId, handleUpload };
};

export default useUpload;
