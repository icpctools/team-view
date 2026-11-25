<script lang="ts">
	import { ICPC_BLUE, ICPC_RED, ICPC_YELLOW, darkerHex } from '@icpctools/contest-ui';

	interface Props {
		a: number; // 0-100
		b: number;
		c: number;
		class?: string;
	}
	let { a, b, c, class: clz }: Props = $props();

	let arcH = $derived(mod(a));
	let arcM = $derived(mod(b));
	let arcS = $derived(mod(c));

	const arcHr = 43.5;
	const arcMr = 30;
	const arcSr = 16.5;

	function mod(n: number): number {
		return ((n % 100) + 100) % 100;
	}
</script>

<svg aria-label="clock" class="h-full w-auto {clz}" viewBox="0 0 100 100">
	<circle
		id="arc1"
		cx="50"
		cy="50"
		r={arcHr}
		fill="none"
		pathLength="50"
		stroke={ICPC_BLUE}
		stroke-width="12.5"
		stroke-dasharray="{arcH < 50 ? arcH : 0} {arcH < 50 ? 50 : arcH - 50} 50"
		stroke-dashoffset="0"
		transform="rotate(-90 50 50)" />
	<circle
		id="arc2"
		cx="50"
		cy="50"
		r={arcMr}
		fill="none"
		pathLength="50"
		stroke={darkerHex(ICPC_YELLOW)}
		stroke-width="12.5"
		stroke-dasharray="{arcM < 50 ? arcM : 0} {arcM < 50 ? 50 : arcM - 50} 50"
		stroke-dashoffset="0"
		transform="rotate(-90 50 50)" />
	<circle
		id="arc3"
		cx="50"
		cy="50"
		r={arcSr}
		fill="none"
		pathLength="50"
		stroke={ICPC_RED}
		stroke-width="12.5"
		stroke-dasharray="{arcS < 50 ? arcS : 0} {arcS < 50 ? 50 : arcS - 50} 50"
		stroke-dashoffset="0"
		transform="rotate(-90 50 50)" />
</svg>
