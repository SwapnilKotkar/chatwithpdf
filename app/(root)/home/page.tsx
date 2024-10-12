import Navbar from "@/components/shared/Navbar";
import React from "react";

import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

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
		<div className="h-[100vh] flex flex-col">
			<Navbar />
			<div className="flex-1">
				<HomePage />
			</div>
		</div>
	);
};

export default Page;
