"use client";

import { buildEnv } from "@cap/env";
import { Button } from "@cap/ui";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { Base } from "./Base";

export function CustomDomainPage() {
	const isHostedCap = buildEnv.NEXT_PUBLIC_IS_CAP === "true";
	const router = useRouter();
	const rpc = useRpcClient();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	const customDomainMutation = useEffectMutation({
		mutationFn: (_redirect: boolean) =>
			rpc.UserCompleteOnboardingStep({
				step: "customDomain",
				data: undefined,
			}),
		onSuccess: (_, redirect) => {
			startTransition(() => {
				if (redirect) {
					router.push("/onboarding/invite-team");
					router.refresh();
				}
			});
		},
		onError: () => {
			toast.error("An error occurred, please try again");
		},
	});

	const handleSubmit = async (redirect = true) =>
		await customDomainMutation.mutateAsync(redirect);

	return (
		<Base
			title="Custom Domain"
			description={
				<div>
					<p className="w-full text-base max-w-[340px] text-gray-10">
						{isHostedCap
							? "Hosted accounts can connect a custom domain for shared recordings."
							: "Custom domains are configured by your FlowReco server administrator. You can continue and add one later."}
					</p>
				</div>
			}
			descriptionClassName="max-w-[400px]"
		>
			{isHostedCap && (
				<>
					<Button
						onClick={() => setShowUpgradeModal(true)}
						className="w-full"
						disabled={customDomainMutation.isPending}
						variant="blue"
					>
						View Hosted Plans
					</Button>
					<div className="w-full h-px bg-gray-4" />
				</>
			)}
			<Button
				type="button"
				variant="dark"
				spinner={customDomainMutation.isPending}
				disabled={customDomainMutation.isPending}
				className="mx-auto w-full"
				onClick={() => handleSubmit()}
			>
				{isHostedCap ? "Skip" : "Continue"}
			</Button>
			{isHostedCap && (
				<UpgradeModal
					onCheckout={async () => {
						await handleSubmit();
					}}
					onboarding={true}
					open={showUpgradeModal}
					onOpenChange={setShowUpgradeModal}
				/>
			)}
		</Base>
	);
}
