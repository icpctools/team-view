<script lang="ts">
	import { Clock, Image, Logo } from '@icpctools/contest-ui';
	import DarkModeToggle from '$lib/ui/DarkModeToggle.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import type { ContestEvent } from '@icpctools/contest-api';
	import ICPCtools from '$lib/ui/ICPCtools.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data, children } = $props();

	onMount(() => {
		const eventSource = new EventSource('/api/events');

		// debounce invalidations to avoid blocking the UI
		let invalidateTimer: ReturnType<typeof setTimeout> | null = null;
		const pendingInvalidations = new SvelteSet<string>();

		function scheduleInvalidate(key: string) {
			pendingInvalidations.add(key);

			if (invalidateTimer) {
				clearTimeout(invalidateTimer);
			}

			invalidateTimer = setTimeout(() => {
				for (const k of pendingInvalidations) {
					invalidate(k);
				}
				pendingInvalidations.clear();
				invalidateTimer = null;
			}, 100);
		}

		eventSource.onmessage = (event) => {
			try {
				const change: ContestEvent = JSON.parse(event.data);

				if (change.type === 'connected') {
					console.log('SSE connected');
					return;
				}

				// invalidate any page containing the specific object or all objects of that type
				if (change.id) {
					scheduleInvalidate('app:' + change.type + '/' + change.id);
				}
				scheduleInvalidate('app:' + change.type);
			} catch (error) {
				console.error('Error processing SSE event:', error);
			}
		};

		eventSource.onerror = (error) => {
			console.error('SSE connection error:', error);
			eventSource.close();
		};

		return () => {
			if (invalidateTimer) {
				clearTimeout(invalidateTimer);
			}
			eventSource.close();
		};
	});
</script>

<ModeWatcher />

<div class="flex flex-col w-screen h-screen max-w-screen max-h-screen bg-white dark:bg-gray-900">
	<div class="flex flex-row gap-8 bg-gray-800 dark:bg-gray-950 text-white p-4 items-center">
		{#if data.logo && data.logo.length > 0}
			<div class="w-12">
				<Logo ref={data.logo} size={12} />
			</div>
		{/if}

		<div class="text-2xl w-full">{data.name}</div>

		<div class="w-48"><Clock contest={data.contest} /></div>

		<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
			<a href="/" class="flex flex-row items-center"><i class="fa-solid fa-people-group pr-2"></i>Teams</a>
		</div>

		{#if data.map}
			<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
				<a href="/map" class="flex flex-row items-center"><i class="fa-regular fa-map pr-2"></i>Map</a>
			</div>
		{/if}

		<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
			<a href="/clarifications" class="flex flex-row items-center"
				><i class="fa-solid fa-clipboard-question pr-2"></i>Clarifications</a>
		</div>

		<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
			<a href="/scoreboard" class="flex flex-row items-center"
				><i class="fa-solid fa-square-poll-horizontal pr-2"></i>Scoreboard</a>
		</div>

		<DarkModeToggle />
	</div>

	<div class="gap-2 w-full grow overflow-hidden bg-white dark:bg-gray-900">
		{@render children()}
	</div>

	{#if data.banner && data.banner.length > 0}
		<div class="flex flex-row w-full items-center">
			<div class="flex justify-center p-2 max-h-16 h-16 grow">
				<Image ref={data.banner} size={16} />
			</div>
			<div class="flex h-16 justify-end p-2">
				<ICPCtools />
			</div>
		</div>
	{/if}
</div>
