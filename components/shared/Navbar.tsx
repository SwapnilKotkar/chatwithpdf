"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter, usePathname } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import { MoveLeft, MoveRight } from "lucide-react";

const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [decodedToken, setDecodedToken] = useState<string | JwtPayload | null>(
		null
	);

	console.log("pathname111", pathname);
	console.log("decodedToken", decodedToken);

	const handleSignOut = async () => {
		Cookies.remove("token");
		setDecodedToken(null);

		router.refresh();
		console.log("User signed out");
	};

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			const decoded = jwt.decode(token);
			console.log("Decoded navbar Token----------------------", decoded);
			setDecodedToken(decoded);
		}
	}, []);

	return (
		<div className="py-4 px-4 flex items-center justify-between border-b shadow-sm">
			<div>
				<p className="border px-2 py-2 bg-primary text-background text-sm font-medium italic">
					chatwithPDF
				</p>
			</div>
			<div className="flex items-center space-x-2">
				{decodedToken ? (
					<>
						{pathname === "/" ? (
							<Button
								asChild
								variant={"outline"}
								className="border border-primary/70 text-primary"
							>
								<Link href="/dashboard">
									Dashboard <MoveRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						) : (
							<Button
								asChild
								variant={"outline"}
								className="border border-primary/70 text-primary"
							>
								<Link href="/">
									<MoveLeft className="mr-2 h-4 w-4" />
									Home
								</Link>
							</Button>
						)}
						<Button onClick={handleSignOut}>Sign out</Button>
					</>
				) : (
					<Button asChild>
						<Link href="/signin">Sign in</Link>
					</Button>
				)}
				<ThemeToggle />
			</div>
		</div>
	);
};

export default Navbar;
