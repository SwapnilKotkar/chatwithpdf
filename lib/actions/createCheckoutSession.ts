"use server";

import { userDetails } from "@/types";
import { getUserDataFromToken } from "../getUser";
import User from "@/models/user.model";
import stripe from "../stripe";
import getBaseUrl from "../getBaseUrl";

export async function createCheckoutSession(userDetails: userDetails) {
	const userData = getUserDataFromToken();

	console.log("userData_inside_createCheckoutSession----", userData);
	console.log("userDetails111", userDetails);

	if (!userData) {
		throw new Error("User not found!");
	}

	let stripeCustomerId;

	const user = await User.findById(userData.userId);
	stripeCustomerId = user.stripeCustomerId;

	if (!stripeCustomerId) {
		//create a new stripe customer

		const customer = await stripe.customers.create({
			email: userDetails.email,
			name: userDetails.name,
			address: {
				line1: "1234 MG Road",
				city: "Bengaluru",
				state: "Karnataka",
				postal_code: "560001",
				country: "IN",
			},
			metadata: {
				userId: userData.userId,
			},
		});

		await User.findByIdAndUpdate(userData.userId, {
			$set: { stripeCustomerId: customer.id },
		});

		stripeCustomerId = customer.id;
	}

	//create a checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price: "price_1QEWEUSDH1kMeqieRLH2EKKb",
				quantity: 1,
			},
		],
		mode: "subscription",
		customer: stripeCustomerId,
		success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
		cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
	});

	return session.id;
}
