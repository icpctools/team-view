import type { RequestHandler } from './$types';
import { loadContest } from '$lib/state.svelte';
import type { ContestListener } from '@icpctools/contest-api';

export const GET: RequestHandler = async () => {
	const contest = await loadContest();

	if (!contest) {
		return new Response('Contest not loaded', { status: 500 });
	}

	// Create a readable stream for SSE
	let cleanup: (() => void) | undefined;

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			let isClosed = false;

			// Send initial connection message
			const initMessage = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`;
			controller.enqueue(encoder.encode(initMessage));

			// Create listener for contest changes
			const listener: ContestListener = (event) => {
				if (isClosed) return;

				try {
					const message = `data: ${JSON.stringify(event)}\n\n`;
					controller.enqueue(encoder.encode(message));
				} catch (error) {
					if (error instanceof TypeError && error.message.includes('Controller is already closed')) {
						// Client disconnected, mark as closed to stop further attempts
						cleanup?.();
					} else {
						console.error('Error sending SSE event:', error);
					}
				}
			};

			// Add listener to contest
			contest.addChangeListener(listener);

			// Keep-alive ping every 30 seconds
			const keepAliveInterval = setInterval(() => {
				if (isClosed) {
					clearInterval(keepAliveInterval);
					return;
				}

				try {
					controller.enqueue(encoder.encode(': keep-alive\n\n'));
				} catch (error) {
					if (error instanceof TypeError && error.message.includes('Controller is already closed')) {
						cleanup?.();
					}
					clearInterval(keepAliveInterval);
				}
			}, 30000);

			// Cleanup function - can be called from both cancel() and stream close
			cleanup = () => {
				if (isClosed) return; // Already cleaned up
				isClosed = true;
				clearInterval(keepAliveInterval);
				contest.removeChangeListener(listener);
				console.log('SSE client disconnected');
			};

			// Return cleanup for stream close
			return cleanup;
		},
		cancel() {
			// Called when client disconnects
			cleanup?.();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
