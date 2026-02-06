<script lang="ts">
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';
	import type { Problem } from 'contest-api';

	interface Props {
		problem?: Problem;
		onclick?: () => void;
	}

	let { problem, onclick }: Props = $props();

	let pStyle = $derived.by(() => {
		const rgb = problem?.rgb;
		if (!rgb) {
			return 'color:#000;border-color:#000';
		}

		let col = parseHexColor(rgb);
		let fg = '#fff';
		if (col && col[0] + col[1] + col[2] > 450) {
			fg = '#000';
		}
		let border = rgb;
		if (col) {
			border = rgbToHex(darker(col));
		}

		return 'color:' + fg + ';border-color:' + border;
	});
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="grid grid-row justify-self-center border rounded-sm min-w-4 w-full max-w-12 @container dark:text-gray-100"
	class:hover:bg-hover={onclick}
	class:cursor-pointer={onclick}
	class:cursor-default={!onclick}
	class:bg-[var(--problem-bg)]={true}
	role="link"
	style="{pStyle};--problem-bg:{problem?.rgb ?? '#fff'}"
	{onclick}>
	<span class="text-center @max-[20px]:invisible">{problem?.label}</span>
</div>
