import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mailer";
import User from "@/models/user.model";
import { hashPassword } from "@/lib/actions/user.actions";

export async function POST(request: Request) {
	const body = await request.json();

	console.log("password_reset_payload_____", body);

	try {
		await connectToDatabase();

		await connectToDatabase();
		const existingUser = await User.findOne({ email: body.email });

		if (!existingUser) {
			return NextResponse.json(
				{
					Error: "Failed. Email address doesn't exists.",
				},
				{ status: 404 }
			);
		}

		if (
			!existingUser ||
			!existingUser.passwordResetToken ||
			Date.now() > existingUser.passwordResetExpires
		) {
			return NextResponse.json(
				{
					error: "Token is invalid or expired",
				},
				{ status: 404 }
			);
		}

		const hashedPassword = await hashPassword(body.password);

		await User.findOneAndUpdate(
			{ email: body.email },
			{
				$set: {
					password: hashedPassword,
				},
				$unset: { passwordResetToken: 1, passwordResetExpires: 1 },
			}
		);

		return NextResponse.json(
			{
				message: "New password updated successfully",
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log("❌ Error while updating new password---", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
