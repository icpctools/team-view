<script lang="ts">
	import type { FileReference } from '$lib/contest-types';

	import { onMount, onDestroy } from 'svelte';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css'; // default Video.js CSS

	interface Props {
		ref?: FileReference[];
		type: string;
	}

	let { ref, type }: Props = $props();

	let src = $derived(ref && ref.length > 0 ? ref[0].href : undefined);
	let mime = $derived(ref && ref.length > 0 ? ref[0].mime : undefined);

	let videoNode = $state<HTMLElement | string>('');
	let player = $state<Player>();

	const options = {
		autoplay: true,
		controls: false,
		responsive: true,
		fluid: true,
		poster: '/images/icpc-logo.png',
		preload: 'auto',
		mpegtsjs: {
			mediaDataSource: {
				isLive: true,
				cors: true,
				withCredentials: false
			}
		}
	};

	onMount(async () => {
		await import('videojs-mpegtsjs');

		player = videojs(videoNode, options, function onPlayerReady() {
			// player ready
		});
		if (src) {
			if (mime === 'video/m2ts') {
				// Video.js mpegts.js expects a different mime type
				mime = 'video/mp2t';
			}
			let srcObj = {
				src: src,
				type: mime
			};
			player.src(srcObj);
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});
</script>

{#if src}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video bind:this={videoNode} class="video-js vjs-default-skin"></video>
{:else}
	<span class="self-center">({type} unavailable)</span>
{/if}
