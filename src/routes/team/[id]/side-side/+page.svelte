<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row justify-items-stretch w-full h-full">
	<Video ref={data.team.desktop?.[0]} type="desktop" />
	<Video ref={data.team.webcam?.[0]} type="webcam" />
</div>
