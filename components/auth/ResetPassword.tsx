"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, MoveLeft } from "lucide-react";
import { z } from "zod";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { newPasswordSchema } from "@/lib/validators";
import Link from "next/link";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { AXIOS } from "@/axios";

const ResetPassword = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [isPending, startTransition] = useTransition();
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");

	const form = useForm<z.infer<typeof newPasswordSchema>>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof newPasswordSchema>) {
		setPasswordError("");
		setPasswordSuccess("");
		startTransition(async () => {
			if (!email) {
				setPasswordError("Something went wrong. Please go back and try again.");
				return;
			}
			try {
				let response = await AXIOS.post("/api/user/resetpassword", {
					email: email,
					password: data.newPassword,
				});

				console.log("password_reset_response", response);

				setPasswordSuccess(response?.data?.message);

				setTimeout(() => {
					router.push(`/signin`);
				}, 1500);
			} catch (error: any) {
				console.error("�� Error while resetting password ---", error);
				setPasswordError(error?.response?.data?.error);
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="z-10 space-y-3 min-w-[400px] max-w-[500px] mx-auto"
			>
				{passwordError && (
					<Alert variant="destructive" className="bg-background">
						<ExclamationTriangleIcon className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{passwordError}</AlertDescription>
					</Alert>
				)}
				{passwordSuccess && (
					<Alert variant="default" className="border-green-500 bg-background">
						<Check className="h-4 w-4" color="green" />
						<AlertTitle className="text-green-500 font-medium">
							Success
						</AlertTitle>
						<AlertDescription className="text-green-500">
							{passwordSuccess}
						</AlertDescription>
					</Alert>
				)}
				<Card className="w-full">
					<CardHeader>
						<div className="mb-2">
							<Link
								href="/signin"
								className="flex items-center space-x-2 text-xs text-primary hover:underline"
							>
								<MoveLeft className="mr-2 h-4 w-4" /> back
							</Link>
						</div>
						<CardTitle className="text-2xl">New password</CardTitle>
						<CardDescription>Enter your new password here.</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="newPassword"
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
							name="confirmNewPassword"
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
						{!passwordSuccess && isPending ? (
							<Button disabled className="w-full mt-4">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Please wait...
							</Button>
						) : !passwordSuccess ? (
							<Button type="submit" className="w-full mt-4">
								Confirm
							</Button>
						) : (
							""
						)}

						{passwordSuccess && (
							<Button disabled className="w-full mt-4">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Redirecting to signin page...
							</Button>
						)}
					</CardContent>
				</Card>
			</form>
		</Form>
	);
};

export default ResetPassword;
