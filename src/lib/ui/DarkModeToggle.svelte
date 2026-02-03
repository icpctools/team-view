<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { mode } from 'mode-watcher';

	let isDark = $derived('dark' === mode.current);
</script>

<button
	type="button"
	onclick={toggleMode}
	class="p-2 rounded-md hover:bg-hover transition-colors"
	aria-label="Toggle dark mode"
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
	{#if isDark}
		<i class="fa-regular fa-moon"></i>
	{:else}
		<i class="fa-regular fa-sun"></i>
	{/if}
</button>
