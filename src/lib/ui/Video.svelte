<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';

	import { onMount, onDestroy } from 'svelte';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css'; // default Video.js CSS

	interface Props {
		ref?: FileReferenceJSON[];
		type: string;
	}

	let { ref, type }: Props = $props();

	let src = $derived((ref && ref.length > 0) ? ref[0].href : undefined);

	let videoNode = $state<HTMLElement | string>('');
	let player = $state<Player>();

	const options = {
		autoplay: true,
		controls: false,
		responsive: true,
		fluid: true,
		poster: '/images/icpc-logo.png',
		preload: 'auto'
	};

	onMount(async () => {
		/*var videoElement = document.getElementById('videoElement');
        var player = mpegts.createPlayer({
            type: 'mse',  // could also be mpegts, m2ts, flv
            isLive: true,
            url: 'http://example.com/live/livestream.ts'
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();*/

		/*player = videojs(videoNode, options, function onPlayerReady() {
			// player ready
		});
		if (src) {
			player.src(src);
		}*/
		const obj = await import("mpegts.js");
		const Mpegts = obj.default;
		var videoElement = document.getElementById('videoElement-'+type);
		var player = Mpegts.createPlayer({
            type: 'mpegts',
            isLive: true,
            url: src
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});
</script>

{#if src}
	<!-- svelte-ignore a11y_media_has_caption -->
	<!--<video bind:this={videoNode} class="video-js vjs-default-skin"></video>-->
	<!-- svelte-ignore a11y_media_has_caption -->
	<video playsinline class="w-full h-full border border-black bg-slate-900" id="videoElement-{type}"></video>
{:else}
	<span class="self-center">({type} unavailable)</span>
{/if}
