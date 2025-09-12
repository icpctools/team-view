<script lang="ts">
	import Banner from '$lib/ui/Banner.svelte';
	import Clock from '$lib/ui/Clock.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import '../app.css';
	import '../tailwind.css';

	let { data, children } = $props();
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="flex flex-row gap-8 bg-gray-800 text-white p-4 items-center">
		{#if data.logo && data.logo.length > 0}
			<div class="w-12">
				<Logo ref={data.logo} />
			</div>
		{/if}

		<div class="text-2xl w-full"><a href="/">{data.name}</a></div>

		<div class="w-48"><Clock contest={data.contest} /></div>

		<div class="text-lg"><a href="/scoreboard">Scoreboard</a></div>
	</div>

	<div class="overflow-auto flex flex-col gap-2 w-full h-full">
		{@render children()}

		{#if data.banner && data.banner.length > 0}
			<div class="self-center p-2">
				<Banner ref={data.banner} />
			</div>
		{/if}
	</div>
</div>
