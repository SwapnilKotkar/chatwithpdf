import ResetPassword from "@/components/auth/ResetPassword";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import React, { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset password",
};

const page = () => {
	return (
		<div className="h-[100vh] flex items-center justify-center">
			<BackgroundBeamsWithCollision>
				<Suspense fallback={<div>Loading...</div>}>
					<ResetPassword />
				</Suspense>
			</BackgroundBeamsWithCollision>
		</div>
	);
};

export default page;
