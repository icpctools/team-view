<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<Video ref={data.team.webcam?.[0]} type="webcam" />
