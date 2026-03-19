<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
		tag?: string;
	}

	let { ref, size = 8, tag }: Props = $props();
</script>

<div class="flex place-content-center" style="width: {size * 4}px; height: {size * 4}px;">
	<Image {ref} {size} {tag} />
</div>
