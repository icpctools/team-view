<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReferenceJSON[];
		size?: 16 | 24 | 32 | 64;
	}

	let { ref, size = 16 }: Props = $props();
</script>

<div class="max-h-{size} h-{size} flex place-content-center">
  <Image {ref} {size} />
</div>
