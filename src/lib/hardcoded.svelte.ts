import { browser } from '$app/environment';

// Don't use $state for server-side singletons - it's meant for component reactivity
// Using plain objects to avoid Svelte proxy issues in server-side load functions
export const CONTEST = browser
	? {}
	: {
			url: process?.env?.CONTEST_URL || 'https://localhost:8443/api/',
			contest_id: process?.env?.CONTEST_ID || undefined,
			user: process?.env?.CONTEST_USER || 'presentation',
			password: process?.env?.CONTEST_PASSWORD || 'presentat1on'
		};

export const CONFIG = {
	proxy: process?.env?.CONTEST_PROXY ? process?.env?.CONTEST_PROXY === 'true' : process.env.NODE_ENV === 'development'
};
