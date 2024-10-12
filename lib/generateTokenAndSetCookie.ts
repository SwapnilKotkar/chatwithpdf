import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (
	user: any,
	response: NextResponse
) => {
	console.log("generating token......");

	const token = jwt.sign(user, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});

	// const response = NextResponse.json(
	// 	{ message: "Token created and cookie set" },
	// 	{ status: 200 }
	// );

	// Set the cookie with NextResponse
	response.cookies.set("token", token, {
		httpOnly: false,
		// secure: process.env.NODE_ENV === "production",
		secure: false,
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
		path: "/",
	});

	console.log("generateTokenAndSetCookie_response", response);

	console.log(
		"Set-Cookie Header:----------",
		response.headers.get("set-cookie")
	);

	return response;
};
