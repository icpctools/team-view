<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row justify-items-stretch w-full h-full">
	<div class="w-full h-full">
		<Video ref={data.team.desktop} type="desktop"/>
	</div>
	<div class="w-full h-full">
		<Video ref={data.team.webcam} type="webcam"/>
	</div>
</div>
