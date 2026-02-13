<script lang="ts">
	import { Video } from '@icpctools/contest-ui';

	let { data } = $props();
</script>

<Video ref={data.team.webcam?.[0]} type="webcam" />
