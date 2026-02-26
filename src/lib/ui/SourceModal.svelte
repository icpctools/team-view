<script lang="ts">
	import { fetchAndUnzipSubmission, getFileLanguage } from '$lib/source-util';
	import CodeEditor from './CodeEditor.svelte';
	import Modal from './Modal.svelte';
	import type { FileReference } from '@icpctools/contest-api';

	let modal = $state<Modal>();

	let sourceMap = $state<Map<string, string>>();
	let sourceFiles = $state<string[]>([]);
	let sourceCode = $state<string>('');
	let language = $state('text');

	export function openSource(files: FileReference[] | undefined, title: string, auth: string): void {
		if (!files) return;

		sourceFiles = [];
		sourceCode = 'Loading...';

		fetchAndUnzipSubmission(files, auth)
			.then((map) => {
				sourceMap = map;
				if (!sourceMap) {
					sourceFiles = [];
					sourceCode = '';
					return;
				}
				sourceFiles = [...sourceMap.keys()];
				if (sourceFiles.length > 0) {
					sourceCode = sourceMap.get(sourceFiles[0]) ?? 'Not found';
					language = getFileLanguage(sourceFiles[0]);
				}
			})
			.catch((err: unknown) => {
				sourceFiles = [];
				if (err instanceof TypeError) {
					sourceCode = err.message;
				} else {
					sourceCode = 'Error: ' + err;
				}
			});

		modal?.open(title);
	}
</script>

<Modal bind:this={modal}>
	<div class="flex flex-row w-full h-full bg-black place-content-center">
		<div class="flex flex-col px-2">
			Files:
			{#each sourceFiles as file (file)}
				<button
					class="
		text-blue-600
		dark:text-blue-400
		hover:bg-hover
		p-0.5 rounded
		cursor-pointer">
					{file}
				</button>
			{/each}
		</div>
		<div class="flex max-w-full w-full h-full">
			<CodeEditor value={sourceCode} bind:language></CodeEditor>
		</div>
	</div>
</Modal>
