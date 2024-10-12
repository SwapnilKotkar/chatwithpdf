import SignIn from "@/components/auth/SignIn";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Signin",
};

const page = () => {
	return (
		<div className="h-[100vh] bg-muted-foreground/10 flex items-center justify-center">
			<BackgroundBeamsWithCollision>
				<SignIn />
			</BackgroundBeamsWithCollision>
		</div>
	);
};

export default page;
