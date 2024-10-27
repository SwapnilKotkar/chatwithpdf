"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { deleteDocument } from "@/lib/actions/deleteDocument";

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
	const [isDeleting, startTransition] = useTransition();
	const { hasActiveMembership } = useSubscription();

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

			<div className="flex space-x-2 justify-end">
				<Button
					variant="outline"
					disabled={isDeleting || !hasActiveMembership}
					onClick={() => {
						const prompt = window.confirm(
							"Are you sure you want to delete this document"
						);

						if (prompt) {
							startTransition(async () => {
								await deleteDocument(id!);
							});
						}
					}}
				>
					<Trash2Icon className="h-6 w-6 text-red-500" />
					{!hasActiveMembership && (
						<span className="text-red-500 ml-2">PRO Feature</span>
					)}
				</Button>
				<Button variant="outline" asChild>
					<a href={downloadUrl} download target="_blank">
						<DownloadCloud className="h-6 w-6 text-primary" />
					</a>
				</Button>
			</div>
		</div>
	);
};

export default Document;
