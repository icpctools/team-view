<script lang="ts">
	import Modal from './Modal.svelte';
	import type { FileReference } from '@icpctools/contest-api';
	import { Video } from '@icpctools/contest-ui';

	let modal = $state<Modal>();
	let reaction = $state<FileReference[]>();

	export function openReaction(reaction2: FileReference[] | undefined, title: string) {
		if (!reaction2) return;

		reaction = reaction2;
		modal?.open(title);
	}
</script>

<Modal bind:this={modal}>
	{#if reaction?.length === 1}
		<div class="flex w-full h-full bg-black place-content-center">
			<Video ref={reaction[0]} type="reaction" />
		</div>
	{:else if reaction?.length === 2}
		<div class="flex w-full h-full bg-black">
			<div class="flex w-1/2 h-full place-content-center">
				<Video ref={reaction[0]} type="reaction" />
			</div>
			<div class="flex w-1/2 h-full place-content-center">
				<Video ref={reaction[1]} type="reaction" />
			</div>
		</div>
	{/if}
</Modal>
