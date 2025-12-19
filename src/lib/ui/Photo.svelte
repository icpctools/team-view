<script lang="ts">
	import type { FileReference } from 'contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
	}

	let { ref, size = 24 }: Props = $props();
</script>

<div class="max-h-{size} max-w-{size} h-{size} w-{size} flex place-content-center">
	<Image {ref} {size} />
</div>
