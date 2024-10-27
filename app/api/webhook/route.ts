import { connectToDatabase } from "@/lib/database";
import stripe from "@/lib/stripe";
import User from "@/models/user.model";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
	// const headersList = headers();
	const headersList2 = request.headers;

	// console.log("headersList_____", headersList);
	console.log("headersList2_____", headersList2);

	const body = await request.text(); // important: must be request.text(), not request.json()

	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Missing Stripe signature header" },
			{ status: 400 }
		);
	}

	if (!process.env.STRIPE_WEBHOOK_SECRET) {
		console.log("STRIPE_WEBHOOK_SECRET is not set.");
		return NextResponse.json(
			{ error: "STRIPE_WEBHOOK_SECRET is not set." },
			{ status: 400 }
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (error: any) {
		console.log("Webhook error---", error);
		return NextResponse.json(
			{ error: `Webhook error -- ${error}` },
			{ status: 400 }
		);
	}

	const getUserDetails = async (customerId: string) => {
		await connectToDatabase();

		const userData = await User.findOne({
			stripeCustomerId: customerId,
		});

		return userData;
	};

	switch (event.type) {
		case "checkout.session.completed":
		case "payment_intent.succeeded": {
			const invoice = event.data.object;
			const customerId = invoice.customer as string;

			const userDetails = await getUserDetails(customerId);
			if (!userDetails._id) {
				return NextResponse.json({ error: `User not found` }, { status: 400 });
			}

			//update the user's subscription status
			await User.findByIdAndUpdate(userDetails._id, {
				$set: { activeMembership: true },
			});

			break;
		}
		case "customer.subscription.deleted":
		case "subscription_schedule.canceled": {
			const subscription = event.data.object;
			const customerId = subscription.customer as string;

			const userDetails = await getUserDetails(customerId);
			if (!userDetails._id) {
				return NextResponse.json({ error: `User not found` }, { status: 400 });
			}

			//update the user's subscription status
			await User.findByIdAndUpdate(userDetails._id, {
				$set: { activeMembership: false },
			});

			break;
		}

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return NextResponse.json({ message: `Webhook received` }, { status: 200 });
}
