import { CONFIG, CONTEST } from '$lib/hardcoded.svelte';
import type { RequestHandler } from './$types';
import got, { RequestError } from 'got';
import { Readable } from 'node:stream';

// Proxy will only support GET for now
export const GET: RequestHandler = async ({ params, url, request }) => {
	if (!CONFIG.proxy) {
		return new Response(JSON.stringify({ error: 'Proxy not enabled' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	return proxyRequest(params.path, url, request);
};

async function proxyRequest(path: string, url: URL, request: Request): Promise<Response> {
	// Build the target URL
	const serverURL = CONTEST.url?.endsWith('/') ? CONTEST.url : CONTEST.url + '/';
	const targetUrl = `${serverURL}${path}${url.search}`;

	// Copy headers, excluding some that shouldn't be forwarded
	const headers: Record<string, string> = {};
	const excludedHeaders = ['host', 'connection', 'content-length'];

	for (const [key, value] of request.headers.entries()) {
		if (!excludedHeaders.includes(key.toLowerCase())) {
			headers[key] = value;
		}
	}

	try {
		// Create a streaming request (supports MPEG-TS video and other streams)
		const stream = got.stream(targetUrl, {
			method: request.method as 'GET',
			headers,
			https: {
				rejectUnauthorized: false // Accept self-signed certificates
			},
			username: CONTEST.user || undefined,
			password: CONTEST.password || undefined,
			throwHttpErrors: false, // Don't throw on non-2xx status codes
			followRedirect: true
		});

		// Wait for response headers, then stream the body
		return new Promise<Response>((resolve) => {
			stream.on('response', (response) => {
				// Copy response headers
				const responseHeaders = new Headers();
				for (const [key, value] of Object.entries(response.headers)) {
					// Skip headers that shouldn't be forwarded
					if (!['connection', 'keep-alive', 'transfer-encoding'].includes(key.toLowerCase())) {
						if (Array.isArray(value)) {
							value.forEach((v) => responseHeaders.append(key, v));
						} else if (value !== undefined) {
							responseHeaders.set(key, String(value));
						}
					}
				}

				// Convert Node.js stream to Web ReadableStream for streaming response
				const webStream = Readable.toWeb(stream as Readable) as ReadableStream;

				resolve(
					new Response(webStream as BodyInit, {
						status: response.statusCode || 200,
						statusText: response.statusMessage || 'OK',
						headers: responseHeaders
					})
				);
			});

			stream.on('error', (error) => {
				if (error instanceof RequestError && error.response?.statusCode === 304) {
					// ignore Not Modified error, normal response is fine
					return;
				}
				console.error('Proxy stream error:', error.message);
				resolve(
					new Response(JSON.stringify({ error: 'Proxy request failed' }), {
						status: 502,
						headers: { 'Content-Type': 'application/json' }
					})
				);
			});
		});
	} catch (error) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
