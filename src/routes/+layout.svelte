<script lang="ts">
	import { Clock, Image, Logo, ICPC, ICPCtools } from '@icpctools/contest-ui';
	import DarkModeToggle from '#lib/ui/DarkModeToggle.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate, refreshAll } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import type { ContestEvent } from '@icpctools/contest-api';
	import { SvelteSet } from 'svelte/reactivity';

	let { data, children } = $props();

	onMount(() => {
		let eventSource: EventSource | undefined = undefined;

		// reconnection settings
		let reconnectTimer: ReturnType<typeof setTimeout>;
		let reconnectDelay = 1000; // start with 1 second
		const maxReconnectDelay = 30000; // max 30 seconds
		let isCleaningUp = false;

		// throttle invalidations to avoid overwhelming the system
		let invalidateTimer: ReturnType<typeof setTimeout> | undefined;
		const pendingInvalidations = new SvelteSet<string>();

		function scheduleInvalidate(key: string) {
			// Limit queue size to prevent memory issues
			if (pendingInvalidations.size > 100) {
				console.warn(`Invalidation queue full, dropping: ${key}`);
				return;
			}

			pendingInvalidations.add(key);

			// Throttle (not debounce): if a flush is already pending we leave it, so a steady
			// stream of events (faster than the window) still flushes regularly instead of being
			// starved by the timer restarting on every event.
			if (invalidateTimer) {
				return;
			}

			invalidateTimer = setTimeout(() => {
				invalidateTimer = undefined;
				// Process all invalidations at once (SvelteKit handles deduplication)
				for (const k of pendingInvalidations) {
					invalidate(k);
				}
				pendingInvalidations.clear();
			}, 500);
		}

		function connect() {
			if (isCleaningUp) return;

			eventSource = new EventSource('/api/events');

			eventSource.onopen = () => {
				console.log('SSE connected');
				reconnectDelay = 1000; // Reset delay on successful connection

				// Events fired from the server while this client was subscribing (or missed
				// while reconnecting) are lost, so re-run every load function to catch up
				refreshAll();
			};

			eventSource.onmessage = (event) => {
				try {
					const change: ContestEvent = JSON.parse(event.data);

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
		<div class="flex flex-row gap-2 md:gap-3 bg-gray-800 dark:bg-gray-950 text-white p-2 md:p-3 items-center">
			{#if data.logo && data.logo.length > 0}
				<div class="w-12">
					<Logo ref={data.logo} size={12} />
				</div>
			{/if}

			<div class="text-lg md:text-2xl w-full truncate">
				<span class="hidden md:inline">{data.formalName}</span>
				<span class="inline md:hidden">{data.name}</span>
			</div>

			<div class="w-24"><Clock contest={data.contest} contestState={data.contestState} /></div>

			<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
				<a href="/" class="flex flex-row items-baseline" title="Teams" aria-label="Teams"
					><i class="fa-solid fa-people-group md:pr-2"></i><span class="hidden md:inline">Teams</span></a>
			</div>

			{#if data.map}
				<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
					<a href="/map" class="flex flex-row items-baseline" title="Map" aria-label="Map"
						><i class="fa-solid fa-map md:pr-2"></i><span class="hidden md:inline">Map</span></a>
				</div>
			{/if}

			<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
				<a
					href="/clarifications"
					class="flex flex-row items-baseline"
					title="Clarifications"
					aria-label="Clarifications"
					><i class="fa-solid fa-clipboard-question md:pr-2"></i><span class="hidden md:inline">Clarifications</span
					></a>
			</div>

			<div class="text-lg hover:bg-hover hover:text-link p-2 rounded-md">
				<a href="/scoreboard" class="flex flex-row items-baseline" title="Scoreboard" aria-label="Scoreboard"
					><i class="fa-solid fa-ranking-star md:pr-2"></i><span class="hidden md:inline">Scoreboard</span></a>
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
