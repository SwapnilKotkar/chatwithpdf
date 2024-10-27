import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";

export async function GET(request: Request) {
	try {
		const token = request.headers.get("authorization")?.split(" ")[1];
		if (!token) {
			return NextResponse.json({ error: "No token provided" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};

		console.log("decoded_user*****", decoded);

		const userId = decoded.userId;

		await connectToDatabase();

		const foundUser = await User.findById(userId);

		console.log("user found", foundUser);

		let tokenData = {
			userId: foundUser._id,
			email: foundUser.email,
			isEmailVerified: foundUser.isEmailVerified,
			image: foundUser.image,
			activeMembership: foundUser.activeMembership,
		};

		let response = NextResponse.json(
			{ message: "user found", userData: foundUser },
			{ status: 200 }
		) as NextResponse;

		response = generateTokenAndSetCookie(tokenData, response);
		return response;

		// return NextResponse.json(
		// 	{ message: "files found", userData },
		// 	{ status: 200 }
		// );
	} catch (error: any) {
		console.log("error in /api/user", error);

		return NextResponse.json(
			{ error: "Something went wrong in /api/user" },
			{ status: 500 }
		);
	}
}
