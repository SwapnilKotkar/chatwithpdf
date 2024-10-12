import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

// Handle the GET request for Google OAuth
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
		// Get the access token from the authorization code
		const { tokens } = await client.getToken(code);
		client.setCredentials(tokens);

		// Fetch user profile data
		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		// Log user information
		console.log("User Payload:", payload);

		// Send a response with user information
		return NextResponse.json({ user: payload, tokens }, { status: 200 });
	} catch (error: any) {
		console.error("Error during Google login:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
