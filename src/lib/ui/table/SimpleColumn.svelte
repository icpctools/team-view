<script lang="ts">
	interface Props {
		object: string;
	}
	let { object }: Props = $props();
</script>

<div class="text-black dark:text-white max-w-full px-1 text-wrap">
	{object}
</div>
