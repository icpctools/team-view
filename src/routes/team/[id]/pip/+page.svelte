<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="w-full h-full relative">
	<Video ref={data.team.desktop} type="desktop" />

	<div class="w-84 aspect-video absolute top-8 right-0">
		<Video ref={data.team.webcam} type="webcam" />
	</div>
</div>
