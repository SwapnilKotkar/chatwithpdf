"use client";

import {
	CheckCircleIcon,
	CircleArrowDown,
	HammerIcon,
	RocketIcon,
	SaveIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUpload, { StatusText } from "./hooks/useUpload";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

const FileUploader = () => {
	const router = useRouter();

	const { progress, status, fileId, handleUpload } = useUpload();

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			// Do something with the files

			const file = acceptedFiles[0];

			if (file) {
				await handleUpload(file);
			} else {
				// do nothing...
			}
		},
		[handleUpload]
	);

	const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: { "application/pdf": [".pdf"] },
	});

	const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

	const statusIcons: {
		[key in StatusText]: JSX.Element;
	} = {
		[StatusText.UPLOADNG]: <RocketIcon className="h-20 w-20 text-primary" />,
		[StatusText.UPLOADED]: (
			<CheckCircleIcon className="h-20 w-20 text-primary" />
		),
		[StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-primary" />,
		[StatusText.GENERATING]: <HammerIcon className="h-20 w-20 text-primary" />,
	};

	useEffect(() => {
		if (fileId) {
			router.push(`/dashboard/files/${fileId}`);
		}
	}, [fileId, router]);

	// useEffect(() => {
	// 	const token = Cookies.get("token");
	// 	if (token) {
	// 		const decoded = jwt.decode(token) as User;
	// 		console.log("Decoded_file_user---------", decoded);
	// 		setUser(decoded);
	// 	}
	// }, []);

	return (
		<div className="max-w-screen-lg mx-auto p-10">
			{uploadInProgress && (
				<div className="mt-32 flex flex-col justify-center items-center gap-5">
					<div
						className={`radial-progress bg-primary/30 text-white border-primary border-4 ${
							progress === 100 && "hidden"
						}`}
						role="progressbar"
						style={{
							// @ts-ignore
							"--value": progress,
							"--size": "12rem",
							"--thickness": "1.3rem",
						}}
					>
						{progress} %
					</div>

					{/* @ts-ignore */}
					{statusIcons[status!]}

					{/* @ts-ignore */}
					<p className="text-primary animate-pulse">{status}</p>
				</div>
			)}
			{!uploadInProgress && (
				<div
					{...getRootProps()}
					className={`${
						isFocused || isDragActive ? "bg-primary/50" : "bg-primary/10"
					} border-2 border-dashed border-primary text-primary rounded-lg h-96 flex flex-col items-center justify-center cursor-pointer`}
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<>
							<RocketIcon className="h-20 w-20 animate-ping" />
							<p>Drop the files here ...</p>
						</>
					) : (
						<>
							<CircleArrowDown className="h-20 w-20 animate-bounce" />
							<p>Drag n drop some files here, or click to select files</p>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default FileUploader;
