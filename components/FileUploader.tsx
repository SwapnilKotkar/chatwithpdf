"use client";

import { CircleArrowDown, RocketIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		// Do something with the files
	}, []);
	const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
		onDrop,
	});
	return (
		<div className="max-w-screen-lg mx-auto p-10">
			<div
				{...getRootProps()}
				className={`${
					isFocused || isDragActive ? "bg-primary/50" : "bg-primary/10"
				} border-2 border-dashed border-primary text-primary rounded-lg h-96 flex flex-col items-center justify-center`}
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
		</div>
	);
};

export default FileUploader;
