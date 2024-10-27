"use client";

import React, {
	FormEvent,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "@/hooks/SessionProvider";
import { askQuestion } from "@/lib/actions/askQuestion";
import { Message } from "@/types";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

const Chat = ({ id, chats }: { id: string; chats: Message[] }) => {
	const { user } = useSession();
	console.log("user_chatpage", user);

	const { toast } = useToast();
	const [input, setInput] = useState("");
	const [isPending, startTransition] = useTransition();
	const [messages, setMessages] = useState<Message[]>([]);
	const [loadingChats, setLoadingChats] = useState<boolean>(true);
	const bottomOfChatRef = useRef<HTMLDivElement>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const question = input;

		setInput("");

		setMessages((prev) => [
			...prev,
			{ role: "human", message: question, createdAt: new Date() },
			{ role: "ai", message: "Thinking...", createdAt: new Date() },
		]);

		startTransition(async () => {
			const { success, message } = await askQuestion(id, question);

			console.log("question_success", success);
			console.log("question_message", message);

			if (!success) {
				toast({
					variant: "destructive",
					title: "Error",
					description: message,
				});

				setMessages((prev) =>
					prev.slice(0, prev.length - 1).concat([
						{
							role: "ai",
							message: `Whoops... ${message}`,
							createdAt: new Date(),
						},
					])
				);
			} else {
				setMessages((prev) =>
					prev.slice(0, prev.length - 1).concat([
						{
							role: "ai",
							message: message,
							createdAt: new Date(),
						},
					])
				);
			}
		});
	};

	useEffect(() => {
		bottomOfChatRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages]);

	useEffect(() => {
		setLoadingChats(false);
		if (!chats.length) return;
		console.log("fetched_chats-----", chats);

		const lastMessage = messages.pop();

		if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
			return;
		}

		const newMessages = chats.map((chat) => {
			const { role, message, createdAt } = chat;

			return {
				id: chat._id?.toString(),
				role: role,
				message: message,
				createdAt: createdAt,
			};
		});

		setMessages(newMessages);
	}, [chats]);

	return (
		<div className="flex flex-col h-full overflow-auto scrollbar-thin">
			<div className="flex-1 w-full">
				{loadingChats ? (
					<div className="flex items-center justify-center">
						<Loader2Icon className="animate-spin h-20 w-20 mt-20 text-black" />
					</div>
				) : (
					<div className="p-5">
						{messages.length === 0 && (
							<ChatMessage
								key="placeholder"
								message={{
									role: "ai",
									message: "Ask me anything about the document",
									createdAt: new Date(),
								}}
							/>
						)}

						{messages.map((message, index) => (
							<ChatMessage key={index} message={message} />
						))}

						<div ref={bottomOfChatRef} />
					</div>
				)}
			</div>
			<form
				onSubmit={handleSubmit}
				className="flex sticky bottom-0 space-x-2 p-5 bg-background border-t border-t-muted-foreground"
			>
				<Input
					placeholder="Ask a question..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="text-foreground border border-muted-foreground/50"
				/>
				<Button type="submit" disabled={!input || isPending}>
					{isPending ? (
						<Loader2Icon className="animate-spin text-foreground" />
					) : (
						"Ask"
					)}
				</Button>
			</form>
		</div>
	);
};

export default Chat;
