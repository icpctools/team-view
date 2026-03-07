<script lang="ts">
	import { type StartStatus } from '@icpctools/contest-api';

	interface Props {
		status: StartStatus;
	}
	let { status }: Props = $props();
</script>

<div class="flex flex-row w-full px-10 gap-2 items-center">
	<div class="grid w-20 p-1">
		<div
			class={{
				'rounded-full transition-colors w-5 h-5': true,
				'bg-red-500': status?.status === 0,
				'bg-yellow-500': status?.status === 1,
				'bg-green-500': status?.status === 2,
				'justify-self-start': status?.status === 0,
				'justify-self-center': status?.status === 1,
				'justify-self-end': status?.status === 2
			}}>
		</div>
	</div>
	<div class="whitespace-nowrap">{status?.label}</div>
</div>
