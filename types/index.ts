export interface User {
	userId: string;
	email: string;
	image?: string;
	isEmailVerified?: string; // If the username is optional, add the question mark
	activeMembership: boolean;
	exp?: number; // If you want to include the expiration time of the token (from JWT)
	iat?: number;
}

export type CreateUserParams = {
	email: string;
	password: string;
};

export type getUserLoginParams = {
	email: string;
	password: string;
};

export type UpdateUserParams = {
	username: string;
	image: string;
	path: string;
};

export type providersLoginParams = {
	email: string;
	username: string;
	providerAccountId: string;
	providerType: string;
	image?: string;
};

export type otpParams = {
	email: string;
	enteredOTP?: string;
};

export type emailVerifyParams = {
	email: string;
	emailToken?: string;
};

export type resetPasswordParams = {
	email: string;
	newPassword: string;
};

export type verifyEmailTemplateParams = {
	email: string;
	verificationLink: string;
};

export type resetPasswordTemplateParams = {
	email: string;
	resetPasswordLink: string;
};

export type otpTemplateParams = {
	email: string;
	otp: string;
};

export type templateThemeParams = {
	backgroundColor: string;
	titleTextColor: string;
	linkColor?: string;
};

export type Message = {
	_id?: string;
	role: "human" | "ai" | "placeholder";
	message: string;
	createdAt: Date;
};

export type userDetails = {
	email: string;
	name: string;
};
