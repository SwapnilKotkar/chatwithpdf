import React from "react";

import type { Metadata } from "next";
import FileUploader from "@/components/FileUploader";

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
		<div className="">
			<FileUploader />
		</div>
	);
};

export default Page;
