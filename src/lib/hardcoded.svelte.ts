import { browser } from '$app/environment';

export const CONTEST = $state(
	browser
		? {}
		: {
				url: process?.env?.CONTEST_URL || 'https://localhost:8443/api/',
				contest_id: process?.env?.CONTEST_ID || undefined,
				user: process?.env?.CONTEST_USER || 'admin',
				password: process?.env?.CONTEST_PASSWORD || 'adm1n'
			}
);

export const CONFIG = $state({
	proxy: process?.env?.CONTEST_PROXY ? process?.env?.CONTEST_PROXY === 'true' : process.env.NODE_ENV === 'development'
});
