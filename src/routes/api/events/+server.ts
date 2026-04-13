import type { RequestHandler } from './$types';
import { loadContest } from '$lib/state.svelte';
import type { ContestListener } from '@icpctools/contest-api';

export const GET: RequestHandler = async () => {
	const contest = await loadContest();

	if (!contest) {
		return new Response('Contest not loaded', { status: 500 });
	}

	// Create a readable stream for SSE
	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();

			// Send initial connection message
			const initMessage = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`;
			controller.enqueue(encoder.encode(initMessage));

			// Create listener for contest changes
			const listener: ContestListener = (event) => {
				try {
					const message = `data: ${JSON.stringify(event)}\n\n`;
					controller.enqueue(encoder.encode(message));
				} catch (error) {
					if (error instanceof TypeError) {
						console.error('Error sending SSE event:', error.message);
					} else {
						console.error('Error sending SSE event:', error);
					}
				}
			};

			// Add listener to contest
			contest.addChangeListener(listener);

			// Keep-alive ping every 30 seconds
			const keepAliveInterval = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(': keep-alive\n\n'));
				} catch (error) {
					console.error('Error sending keep-alive:', error);
					clearInterval(keepAliveInterval);
				}
			}, 30000);

			// Cleanup on stream close
			return () => {
				clearInterval(keepAliveInterval);
				contest.removeChangeListener(listener);
				console.log('SSE client disconnected');
			};
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
