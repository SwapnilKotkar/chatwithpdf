"use client";

import React, { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { AXIOS } from "@/axios";
import Cookies from "js-cookie";

const VerifyEmail = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	const [isPending, startTransition] = useTransition();
	const [emailError, setemailError] = useState("");
	const [emailSuccess, setEmailSuccess] = useState("");

	async function onSubmit() {
		setemailError("");
		setEmailSuccess("");

		startTransition(async () => {
			if (!email || !token) {
				setemailError("Something went wrong. Please go back and signup again.");
				return;
			}
			try {
				let response = await AXIOS.post("/api/user/verifyemail", {
					email: email,
					emailToken: token,
				});

				console.log("verify_otp_res", response);

				const tokenData = Cookies.get("token");
				console.log("Token from cookie:", tokenData);

				if (!tokenData) {
					setEmailSuccess(response?.data?.message);
				}

				setTimeout(() => {
					router.push("/signin");
				}, 1500);
			} catch (error: any) {
				console.error("�� Error while verifying email---", error.response);
				setemailError(error?.response?.data?.error);
			}
		});
	}

	return (
		<div className="z-10 space-y-3 min-w-[400px] max-w-[500px] mx-auto">
			{emailError && (
				<Alert variant="destructive" className="bg-background">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<AlertTitle>Verify error</AlertTitle>
					<AlertDescription>{emailError}</AlertDescription>
				</Alert>
			)}
			{emailSuccess && (
				<Alert variant="default" className="border-green-500 bg-background">
					<Check className="h-4 w-4" color="green" />
					<AlertTitle className="text-green-500 font-medium">
						Success
					</AlertTitle>
					<AlertDescription className="text-green-500">
						{emailSuccess}
					</AlertDescription>
				</Alert>
			)}
			<Card className="w-full">
				<CardContent>
					{!emailSuccess && isPending ? (
						<Button disabled className="w-full mt-4">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							Verifying email...
						</Button>
					) : !emailSuccess ? (
						<Button type="submit" onClick={onSubmit} className="w-full mt-4">
							Verify email
						</Button>
					) : (
						""
					)}
					{emailSuccess && (
						<Button disabled className="w-full mt-4">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							Redirecting to signin page...
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default VerifyEmail;
