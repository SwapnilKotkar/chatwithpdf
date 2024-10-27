import { connectToDatabase } from "@/lib/database";
import Files from "@/models/files.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
	// let body = await request.json();

	// console.log("user_files_payload_____", body);

	try {
		const token = request.headers.get("authorization")?.split(" ")[1];
		if (!token) {
			return NextResponse.json({ error: "No token provided" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};

		console.log("decoded_files*****", decoded);

		const userId = decoded.userId;

		await connectToDatabase();

		const files = await Files.find({ user: userId });

		console.log("files found", files);

		return NextResponse.json(
			{ message: "files found", files },
			{ status: 200 }
		);
	} catch (error: any) {
		console.log("error in /api/files", error);

		return NextResponse.json(
			{ error: "Something went wrong in /api/files" },
			{ status: 500 }
		);
	}
}
