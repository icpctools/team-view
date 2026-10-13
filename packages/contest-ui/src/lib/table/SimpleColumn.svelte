<script lang="ts">
	interface Props {
		object: string;
	}
	let { object }: Props = $props();
</script>

<div class="text-black dark:text-white max-w-full overflow-hidden text-ellipsis">
	{object}
</div>
