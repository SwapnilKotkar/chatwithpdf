import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import {
	createUser,
	hashPassword,
	isUserProviderLoggedIn,
} from "@/lib/actions/user.actions";
import User from "@/models/user.model";
import { createEmailVerificationToken } from "@/lib/mailer";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";

export async function POST(request: Request, response: Response) {
	let body = await request.json();

	console.log("user_signup_payload_____", body);

	try {
		await connectToDatabase();

		const isUserExists = await User.findOne({ email: body.email });

		if (isUserExists) {
			let response = await isUserProviderLoggedIn(isUserExists);

			if (!response.success) {
				return NextResponse.json(
					{
						error: response.error,
					},
					{ status: 409 }
				);
			}
		}

		let foundUser = await User.findOne({
			email: body.email,
			password: await hashPassword(body.password),
		});

		if (!foundUser) {
			return NextResponse.json(
				{
					error: "Invalid credentials.",
				},
				{ status: 409 }
			);
		}

		console.log("foundUser---", foundUser);

		if (!foundUser.isEmailVerified) {
			let response = await createEmailVerificationToken(foundUser.email);

			if (response.success) {
				return NextResponse.json(
					{
						message:
							"Email address is not verified. Email verification link sent your email address, please check your inbox.",
					},
					{ status: 200 }
				);
			} else {
				return NextResponse.json({ error: response.error }, { status: 500 });
			}
		}

		let tokenData = {
			userId: foundUser._id,
			email: foundUser.email,
			isEmailVerified: foundUser.isEmailVerified,
		};

		// let response = generateTokenAndSetCookie(tokenData);

		let response = NextResponse.json(
			{ message: "Login successful" },
			{ status: 200 }
		) as NextResponse;
		response = generateTokenAndSetCookie(tokenData, response);
		return response;

		console.log("signin_response", response);

		// return NextResponse.json({ message: "User found" }, { status: 200 });
		return response;
	} catch (error: any) {
		console.log("error in /api/signin", error);

		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
