import { connectToDatabase } from "@/lib/database";
import Files from "@/models/files.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
	let body = await request.json();

	console.log("user_signup_payload_____", body);

	try {
		const token = request.headers.get("authorization")?.split(" ")[1];
		if (!token) {
			return NextResponse.json({ error: "No token provided" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};

		console.log("decoded_upload_file*****", decoded);

		const userId = decoded.userId;

		const { fileId, name, size, type, downloadUrl, ref } = body;

		if (!fileId || !name || !size || !type || !downloadUrl || !ref) {
			return NextResponse.json(
				{ error: "Missing required file information" },
				{ status: 400 }
			);
		}

		await connectToDatabase();

		const file = await Files.create({
			user: userId,
			fileId,
			name,
			size,
			type,
			downloadUrl,
			ref,
		});

		return NextResponse.json(
			{ message: "File metadata saved", file },
			{ status: 200 }
		);
	} catch (error: any) {
		console.log("error in /api/upload_file", error);

		return NextResponse.json(
			{ error: "Something went wrong in /api/upload_file" },
			{ status: 500 }
		);
	}
}
