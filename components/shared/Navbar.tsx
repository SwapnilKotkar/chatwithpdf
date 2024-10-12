"use client";
import React from "react";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter } from "next/navigation";

const Navbar = () => {
	const router = useRouter();

	let session = 123;

	const handleSignOut = async () => {
		Cookies.remove("token");

		// Optional: Redirect the user or perform additional sign-out logic
		router.push("/signin");
		console.log("User signed out");
	};

	return (
		<div className="py-4 px-4 flex items-center justify-between border-b shadow-sm">
			<div>
				<p>Auth UI</p>
			</div>
			<div className="flex items-center space-x-2">
				{session && <Button onClick={handleSignOut}>Sign out</Button>}
				<ThemeToggle />
			</div>
		</div>
	);
};

export default Navbar;
