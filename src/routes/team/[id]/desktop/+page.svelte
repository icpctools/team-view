<script lang="ts">
	import { Video } from '@icpctools/contest-ui';

	let { data } = $props();
</script>

<Video ref={data.team.desktop?.[0]} type="desktop" />
