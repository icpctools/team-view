<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReferenceJSON[];
		size?: number;
	}

	let { ref, size = 24 }: Props = $props();
</script>

<div class="max-h-{size} max-w-{size} h-{size} w-{size} flex place-content-center">
  <Image {ref} size={size} />
</div>
