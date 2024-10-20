import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/magicui/AnimatedGridPattern";
import { cn } from "@/lib/utils";
import {
	BrainCogIcon,
	EyeIcon,
	GlobeIcon,
	MonitorSmartphoneIcon,
	ServerCogIcon,
	ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
	const features = [
		{
			name: "Store your PDF Documents",
			description:
				"Keep all your important PDF files securely stores and easily accessible anytime, anywhere.",
			icon: GlobeIcon,
		},
		{
			name: "Blazing Fast Responses",
			description:
				"Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
			icon: ZapIcon,
		},
		{
			name: "Chat Memorisation",
			description:
				"Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
			icon: BrainCogIcon,
		},
		{
			name: "Interactive PDF Viewer",
			description:
				"Engage with your PDFs like never before using our intuitive and interactive viewer.",
			icon: EyeIcon,
		},
		{
			name: "Cloud Backup",
			description:
				"Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
			icon: ServerCogIcon,
		},
		{
			name: "Responsive Across Devices",
			description:
				"Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
			icon: MonitorSmartphoneIcon,
		},
	];

	return (
		<div className="h-full p-4">
			<AnimatedGridPattern
				numSquares={30}
				maxOpacity={0.1}
				duration={3}
				repeatDelay={1}
				className={cn(
					"[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
					"inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 -z-10"
				)}
			/>
			<div className="max-w-screen-sm mx-auto space-y-5 py-24">
				<div className="space-y-1">
					<p className="text-sm text-primary font-medium text-center">
						Your interactive document Companion
					</p>
					<h1 className="text-foreground text-2xl md:text-3xl xl:text-5xl font-semibold tracking-tighter leading-6 text-center ">
						Transform your PDFs into interactive Conversations
					</h1>
				</div>
				<div className="space-y-7">
					<p className="text-sm text-muted-foreground text-center">
						Introducing{" "}
						<span className="text-primary font-bold">Chat with PDF.</span>
					</p>
					<p className="text-sm md:text-base text-center">
						Upload your document, and our chatbot will answer questions,
						summarize content, and answer all your Qs. Ideal for everyone,{" "}
						<span className="text-primary font-medium">Chat with PDF</span>{" "}
						turns static documents into{" "}
						<span className="font-medium">dynamic conversations</span>,
						enhancing productivity 10x fold effortlessly.
					</p>
				</div>
				<div className="flex items-center justify-center">
					<Button asChild>
						<Link href="/dashboard">Get started</Link>
					</Button>
				</div>
			</div>
			<div className="relative overflow-hidden max-w-screen-xl mx-auto px-6 lg:px-8">
				<Image
					src={"https://i.imgur.com/VciRSTI.jpeg"}
					alt="app screenshot"
					width={2432}
					height={1442}
					className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
				/>

				<div aria-hidden="true" className="relative">
					<div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-background/95 pt-[5%]"></div>
				</div>
			</div>
			<div className="max-w-screen-xl mx-auto px-4 lg:px-2 py-28">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{features.map((feature, index) => (
						<div key={index} className="flex items-center space-x-6">
							<div className="flex-shrink-0">
								<feature.icon className="h-10 w-10 text-primary" />
							</div>
							<div className="flex-1 space-y-2">
								<h3 className="text-sm font-medium text-foreground">
									{feature.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default page;
