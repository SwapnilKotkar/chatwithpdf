import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { createUser, isUserProviderLoggedIn } from "@/lib/actions/user.actions";
import { createEmailVerificationToken } from "@/lib/mailer";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";

export async function POST(request: Request) {
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

		if (isUserExists && !isUserExists.isEmailVerified) {
			let response = await createEmailVerificationToken(body.email);

			if (response.success) {
				return NextResponse.json(
					{
						message:
							"User already registered. Email verification link sent your email address, please check your inbox.",
					},
					{ status: 200 }
				);
			} else {
				return NextResponse.json(
					{ success: false, error: response.error },
					{
						status: 500,
					}
				);
			}
		} else if (isUserExists && isUserExists.isEmailVerified) {
			return NextResponse.json(
				{
					error:
						"User already exists. Please try to signin or create a new account with new email address.",
				},
				{ status: 409 }
			);
		}

		const newUserData = await createUser({
			email: body.email,
			password: body.password,
		});

		console.log("newUserData_data", newUserData);

		let response = await createEmailVerificationToken(body.email);

		if (response.success) {
			return NextResponse.json(
				{
					message:
						"User created successfully. Email verification link sent your email address, please check your inbox.",
				},
				{ status: 201 }
			);
		} else {
			return NextResponse.json({ error: response.error }, { status: 500 });
		}
	} catch (error: any) {
		console.log("error in /api/signup", error);

		console.log("1111111111", error.errorResponse);

		if (
			error.errorResponse.code === 11000 &&
			error.errorResponse.keyPattern &&
			error.errorResponse.keyPattern.email
		) {
			return NextResponse.json(
				{
					error:
						"Email already exists. Please login or create account with different email id.",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
