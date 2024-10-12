// export const runtime = "nodejs";

import { otpParams } from "@/types";
import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "./email_templates/verifyEmailTemplate";
import User from "@/models/user.model";
import CryptoJS from "crypto-js";
import { resetPasswordTemplate } from "./email_templates/newPasswordTemplate";

export const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// export const sendPasswordResetEmail = async (
// 	email: string,
// 	resetToken: string
// ) => {
// 	const resetUrl = `https://your-domain.com/reset-password?token=${resetToken}`;
// 	const mailOptions = {
// 		from: process.env.EMAIL_USER,
// 		to: email,
// 		subject: "Password Reset Request",
// 		text: `You requested a password reset. Please visit the following link to reset your password: ${resetUrl}`,
// 	};

// 	return transporter.sendMail(mailOptions);
// };

export const sendOTPEmail = async ({ email, enteredOTP }: otpParams) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Nextjs  Auth.js OTP verification",
		text: `You requested a password reset. Please use this otp to verify your email ${enteredOTP}`,
	};

	return transporter.sendMail(mailOptions);
};

export async function createEmailVerificationToken(email: string) {
	try {
		// const transporter = nodemailer.createTransport({
		// 	service: process.env.EMAIL_SERVICE,
		// 	auth: {
		// 		user: process.env.EMAIL_USER,
		// 		pass: process.env.EMAIL_PASSWORD,
		// 	},
		// });

		const verifyEmailToken = CryptoJS.lib.WordArray.random(16).toString();
		const hashedVerifyEmailToken = CryptoJS.SHA256(verifyEmailToken).toString(
			CryptoJS.enc.Hex
		);

		await User.findOneAndUpdate(
			{ email: email },
			{
				$set: {
					isEmailVerified: false,
					emailVerifyResetToken: hashedVerifyEmailToken,
					emailVerifyResetExpires: Date.now() + 3600000, // Token expires in 1 hour
				},
			}
		);

		const emailVerifyUrl = `${process.env.BASE_DOMAIN}/verifyemail?email=${email}&token=${verifyEmailToken}`;
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Email Verification Request",
			html: verifyEmailTemplate({
				email: email,
				verificationLink: emailVerifyUrl,
				backgroundColor: "#000000",
				titleTextColor: "#fff",
				linkColor: "#3b82f6",
			}),
			text: `You requested a email verification. Please visit the following link to verify your email: ${emailVerifyUrl}`,
		};

		await transporter.sendMail(mailOptions);

		return { success: true };
	} catch (error: any) {
		console.log("�� Error while creating email verification token ---", error);

		return { success: false, error: error.message };
	}
}

export async function sendPasswordResetEmail(email: string) {
	try {
		const resetToken = CryptoJS.lib.WordArray.random(16).toString();
		const hashedToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex);

		await User.findOneAndUpdate(
			{ email: email },
			{
				$set: {
					passwordResetToken: hashedToken,
					passwordResetExpires: Date.now() + 10 * 60 * 1000, // Token expires in 10 minutes
				},
			}
		);

		const emailVerifyUrl = `${process.env.BASE_DOMAIN}/resetpassword?email=${email}&resetpasswordtoken=${resetToken}`;
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Email Verification Request",
			html: resetPasswordTemplate({
				email: email,
				resetPasswordLink: emailVerifyUrl,
				backgroundColor: "#000000",
				titleTextColor: "#fff",
				linkColor: "#3b82f6",
			}),
			text: `You requested a email verification. Please visit the following link to verify your email: ${emailVerifyUrl}`,
		};

		await transporter.sendMail(mailOptions);
		return { success: true };
	} catch (error: any) {
		console.log("Error while creating reset password token ---", error);

		return { success: false, error: error.message };
	}
}
