<script lang="ts">
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';
	import type { Problem } from '$lib/contest-types';

	interface Props {
		problem?: Problem;
	}

	let { problem }: Props = $props();

	let pStyle = $state('');
	const rgb = problem?.rgb;
	if (rgb) {
		let col = parseHexColor(rgb);
		let fg = '#fff';
		if (col && col[0] + col[1] + col[2] > 450) {
			fg = '#000';
		}
		let border =rgb;
		if (col) {
			border = rgbToHex(darker(col));
		}

		pStyle = 'background-color:'+rgb+';color:'+fg+ ';border-color:'+border+';';
	} else {
		pStyle = 'background-color:#fff;color:#000;border:#000;';
	}
</script>

<div class="justify-self-center text-center border-[1px] rounded-sm w-full h-full" style={pStyle}>{problem?.label}</div>
