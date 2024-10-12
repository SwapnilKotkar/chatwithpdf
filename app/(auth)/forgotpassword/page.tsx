import ForgotPassword from "@/components/auth/ForgotPassword";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Forgot password",
};

const page = () => {
	return (
		<div className="h-[100vh] flex items-center justify-center">
			<BackgroundBeamsWithCollision>
				<ForgotPassword />
			</BackgroundBeamsWithCollision>
		</div>
	);
};

export default page;
