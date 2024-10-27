"use client";

import React from "react";
import { Button } from "./ui/button";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";

const PlaceholderDocument = () => {
	const router = useRouter();
	const { isOverFileLimit } = useSubscription();

	console.log("isOverFileLimit", isOverFileLimit);

	const handleClick = () => {
		console.log("isOverFileLimit33", isOverFileLimit);

		//check if user is FREE tier and if they are over the file limit, push to the upgrade page
		if (isOverFileLimit) {
			router.push("dashboard/upgrade");
		} else {
			router.push("dashboard/upload");
		}
	};
	return (
		<Button
			onClick={handleClick}
			className="flex flex-col items-center h-80 w-64 rounded-xl drop-shadow-md bg-primary/10 text-foreground/50 hover:text-background"
		>
			{isOverFileLimit ? (
				<FrownIcon className="h-16 w-16" />
			) : (
				<PlusCircleIcon className="h-16 w-16" />
			)}
			<p>Add a document</p>
		</Button>
	);
};

export default PlaceholderDocument;
