export const dynamic = "force-dynamic";

import React from "react";

import type { Metadata } from "next";
import DashboardPage from "@/components/DashboardPage";
import Documents from "@/components/Documents";

//working CASE 1
// export const metadata: Metadata = {
// 	title: {
// 		absolute: "Home page",
// 	},
// };

//working CASE 2 -- This case adds `Home - User Authentication App` on title tag, because `User Authentication App` is mentioned on layout page as a title tag
export const metadata: Metadata = {
	title: "Home",
};

const Page = () => {
	return (
		<div className="h-full space-y-4">
			<div className="py-6 px-4 bg-secondary">
				<h1 className="text-xl font-medium">My Documents</h1>
			</div>
			<div className="px-4">
				<Documents />
			</div>
			{/* <DashboardPage /> */}
		</div>
	);
};

export default Page;
