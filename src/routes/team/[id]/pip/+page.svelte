<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="w-full h-full relative">
	<Video ref={data.team.desktop?.[0]} type="desktop" />

	<div class="w-84 aspect-video absolute top-8 right-0">
		<Video ref={data.team.webcam?.[0]} type="webcam" />
	</div>
</div>
