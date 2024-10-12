import { NextResponse } from "next/server";
import axios from "axios";
import User from "@/models/user.model";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";
import { connectToDatabase } from "@/lib/database";

// Handle the GET request for GitHub OAuth
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json(
			{ error: "Missing authorization code" },
			{ status: 400 }
		);
	}

	try {
		await connectToDatabase();

		// Exchange the code for an access token
		const tokenResponse = await axios.post(
			`https://github.com/login/oauth/access_token`,
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			},
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		const { access_token } = tokenResponse.data;

		if (!access_token) {
			return NextResponse.json(
				{ error: "Failed to retrieve access token" },
				{ status: 400 }
			);
		}

		// Use the access token to fetch the user's GitHub profile data
		const userResponse = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const userProfile = userResponse.data;

		// Use the access token to fetch the user's email addresses
		const emailResponse = await axios.get(
			"https://api.github.com/user/emails",
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);

		const emails = emailResponse.data;
		// Find the primary verified email
		const primaryEmail = emails.find(
			(email: any) => email.primary && email.verified
		)?.email;

		// If no primary email is found, fallback to the first email in the list
		const userEmail =
			primaryEmail || (emails.length > 0 ? emails[0].email : null);

		if (!userEmail) {
			return NextResponse.json(
				{ error: "Failed to retrieve user email" },
				{ status: 400 }
			);
		}

		// Log user information
		console.log("GitHub User Profile:", userProfile);
		console.log("GitHub User Email:", userEmail);

		if (!userProfile && !userEmail) {
			return NextResponse.json(
				{ error: "Failed to get user info from GitHub" },
				{ status: 500 }
			);
		}

		const existingUser = await User.findOne({ email: userEmail });
		console.log("existingUser_data", existingUser);

		let updatedUser;

		if (existingUser && existingUser.providers["github"] === userProfile.id) {
			updatedUser = await User.findOneAndUpdate(
				{ email: userEmail },
				{
					$set: {
						image: userProfile.avatar_url,
						isEmailVerified: true,
					},
				},
				{ new: true }
			);
		} else {
			let existingProviders = existingUser?.providers || {};
			existingProviders = {
				...existingProviders,
				github: userProfile.id,
			};

			updatedUser = await User.findOneAndUpdate(
				{ email: userEmail },
				{
					$set: {
						email: userEmail,
						image: userProfile.avatar_url,
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
		console.error("Error during GitHub login:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
