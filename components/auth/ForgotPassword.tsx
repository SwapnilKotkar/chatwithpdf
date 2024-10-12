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
import { forgotPasswordSchema } from "@/lib/validators";
import Link from "next/link";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { AXIOS } from "@/axios";

const ForgotPassword = () => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
		setPasswordError("");
		setPasswordSuccess("");
		startTransition(async () => {
			try {
				let response = await AXIOS.post("/api/user/forgotpassword", {
					email: data.email,
				});

				console.log("password_response", response);

				// if (response.status !== 200) {
				// 	setPasswordError(response.message);
				// 	return;
				// }

				setPasswordSuccess(response?.data?.message);

				// setTimeout(() => {
				// 	router.push(`/resetpassword?email=${data.email}`);
				// }, 1500);
			} catch (error: any) {
				console.error("�� Error while sending OTP ---", error);
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
						<CardTitle className="text-2xl">Forgot Password</CardTitle>
						<CardDescription>
							Enter your email to receive a password reset link.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="m@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isPending ? (
							<Button disabled className="w-full mt-4">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Sending reset link...
							</Button>
						) : (
							<Button type="submit" className="w-full mt-4">
								Send reset link
							</Button>
						)}

						{/* {passwordSuccess && (
							<Button disabled className="w-full mt-4">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Redirecting...
							</Button>
						)} */}
					</CardContent>
				</Card>
			</form>
		</Form>
	);
};

export default ForgotPassword;
