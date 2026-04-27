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
	import ICPC from '$lib/ui/ICPC.svelte';

	let { data, children } = $props();

	onMount(() => {
		let eventSource: EventSource | undefined = undefined;

		// reconnection settings
		let reconnectTimer: ReturnType<typeof setTimeout>;
		let reconnectDelay = 1000; // start with 1 second
		const maxReconnectDelay = 30000; // max 30 seconds
		let isCleaningUp = false;

		// debounce invalidations with longer delay to avoid overwhelming the system
		let invalidateTimer: ReturnType<typeof setTimeout> | undefined;
		const pendingInvalidations = new SvelteSet<string>();

		function scheduleInvalidate(key: string) {
			// Limit queue size to prevent memory issues
			if (pendingInvalidations.size > 100) {
				console.warn(`Invalidation queue full, dropping: ${key}`);
				return;
			}

			pendingInvalidations.add(key);

			if (invalidateTimer) {
				clearTimeout(invalidateTimer);
			}

			// Longer debounce (500ms instead of 100ms) to batch more events
			invalidateTimer = setTimeout(() => {
				// Process all invalidations at once (SvelteKit handles deduplication)
				for (const k of pendingInvalidations) {
					invalidate(k);
				}
				pendingInvalidations.clear();
				invalidateTimer = undefined;
			}, 500);
		}

		function connect() {
			if (isCleaningUp) return;

			eventSource = new EventSource('/api/events');

			eventSource.onopen = () => {
				console.log('SSE connected');
				reconnectDelay = 1000; // Reset delay on successful connection
			};

			eventSource.onmessage = (event) => {
				try {
					const change: ContestEvent = JSON.parse(event.data);

					if (change.type === 'connected') return;

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
				eventSource?.close();
				eventSource = undefined;

				if (!isCleaningUp) {
					console.log(`Reconnecting in ${reconnectDelay / 1000}s...`);
					reconnectTimer = setTimeout(() => {
						reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
						connect();
					}, reconnectDelay);
				}
			};
		}

		connect();

		return () => {
			isCleaningUp = true;
			if (reconnectTimer) {
				clearTimeout(reconnectTimer);
			}
			if (invalidateTimer) {
				clearTimeout(invalidateTimer);
			}
			eventSource?.close();
		};
	});
</script>

<ModeWatcher />

<div class="flex flex-col w-screen h-screen max-w-screen max-h-screen bg-white dark:bg-gray-900">
	{#if !data.contest}
		<div class="flex flex-col h-full p-8 items-center justify-center">
			<i class="fa-solid fa-triangle-exclamation text-6xl text-red-500 mb-4"></i>
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">No Contest Available</h1>
			<p class="text-xl text-gray-600 dark:text-gray-400">
				Unable to load contest data. Please check your connection and try again.
			</p>
			<div class="h-48 pt-8"><ICPC /></div>
		</div>
	{:else}
		<div class="flex flex-row gap-8 bg-gray-800 dark:bg-gray-950 text-white p-4 items-center">
			{#if data.logo && data.logo.length > 0}
				<div class="w-12">
					<Logo ref={data.logo} size={12} />
				</div>
			{/if}

			<div class="text-2xl w-full">{data.name}</div>

			<div class="w-48"><Clock contest={data.contest} contestState={data.contestState} /></div>

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
	{/if}
</div>
