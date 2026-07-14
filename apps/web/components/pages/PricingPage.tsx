import { Button } from "@cap/ui";
import { Check, Github } from "lucide-react";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

const included = [
	"Local screen, camera, microphone, and system-audio recording",
	"Non-destructive studio editing and automatic zoom controls",
	"MP4 and GIF export without a forced watermark",
	"Optional sharing server and S3-compatible storage",
	"Docker-based self-hosting foundation",
];

export const PricingPage = () => (
	<div className="wrapper wrapper-sm py-32 md:py-40">
		<div className="mx-auto max-w-3xl text-center">
			<p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-9">
				Open source
			</p>
			<h1 className="mt-4 text-4xl font-medium tracking-tight text-gray-12 md:text-5xl">
				FlowReco has no subscription gate
			</h1>
			<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-10">
				The application is available under its repository licenses. Run it
				locally, inspect the source, or host the web service on infrastructure
				you control. Infrastructure and third-party provider costs remain yours.
			</p>
		</div>

		<div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-4 bg-gray-2 p-7 md:p-9">
			<h2 className="text-xl font-semibold text-gray-12">
				Included in FlowReco
			</h2>
			<ul className="mt-6 space-y-4">
				{included.map((item) => (
					<li key={item} className="flex gap-3 text-sm leading-6 text-gray-11">
						<Check className="mt-1 size-4 shrink-0 text-primary-9" />
						{item}
					</li>
				))}
			</ul>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Button href="/download" variant="primary" size="lg">
					Download FlowReco
				</Button>
				<Button
					href={FLOWRECO_SOURCE_REPOSITORY}
					variant="white"
					size="lg"
					icon={<Github className="size-4" />}
				>
					View source
				</Button>
			</div>
		</div>
	</div>
);
