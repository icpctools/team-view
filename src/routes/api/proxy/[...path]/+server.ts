import { CONFIG, CONTEST } from '$lib/hardcoded.svelte';
import type { RequestHandler } from './$types';

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
	const serverURL = CONTEST.url?.endsWith('/') ? CONTEST.url : CONTEST.url + '/';
	const targetUrl = `${serverURL}${path}${url.search}`;

	const headers: Record<string, string> = {};
	const excludedHeaders = ['host', 'connection', 'content-length'];

	for (const [key, value] of request.headers.entries()) {
		if (!excludedHeaders.includes(key.toLowerCase())) {
			headers[key] = value;
		}
	}

	if (CONTEST.user) {
		headers['Authorization'] = 'Basic ' + btoa(CONTEST.user + ':' + (CONTEST.password ?? ''));
	}

	try {
		const response = await fetch(targetUrl, {
			method: request.method,
			headers,
			redirect: 'follow'
		});

		const responseHeaders = new Headers();
		const skipHeaders = ['connection', 'keep-alive', 'transfer-encoding'];
		for (const [key, value] of response.headers.entries()) {
			if (!skipHeaders.includes(key.toLowerCase())) {
				responseHeaders.set(key, value);
			}
		}

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
	} catch (error) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
