<script lang="ts">
	import Banner from '$lib/ui/Banner.svelte';
	import Clock from '$lib/ui/Clock.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../tailwind.css';
	import { invalidate } from '$app/navigation';

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

<div class="flex flex-col w-screen h-screen max-w-screen max-h-screen">
	<div class="flex flex-row gap-8 bg-gray-800 text-white p-4 items-center">
		{#if data.logo && data.logo.length > 0}
			<div class="w-12">
				<Logo ref={data.logo} tag="dark" />
			</div>
		{/if}

		<div class="text-2xl w-full"><a href="/">{data.name}</a></div>

		<div class="w-48"><Clock contest={data.contest} /></div>

		{#if data.map}
			<div class="text-lg"><a href="/map">Map</a></div>
		{/if}

		<div class="text-lg"><a href="/scoreboard">Scoreboard</a></div>
	</div>

	<div class="gap-2 w-full grow overflow-hidden">
		{@render children()}
	</div>

	{#if data.banner && data.banner.length > 0}
		<div class="self-center p-2">
			<Banner ref={data.banner} />
		</div>
	{/if}
</div>
