<script lang="ts">
	import type { TeamJSON } from '$lib/contest-types';
	
	export let data: {
		team: TeamJSON;
	};
</script>

<div class="w-full h-full bg-green-700 p-2">
	<!-- svelte-ignore a11y_media_has_caption -->
	<video class="w-full h-full bg-black-800" src="http://localhost:9999/test">Webcam</video>
</div>