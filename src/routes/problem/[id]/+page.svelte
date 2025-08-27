<script lang="ts">
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';

	let { data } = $props();

	let pStyle = $state('');
	let rgb = data.problem.rgb;
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

<div class="flex flex-col p-2 gap-1">
	<div class="flex flex-col">
	<div class="text-xl">Problem</div>
	<div class="flex flex-row gap-x-2">
		<div class="justify-self-center text-center uppercase border-[1px] rounded-sm w-12 h-6" style={pStyle}>{data.problem.label}</div>
		{data.problem.name}</div>
</div>

{#if data.problem.color}
<div class="flex flex-col">
	<div class="text-xl">Color</div>
	<div>{data.problem.color}</div>
</div>
{/if}

{#if data.submissions && data.submissions.length > 0}
<div class="flex flex-col">
	<div class="text-xl">Submissions</div>
	<div>{data.submissions.length}</div>
</div>
{/if}
</div>