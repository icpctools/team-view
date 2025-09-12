<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="w-full h-full">
	<Video ref={data.team.desktop} type="desktop" />
</div>
