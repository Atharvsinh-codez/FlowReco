import RecoMark from "~/assets/reco-mark.svg";

export function AbsoluteInsetLoader() {
	return (
		<div class="w-full h-full flex items-center justify-center">
			<div class="animate-spin">
				<img src={RecoMark} alt="" class="size-16" />
			</div>
		</div>
	);
}
