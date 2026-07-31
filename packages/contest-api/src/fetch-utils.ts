import type { Credentials } from './contest-api.js';

// Accept self-signed certificates — contest servers commonly use them
if (typeof process !== 'undefined' && process.env) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export function fetchOptions(credentials?: Credentials, timeoutMs = 10000): RequestInit {
	const headers: Record<string, string> = {};
	if (credentials?.user) {
		headers['Authorization'] = 'Basic ' + btoa(credentials.user + ':' + (credentials.password ?? ''));
	}
	return {
		headers,
		signal: AbortSignal.timeout(timeoutMs)
	};
}
