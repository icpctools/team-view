<script lang="ts">
	import Banner from '$lib/ui/Banner.svelte';
	import Clock from '$lib/ui/Clock.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import DarkModeToggle from '$lib/ui/DarkModeToggle.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../tailwind.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from "mode-watcher";

	let { data, children } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:contest');
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<ModeWatcher />

<div class="flex flex-col w-screen h-screen max-w-screen max-h-screen bg-white dark:bg-gray-900">
	<div class="flex flex-row gap-8 bg-gray-800 dark:bg-gray-950 text-white p-4 items-center">
		{#if data.logo && data.logo.length > 0}
			<div class="w-12">
				<Logo ref={data.logo}/>
			</div>
		{/if}


		<div class="w-48"><Clock contest={data.contest} /></div>

		{#if data.map}
		{/if}

		<div class="text-lg"><a href="/scoreboard" class="flex flex-row items-center"><i class="fa-solid fa-square-poll-horizontal pr-2"></i> Scoreboard</a></div>

		<DarkModeToggle />
	</div>

	<div class="gap-2 w-full grow overflow-hidden bg-white dark:bg-gray-900">
		{@render children()}
	</div>

	{#if data.banner && data.banner.length > 0}
		<div class="self-center p-2">
			<Banner ref={data.banner}/>
		</div>
	{/if}
</div>
