import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export const updateTokenData = async (newData: any) => {
	// Step 1: Get the existing token
	const token = Cookies.get("token");
	if (!token) {
		console.log("No token found");
		return NextResponse.json(
			{ error: "No token found" },
			{ status: 401 } // Unauthorized
		);
	}

	// Step 2: Decode the existing token
	let decodedData;
	try {
		decodedData = jwt.decode(token); // Just decode without verifying
		if (decodedData === null) {
			console.error("Decoded data is null");
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 } // Unauthorized
			);
		}
	} catch (error) {
		console.error("Error decoding token:", error);
		return NextResponse.json(
			{ error: "Failed to decode token" },
			{ status: 500 } // Internal Server Error
		);
	}

	// Type guard to check if decodedData is an object
	if (typeof decodedData !== "object" || Array.isArray(decodedData)) {
		console.error("Decoded data is not a valid object");
		return NextResponse.json(
			{ error: "Invalid token data" },
			{ status: 400 } // Bad Request
		);
	}

	console.log("Current Token Data:", decodedData);

	// Step 3: Update the token data
	const updatedData = {
		...decodedData,
		...newData, // Merge new data with existing data
	};

	// Step 4: Generate a new token
	const newToken = jwt.sign(updatedData, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});

	// Step 5: Create a response with the new token
	const response = NextResponse.json(
		{ message: "Token updated and cookie set" },
		{ status: 200 }
	);

	// Step 6: Set the new token in the cookie
	response.cookies.set("token", newToken, {
		httpOnly: false, // or true, based on your requirements
		secure: false, // use true in production
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
		path: "/",
	});

	console.log("updateTokenData_response", response);

	return response;
};
