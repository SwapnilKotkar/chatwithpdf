"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useSession } from "@/hooks/SessionProvider";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { userDetails } from "@/types";
import getStripe from "@/lib/stripe-js";
import { createCheckoutSession } from "@/lib/actions/createCheckoutSession";
import { createStripePortal } from "@/lib/actions/createStripePortal";

const PricingPage = () => {
	const { user } = useSession();
	console.log("user_PricingPage", user);

	const router = useRouter();
	const { hasActiveMembership, loading } = useSubscription();
	const [isPending, startTransition] = useTransition();

	const handleUpgrade = () => {
		const userDetails: userDetails = {
			email: user?.email!,
			name: user?.email.split("@")[0]!,
		};

		startTransition(async () => {
			//load stripe
			const stripe = await getStripe();

			if (hasActiveMembership) {
				//create stripe portal...

				const stripePortalUrl = await createStripePortal();
				return router.push(stripePortalUrl);
			}

			const sessionId = await createCheckoutSession(userDetails);

			await stripe?.redirectToCheckout({ sessionId });
		});
	};

	return (
		<div>
			<div className="py-24 sm:py-32">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-base font-medium leading-7 text-primary">
						Pricing
					</h2>
					<p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						Supercharge your Document Companion
					</p>
				</div>

				<p className="mx-auto mt-6 max-w-2xl px10 text-center text-lg leading-6 text-muted-foreground">
					Choose an affordable plan thats packed with the best features for
					interacting eith your PDFs, enhamcing productivity and streamlining
					your workflow.
				</p>

				<div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8">
					<div className="ring-1 ring-muted-foreground/20 p-8 h-fit pb-12 rounded-3xl ">
						<h3 className="text-lg font-medium leading-8 text-foreground">
							Starter Plan
						</h3>
						<p className="mt-4 text-sm leading-6 text-muted-foreground">
							Explore Core Features at No Cost
						</p>
						<p className="mt-6 flex items-baseline gap-x-1">
							<span className="text-4xl font-bold tracking-tight text-foreground">
								Free
							</span>
						</p>

						<ul
							role="list"
							className="mt-8 space-y-3 text-sm leading-6 text-foreground"
						>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Documents
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Up to 3 messages per document
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Try out the AI Chat Functionality
							</li>
						</ul>
					</div>

					<div className="ring-2 ring-primary rounded-3xl p-8">
						<h3 className="text-lg font-medium leading-8 text-primary">
							Pro Plan
						</h3>
						<p className="mt-4 text-sm leading-6 text-muted-foreground">
							Maximize Productivity with PRO Features
						</p>
						<p className="mt-6 flex items-baseline gap-x-1">
							<span className="text-4xl font-bold tracking-tight text-foreground">
								$5.99
							</span>
							<span className="text-sm font-medium leading-6 text-muted-foreground">
								/ month
							</span>
						</p>

						<Button
							className="bg-primary w-full text-background shadow-sm hover:text-primary hover:bg-background hover:border hover:border-primary mt-6 block rounded-md text-center text-sm font-medium leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							disabled={loading || isPending}
							onClick={handleUpgrade}
						>
							{isPending || loading
								? "loading..."
								: hasActiveMembership
								? "Manage Plan"
								: "Upgrade to pro"}
						</Button>

						<ul
							role="list"
							className="mt-8 space-y-3 text-sm leading-6 text-foreground"
						>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Store upto 20 Documents
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Ability to Delete Documents
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Up to 100 messages per document
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Full Power AI Chat Functionality with Memory Recall
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								Advanced analytics
							</li>
							<li className="flex gap-x-3">
								<CheckIcon className="h-6 w-5 flex-none text-primary" />
								24-hour support response time
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PricingPage;
