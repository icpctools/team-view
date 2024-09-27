<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import Image from './Image.svelte';

	export let url: string = 'https://localhost:8443/api/contests';
	export let ref: FileReferenceJSON[] | undefined;
</script>

<Image {url} {ref} size={24} />
