"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";

import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "../ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Check } from "lucide-react";
import { AXIOS } from "@/axios";

const SignIn = () => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [signinError, setSigninError] = useState("");
	const [signinSuccess, setSigninSuccess] = useState("");

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleGoogleLogin = () => {
		const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
		const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

		const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

		window.location.href = googleLoginUrl; // Redirect the user to Google's login page
	};

	const handleGitHubLogin = () => {
		const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
		const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

		// GitHub authorization URL
		const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;

		// Redirect user to GitHub login page
		window.location.href = githubLoginUrl;
	};

	async function onSubmit(data: z.infer<typeof loginSchema>) {
		setSigninError("");
		setSigninSuccess("");
		console.log("signin data", data);
		startTransition(async () => {
			try {
				let response = await AXIOS.post("/api/user/signin", data);

				console.log("found_user_data", response);

				const token = Cookies.get("token");
				console.log("Token from cookie:", token);

				if (!token) {
					setSigninSuccess(response?.data?.message);
				}

				// if (token) {
				// 	const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
				// 	console.log("Verified Token:", decodedToken);
				// }

				router.push("/home");
			} catch (error: any) {
				console.log("signin error", error);
				setSigninError(error?.response?.data?.error);
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="z-10 space-y-3 min-w-[400px] max-w-[500px] mx-auto"
			>
				{signinError && (
					<Alert variant="destructive" className="bg-background">
						<ExclamationTriangleIcon className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{signinError}</AlertDescription>
					</Alert>
				)}
				{signinSuccess && (
					<Alert variant="default" className="border-green-500 bg-background">
						<Check className="h-4 w-4" color="green" />
						<AlertTitle className="text-green-500 font-medium">
							Mail sent
						</AlertTitle>
						<AlertDescription className="text-green-500">
							{signinSuccess}
						</AlertDescription>
					</Alert>
				)}
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Email <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="max@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center">
											<FormLabel>
												Password <span className="text-red-500">*</span>
											</FormLabel>
											<Link
												href="/forgotpassword"
												className="ml-auto inline-block text-sm underline"
											>
												Forgot your password?
											</Link>
										</div>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isPending ? (
								<Button type="button" disabled>
									<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</Button>
							) : (
								<Button type="submit" className="w-full">
									Login
								</Button>
							)}
							<div className="space-y-3 my-4">
								<div className="flex items-center space-x-3">
									<div className="h-[1px] flex-1 bg-foreground/50"></div>
									<small className="text-muted-foreground text-xs">
										OR CONTINUE WITH
									</small>
									<div className="h-[1px] flex-1 bg-foreground/50"></div>
								</div>
								<div className="space-y-3">
									<Button
										type="button"
										variant="outline"
										disabled={isPending ? true : false}
										onClick={handleGoogleLogin}
										className="w-full space-x-2 flex items-center border border-foreground/20"
									>
										<FaGoogle size={15} className="text-[#DB4437]" />
										<span>Login with Google</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										disabled={isPending ? true : false}
										onClick={handleGitHubLogin}
										className="w-full space-x-2 flex items-center border border-foreground/20"
									>
										<FaGithub size={15} className="text-[#333]" />
										<span>Login with GitHub</span>
									</Button>
								</div>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="underline text-blue-500">
								Sign up
							</Link>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
};

export default SignIn;
