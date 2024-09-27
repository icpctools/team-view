<script lang="ts">
	import type { FileReferenceJSON } from "$lib/contest-types";
	import Image from "./Image.svelte";
	
	export let url:string= 'https://localhost:8443/api/contests';
	export let ref:FileReferenceJSON[] | undefined;
	export let size: 32 | 64 = 32;
</script>

<Image url={url} ref={ref} size={size}/>