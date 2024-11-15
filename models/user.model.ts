import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String },
		image: { type: String },
		providers: {
			type: Object,
			of: String,
			default: {},
		},
		isEmailVerified: { type: Boolean },
		emailVerifyResetToken: { type: String },
		emailVerifyResetExpires: { type: String },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: String },
		otp: { type: String },
		otpExpires: { type: Date },
		activeMembership: { type: Boolean, default: false },
		stripeCustomerId: { type: String },
	},
	{
		timestamps: true,
	}
);

const User = models?.User || model("User", UserSchema);

export default User;
