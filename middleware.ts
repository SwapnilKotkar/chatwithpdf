// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(request: NextRequest) {
// 	const url = request.nextUrl;
// 	const publicRoutes = [
// 		"/signin",
// 		"/signup",
// 		"/forgotpassword",
// 		"/resetpassword",
// 		"/verifyemail",
// 	];

// 	const emailParam = url.searchParams.get("email");
// 	const emailToken = url.searchParams.get("token");
// 	const resetPasswordToken = url.searchParams.get("resetpasswordtoken");

// 	// Get the token from the request cookies
// 	const token = request.cookies.get("token")?.value;

// 	console.log("token---", token);

// 	if (!token && publicRoutes.includes(url.pathname)) {
// 		if (
// 			url.pathname === "/verifyemail" &&
// 			(!emailParam || emailParam.trim() === "") &&
// 			(!emailToken || emailToken.trim() === "")
// 		) {
// 			return NextResponse.redirect(new URL(`/signin`, request.url)); // Redirect to signin if email is missing or empty
// 		} else if (
// 			url.pathname === "/resetpassword" &&
// 			(!emailParam || emailParam.trim() === "") &&
// 			(!resetPasswordToken || resetPasswordToken.trim() === "")
// 		) {
// 			return NextResponse.redirect(new URL(`/signin`, request.url)); // Redirect to signin if email is missing or empty
// 		}

// 		return NextResponse.next();
// 	} else if (!token && !publicRoutes.includes(url.pathname)) {
// 		return NextResponse.redirect(new URL(`/signin`, request.url));
// 	} else if (token && publicRoutes.includes(url.pathname)) {
// 		return NextResponse.redirect(new URL(`/`, request.url));
// 	}

// 	return NextResponse.next();
// }

// export const config = {
// 	matcher: [
// 		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
// 	],
// };

//----------------------☝️☝️☝️☝️ ABOVE code is totally working ✅✅✅✅-------------------------//

//----------------------👇👇👇👇 BELOW code just organized for all IF conditions-----------------------//

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl;
	const publicRoutes = [
		"/signin",
		"/signup",
		"/forgotpassword",
		"/resetpassword",
		"/verifyemail",
	];

	const emailParam = url.searchParams.get("email");
	const emailToken = url.searchParams.get("token");
	const resetPasswordToken = url.searchParams.get("resetpasswordtoken");

	// Get the token from the request cookies
	const token = request.cookies.get("token")?.value || "";

	// Got edge runtime erorr on below IF condition
	// if (token) {
	// 	try {
	// 		let decodedToken = jwt.verify(
	// 			token,
	// 			process.env.JWT_SECRET!
	// 		) as JwtPayload;

	// 		console.log("decodedToken111---", decodedToken);
	// 		if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
	// 			return NextResponse.redirect(new URL("/signin", request.nextUrl));
	// 		}
	// 	} catch (error: any) {
	// 		console.log("Middleware_token error************", error);
	// 		return NextResponse.redirect(new URL("/signin", request.nextUrl));
	// 	}
	// }

	//got error on catch block for invalid token but not redirecting to /signin page
	// if (token) {
	// 	try {
	// 		const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
	// 		const { payload } = await jwtVerify(token, secret);

	// 		console.log("decodedToken111---", payload);
	// 		if (payload.exp && payload.exp * 1000 < Date.now()) {
	// 			return NextResponse.redirect(new URL("/signin", request.nextUrl));
	// 		}
	// 	} catch (error) {
	// 		console.log("Middleware_token error************", error);
	// 		return NextResponse.redirect(new URL("/signin", request.nextUrl));
	// 	}
	// }

	// If no token and trying to access a protected route
	if (!token && !publicRoutes.includes(url.pathname)) {
		return NextResponse.redirect(new URL(`/signin`, request.url));
	}

	// If no token and trying to access public routes like verifyemail or resetpassword
	if (!token && publicRoutes.includes(url.pathname)) {
		// Handle /verifyemail route if email/token params are missing
		if (url.pathname === "/verifyemail" && (!emailParam || !emailToken)) {
			return NextResponse.redirect(new URL(`/signin`, request.url));
		}

		// Handle /resetpassword route if email/resetPasswordToken params are missing
		if (
			url.pathname === "/resetpassword" &&
			(!emailParam || !resetPasswordToken)
		) {
			return NextResponse.redirect(new URL(`/signin`, request.url));
		}

		// Allow access to public routes
		return NextResponse.next();
	}

	// If token is present and user tries to access public routes, redirect to home
	if (token && publicRoutes.includes(url.pathname)) {
		return NextResponse.redirect(new URL(`/home`, request.url));
	}

	// Allow access to the protected route
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
