<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';

	import { onMount, onDestroy } from 'svelte';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css'; // default Video.js CSS

	interface Props {
		ref?: FileReference;
		type: string;
	}

	let { ref, type }: Props = $props();

	let src = $derived(ref ? ref.href : undefined);
	let mime = $derived(ref ? ref.mime : undefined);

	let videoNode = $state<HTMLElement | string>('');
	let player = $state<Player>();

	let errorMessage = $state<string | undefined>(undefined);

	const options = {
		autoplay: true,
		controls: false,
		responsive: true,
		fluid: true,
		aspectRatio: '16:9',
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

	// attach to the underlying mpegts.js player so we can read the HTTP status
	// code and tell a permission problem apart from generic network failure.
	let mpegtsErrorHandlerAttached = false;
	async function attachMpegtsErrorHandler() {
		if (mpegtsErrorHandlerAttached) {
			return;
		}
		const { default: mpegts } = await import('mpegts.js');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const tech = player?.tech({ IWillNotUseThisInPlugins: true }) as any;
		const mpegtsPlayer = tech?.mpegtsPlayer;
		if (!mpegtsPlayer) {
			// may not have created mpegts.js player yet, will be retried on the next loadstart
			return;
		}
		mpegtsErrorHandlerAttached = true;
		mpegtsPlayer.on(
			mpegts.Events.ERROR,
			(errorType: string, _errorDetail: string, errorInfo?: { code: number; msg: string }) => {
				if (errorType === mpegts.ErrorTypes.NETWORK_ERROR && errorInfo?.code === 403) {
					errorMessage = 'Video not available (no permission, may be due to contest freeze)';
				} else if (errorType === mpegts.ErrorTypes.NETWORK_ERROR) {
					errorMessage = 'Video not available (network error)';
				} else {
					errorMessage = 'Video not available';
				}
			}
		);
	}

	onMount(async () => {
		await import('videojs-mpegtsjs');

		player = videojs(videoNode, options, function onPlayerReady() {
			// player ready
		});

		// clear error message when video starts playing
		player.on('playing', () => {
			errorMessage = undefined;
		});

		// fallback for non-mpegts sources (e.g. reaction videos) where errors
		// surface through the standard HTML5 media element.
		player.on('error', () => {
			const err = player?.error();
			if (err?.code === 2 /* MEDIA_ERR_NETWORK */) {
				errorMessage = 'Video not available (network error)';
			} else if (err) {
				errorMessage = 'Video not available';
			}
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

			if (mime === 'video/mp2t') {
				// the mpegts.js player is created when the source is set, attach on
				// loadstart (and attempt immediately) to catch its error events.
				player.on('loadstart', attachMpegtsErrorHandler);
			}

			player.src(srcObj);

			if (mime === 'video/mp2t') {
				await attachMpegtsErrorHandler();
			}
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});

	/* eslint svelte/no-unused-svelte-ignore: "off" */
</script>

{#if src}
	<div class="relative h-full w-full">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video bind:this={videoNode} class="video-js vjs-default-skin h-full w-full"></video>
		{#if errorMessage}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
				<span class="rounded bg-black/70 px-4 py-2 text-center text-white">{errorMessage}</span>
			</div>
		{/if}
	</div>
{:else}
	<span class="self-center">({type} unavailable)</span>
{/if}
