<script lang="ts">
	import type { FileReferenceJSON } from "$lib/contest-types";
	import Image from "./Image.svelte";
	
	export let url:string= 'https://localhost:8443/api/contests';
	export let ref:FileReferenceJSON[] | undefined;
	export let size: 8 | 32 = 8;
</script>

<Image url={url} ref={ref} size={size}/>