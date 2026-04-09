<script lang="ts">
	import { fetchAndUnzipSubmission, getFileLanguage } from '$lib/source-util';
	import type { SubmissionData } from '$lib/submissionData';
	import { JudgementUI, ProblemUI } from '@icpctools/contest-ui';
	import CodeEditor from './CodeEditor.svelte';
	import Modal from './Modal.svelte';
	import { timeToMin } from '@icpctools/contest-api';

	let modal = $state<Modal>();

	let sourceMap = $state<Map<string, string>>();
	let sourceFiles = $state<string[]>([]);
	let sourceCode = $state<string>('');
	let language = $state('text');

	let submission = $state<SubmissionData>();

	export function openSource(newSubmission: SubmissionData): void {
		if (!newSubmission.files) {
			return;
		}

		submission = newSubmission;

		sourceFiles = [];
		sourceCode = 'Loading...';

		fetchAndUnzipSubmission(newSubmission.files, newSubmission.auth)
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

		modal?.open();
	}
</script>

<Modal bind:this={modal}>
	{#snippet title()}
		<div class="flex flex-col">
			<div class="flex flex-row text-lg font-semibold pb-2">
				{submission?.team.display_name ?? submission?.team.name}
			</div>
			<div class="flex flex-row gap-x-8 items-center">
				<div class="flex flex-row gap-x-2">
					Problem: <div class="w-10"><ProblemUI problem={submission?.problem} /></div>
				</div>
				<div class="flex flex-row gap-x-2">Time: {timeToMin(submission?.time)} minutes</div>
				<div class="flex flex-row gap-x-2">
					Judgement: <JudgementUI judgement={submission?.judgement} judgementType={submission?.judgementType} />
				</div>
			</div>
		</div>
	{/snippet}
	<div class="flex flex-row w-full h-full bg-black place-content-center">
		<div class="flex flex-col px-2">
			Files:
			{#each sourceFiles as file (file)}
				<button
					class="text-link
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
