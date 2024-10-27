"use client";

import React from "react";
import { Message } from "@/types";
import { useSession } from "../hooks/SessionProvider";
import { Loader2Icon, BotIcon } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";

const ChatMessage = ({ message }: { message: Message }) => {
	const { user } = useSession();
	console.log("user_ChatMessage", user);

	const isHuman = message.role === "human";

	return (
		<div className={`chat ${isHuman ? "chat-end" : "chat-start"} space-y-5`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					{isHuman ? (
						user?.image && (
							<Image
								src={
									user?.image ||
									"https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
								}
								alt="profile picture"
								width={40}
								height={40}
								className="rounded-full"
							/>
						)
					) : (
						<div className="h-10 w-10 bg-primary flex items-center justify-center">
							<BotIcon className="text-background h-7 w-7" />
						</div>
					)}
				</div>
			</div>
			<div
				className={`chat-bubble prose ${
					isHuman ? "bg-foreground/90 text-background" : "bg-primary"
				} text-background`}
			>
				{message.message === "Thinking..." ? (
					<div className="flex items-center justify-center">
						<Loader2Icon className="animate-spin h-5 w-5 text-background" />
					</div>
				) : (
					<Markdown className="overflow-auto scrollbar-thin">
						{message.message}
					</Markdown>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
