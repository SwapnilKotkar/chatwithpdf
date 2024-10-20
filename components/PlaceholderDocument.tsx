"use client";

import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const PlaceholderDocument = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push("/dashboard/upload");
	};
	return (
		<Button
			onClick={handleClick}
			className="flex flex-col items-center h-80 w-64 rounded-xl drop-shadow-md bg-primary/10 text-foreground/50 hover:text-background"
		>
			<PlusCircleIcon className="h-16 w-16" />
			<p>Add a document</p>
		</Button>
	);
};

export default PlaceholderDocument;
