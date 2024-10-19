"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter, usePathname } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import {
	FilePlus2,
	MoreVertical,
	MoveLeft,
	MoveRight,
	Truck,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
		// alert(1);
		const token = Cookies.get("token");
		if (token) {
			// alert(2);
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
						<div className="hidden lg:flex items-center space-x-2">
							{pathname === "/" ? (
								<Button asChild variant={"secondary"} className="">
									<Link href="/dashboard">
										Dashboard <MoveRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							) : (
								<div className="flex items-center space-x-2">
									<Button asChild variant={"secondary"} className="">
										<Link href="/">
											<MoveLeft className="mr-2 h-4 w-4" />
											Home
										</Link>
									</Button>
									<Button asChild variant={"secondary"} className="">
										<Link href="/dashboard">My Documents</Link>
									</Button>
									<Button asChild variant={"secondary"} className="">
										<Link href="/dashboard/upload">
											<FilePlus2 className="h-4 w-4" />
										</Link>
									</Button>
								</div>
							)}
							<Button onClick={handleSignOut}>Sign out</Button>
						</div>
						<div className="flex lg:hidden items-center gap-1">
							{/* <Button size="sm" variant="outline" className="h-8 gap-1">
								<Truck className="h-3.5 w-3.5" />
								<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
									Track Order
								</span>
							</Button> */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon" variant="outline" className="h-8 w-8">
										<MoreVertical className="h-3.5 w-3.5" />
										<span className="sr-only">More</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{pathname === "/" ? (
										<DropdownMenuItem>
											<Button asChild variant={"ghost"} className="w-full">
												<Link href="/dashboard">
													Dashboard <MoveRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</DropdownMenuItem>
									) : (
										<>
											<DropdownMenuItem>
												<Button asChild variant={"ghost"} className="w-full">
													<Link href="/">
														<MoveLeft className="mr-2 h-4 w-4" />
														<span>Home</span>
													</Link>
												</Button>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Button asChild variant={"ghost"} className="w-full">
													<Link href="/dashboard">My Documents</Link>
												</Button>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Button asChild variant={"ghost"} className="w-full">
													<Link href="/dashboard/upload">
														<FilePlus2 className="mr-2 h-4 w-4" />
														Upload document
													</Link>
												</Button>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
										</>
									)}
									<DropdownMenuItem>
										<Button
											className="w-full"
											variant={"destructive"}
											onClick={handleSignOut}
										>
											Sign out
										</Button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</>
				) : (
					<Button asChild>
						<Link href="/signin">Sign in</Link>
					</Button>
				)}
				<div className="">
					<ThemeToggle />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
