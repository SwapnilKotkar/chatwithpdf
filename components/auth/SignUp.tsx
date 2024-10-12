"use client";

import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Check } from "lucide-react";
import { signUpSchema } from "@/lib/validators";
import { AXIOS } from "@/axios";

const SignUp = () => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [signupError, setSignupError] = useState("");
	const [signupSuccess, setSignupSuccess] = useState("");

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
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

	async function onSubmit(data: z.infer<typeof signUpSchema>) {
		setSignupError("");
		setSignupSuccess("");
		console.log("user signup data", data);
		startTransition(async () => {
			try {
				let response = await AXIOS.post("/api/user/signup", {
					email: data.email,
					password: data.password,
				});
				console.log("response created data---", response);

				setSignupSuccess(response.data.message);
				if (response.data.message) {
					setSignupSuccess(response.data.message);
					form.reset();
				} else {
					setSignupError(response.data.error);
				}
			} catch (error: any) {
				console.log("Error while creating user123", error.response);
				setSignupError(error?.response?.data?.error);
			}
		});
	}

	useEffect(() => {
		console.log("sign_up form errors", form.formState.errors); // Log form errors
	}, [form.formState.errors]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="z-10 space-y-3 min-w-[400px] max-w-[500px] mx-auto"
			>
				{signupError && (
					<Alert variant="destructive" className="bg-background">
						<ExclamationTriangleIcon className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{signupError}</AlertDescription>
					</Alert>
				)}
				{signupSuccess && (
					<Alert variant="default" className="bg-background border-green-500">
						<Check className="h-4 w-4" color="green" />
						<AlertTitle className="text-green-500 font-medium">
							Success
						</AlertTitle>
						<AlertDescription className="text-green-500">
							{signupSuccess}
						</AlertDescription>
					</Alert>
				)}
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-xl">Sign Up</CardTitle>
						<CardDescription>
							Enter your information to create an account
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
										<FormLabel>
											Password <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Confirm Password <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isPending ? (
								<Button disabled>
									<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</Button>
							) : (
								<Button type="submit" className="w-full">
									Create an account
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
										<span>Sign up with Google</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										disabled={isPending ? true : false}
										onClick={handleGitHubLogin}
										className="w-full space-x-2 flex items-center border border-foreground/20"
									>
										<FaGithub size={15} className="text-[#333]" />
										<span>Sign up with GitHub</span>
									</Button>
								</div>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link href="/signin" className="underline text-blue-500">
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
};

export default SignUp;
