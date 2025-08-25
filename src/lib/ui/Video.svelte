<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { ContestUtil } from '../contest-util';

	export let ref: FileReferenceJSON[] | undefined;
	export let type: string;

	const util = new ContestUtil();
	
	let videoHref : string | undefined;
	if (ref && ref.length > 0) {
		videoHref = ref[0].href;
	}
	if (!videoHref) {
		videoHref = "http://localhost:9999/test";
	}
</script>

{#if videoHref}
  <!-- svelte-ignore a11y_media_has_caption -->
  <video class="w-full h-full bg-black-800" src="{videoHref}">{type}</video>
{/if}