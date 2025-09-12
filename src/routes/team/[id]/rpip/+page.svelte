<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row relative">
	<div class="w-full h-full">
		<Video ref={data.team.webcam} type="webcam" />

		<div class="w-84 h-56 absolute top-8 right-0">
			<Video ref={data.team.desktop} type="desktop" />
		</div>
	</div>
</div>
