"use client";

import React from "react";
import { useRouter } from "next/navigation";
import byteSize from "byte-size";

const Document = ({
	id,
	name,
	size,
	downloadUrl,
}: {
	id?: string;
	name: string;
	size: number;
	downloadUrl: string;
}) => {
	const router = useRouter();

	return (
		<div className="flex flex-col w-64 h-80 rounded-xl bg-background drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-primary hover:text-background cursor-pointer group">
			<div
				className="flex-1"
				onClick={() => {
					router.push(`/dashboard/files/${id}`);
				}}
			>
				<p className="font-medium line-clamp-2">{name}</p>
				<p className="text-sm text-foreground group-hover:text-background">
					{byteSize(size).value} KB
				</p>
			</div>
		</div>
	);
};

export default Document;
