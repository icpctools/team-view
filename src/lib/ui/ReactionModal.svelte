<script lang="ts">
	import type { SubmissionData } from '$lib/submissionData';
	import { timeToMin } from '@icpctools/contest-api';
	import Modal from './Modal.svelte';
	import { JudgementUI, ProblemUI, Video } from '@icpctools/contest-ui';

	let modal = $state<Modal>();

	let submission = $state<SubmissionData>();

	export function openReaction(newSubmission: SubmissionData) {
		if (!newSubmission.reaction) {
			return;
		}

		submission = newSubmission;
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
	{#if submission?.reaction?.length === 1}
		<div class="flex w-full h-full bg-black place-content-center">
			<Video ref={submission?.reaction[0]} type="reaction" />
		</div>
	{:else if submission?.reaction?.length === 2}
		<div class="flex w-full h-full bg-black">
			<div class="flex w-1/2 h-full place-content-center">
				<Video ref={submission?.reaction[0]} type="reaction" />
			</div>
			<div class="flex w-1/2 h-full place-content-center">
				<Video ref={submission?.reaction[1]} type="reaction" />
			</div>
		</div>
	{/if}
</Modal>
