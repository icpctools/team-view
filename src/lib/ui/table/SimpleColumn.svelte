<script lang="ts">
	interface Props {
		object: string;
	}
	let { object }: Props = $props();
</script>

<div class="text-black dark:text-white max-w-full text-wrap">
	{object}
</div>
