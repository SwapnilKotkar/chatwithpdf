import jwt, { JwtPayload } from "jsonwebtoken";

import { cookies } from "next/headers";

export function getUserDataFromToken(): JwtPayload | null {
	try {
		if (!process.env.JWT_SECRET) {
			throw new Error("Missing JWT_SECRET environment variable");
		}

		const cookieStore = cookies();
		const token = cookieStore.get("token")?.value;

		console.log("token_1111***********", token);

		if (!token) {
			throw new Error("Missing token!");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

		return decoded;
	} catch (error) {
		console.error("Error decoding token:", error);
		return null;
	}
}
