"use server";

import User from "@/models/user.model";
import { getUserDataFromToken } from "../getUser";
import stripe from "../stripe";
import getBaseUrl from "../getBaseUrl";

export async function createStripePortal() {
	const userData = getUserDataFromToken();

	console.log("userData_inside_createStripePortal----", userData);

	if (!userData) {
		throw new Error("User not found!");
	}

	const user = await User.findById(userData.userId);
	const stripeCustomerId = user.stripeCustomerId;

	if (!stripeCustomerId) {
		throw new Error("Stripe customer Id not found");
	}

	console.log("baseurl-----------", `${getBaseUrl()}/dashboard`);

	const session = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: `${getBaseUrl()}/dashboard`,
	});

	return session.url;
}
