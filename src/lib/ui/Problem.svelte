<script lang="ts">
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';
	import type { Problem } from '$lib/contest-types';

	interface Props {
		problem?: Problem;
		onclick?: () => void;
	}

	let { problem, onclick }: Props = $props();

	let pStyle = $state('');
	const rgb = problem?.rgb;
	if (rgb) {
		let col = parseHexColor(rgb);
		let fg = '#fff';
		if (col && col[0] + col[1] + col[2] > 450) {
			fg = '#000';
		}
		let border = rgb;
		if (col) {
			border = rgbToHex(darker(col));
		}

		pStyle = 'background-color:' + rgb + ';color:' + fg + ';border-color:' + border + ';';
	} else {
		pStyle = 'background-color:#fff;color:#000;border:#000;';
	}
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="grid grid-row justify-self-center border-[1px] rounded-sm min-w-4 w-full max-w-12 @container" role="link" style={pStyle} {onclick}>
	<span class="text-center @max-[20px]:invisible">{problem?.label}</span>
</div>
