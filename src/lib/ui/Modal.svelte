<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: Snippet;
		children?: Snippet;
	}

	let { title, children }: Props = $props();

	let show = $state(false);
	let modal = $state<HTMLDivElement>();

	export function open(newTitle?: Snippet) {
		if (newTitle) {
			title = newTitle;
		}
		show = true;
	}

	function close() {
		show = false;
	}

	function keydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			close();
			return;
		}
	}

	function mousedown(e: MouseEvent): void {
		// if the user clicked outside the modal, close it
		if (show && e.target instanceof Node && e.target !== modal && !modal?.contains(e.target)) {
			close();
		}
	}
</script>

<svelte:window on:keydown={keydown} on:mousedown={mousedown} />

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<!-- Overlay -->
		<div class="absolute inset-0 bg-black opacity-60"></div>

		<!-- Modal -->
		<div
			bind:this={modal}
			class="relative z-10
					bg-white dark:bg-black
					border border-gray-200 dark:border-gray-400 rounded-t-lg shadow-xl
					w-[90vw] max-w-[90vw]
					max-h-[90vh]
					flex flex-col"
			role="dialog">
			<!-- Header -->
			<div class="flex flex-row items-start px-3 py-2 border-b border-gray-200 dark:border-gray-400">
				<div class="text-black dark:text-white grow">
					{@render title?.()}
				</div>
				<button onclick={close} class="hover:bg-hover p-1 rounded" aria-label="close"
					><i class="fa-solid fa-xmark"></i></button>
			</div>

			<!-- Content -->
			<div class="max-w-full max-h-full inset-0 overflow-hidden">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
