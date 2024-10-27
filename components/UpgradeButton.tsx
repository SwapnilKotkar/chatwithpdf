"use client";

import React, { useTransition } from "react";
import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, StarIcon } from "lucide-react";
import { createStripePortal } from "@/lib/actions/createStripePortal";
import { useRouter } from "next/navigation";

const UpgradeButton = () => {
	const router = useRouter();
	const { hasActiveMembership, loading } = useSubscription();
	const [isPending, startTransition] = useTransition();

	const handleAccount = () => {
		startTransition(async () => {
			const stripePortalUrl = await createStripePortal();
			router.push(stripePortalUrl);
		});
	};

	if (!hasActiveMembership && !loading) {
		return (
			<Button asChild variant="default" className="border-primary">
				<Link href={"/dashboard/upgrade"}>
					Upgrade <StarIcon className="ml-3 fill-primary text-white" />
				</Link>
			</Button>
		);
	}

	if (loading) {
		return (
			<Button variant="default" className="border-primary">
				<Loader2Icon className="animate-spin" />
			</Button>
		);
	}

	return (
		<Button
			variant="default"
			onClick={handleAccount}
			disabled={isPending}
			className="border-primary bg-primary"
		>
			{isPending ? (
				<Loader2Icon className="animate-spin" />
			) : (
				<p>
					<span className="font-extrabold">PRO </span>Account
				</p>
			)}
		</Button>
	);
};

export default UpgradeButton;
