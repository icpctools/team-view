<script lang="ts">
	import type { PersonJSON } from '$lib/contest-types';
	import Image from './Image.svelte';

	export let person: PersonJSON;
</script>

<div class="flex flex-col items-center border-[1px] bg-gray-200 gap-2">
	<div class="flex flex-col w-32 h-44 place-content-center">
		{#if person.photo && person.photo.length > 0}
			<Image ref={person.photo} size={24} />
		{:else}
			<span class="self-center">(unavailable)</span>
		{/if}
	</div>
	<div>{person.name}</div>
</div>
