import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/user.model";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";

const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

// Handling the POST or GET request
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json(
			{ error: "Authorization code not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectToDatabase();

		const { tokens } = await client.getToken(code);
		client.setCredentials(tokens);

		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		console.log("User Info:", payload);

		if (!payload) {
			return NextResponse.json(
				{ error: "Failed to get user info from Google" },
				{ status: 500 }
			);
		}

		const existingUser = await User.findOne({ email: payload.email });
		console.log("existingUser_data", existingUser);

		let updatedUser;

		if (existingUser && existingUser.providers["google"] === payload.sub) {
			updatedUser = await User.findOneAndUpdate(
				{ email: payload.email },
				{
					$set: {
						// email: payload.email,
						image: payload.picture,
						isEmailVerified: true,
					},
				},
				{ new: true }
			);
		} else {
			let existingProviders = existingUser?.providers || {};
			existingProviders = {
				...existingProviders,
				google: payload.sub,
			};

			updatedUser = await User.findOneAndUpdate(
				{ email: payload.email },
				{
					$set: {
						email: payload.email,
						image: payload.picture,
						providers: existingProviders,
						isEmailVerified: true,
					},
				},
				{ upsert: true, new: true }
			);
		}

		console.log("updatedUser*********", updatedUser);

		let tokenData = {
			userId: updatedUser._id,
			email: updatedUser.email,
			isEmailVerified: updatedUser.isEmailVerified,
		};

		let response = NextResponse.redirect(new URL("/home", request.url));

		response = generateTokenAndSetCookie(tokenData, response);

		return response;
	} catch (error: any) {
		console.error("Error exchanging code for tokens:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
