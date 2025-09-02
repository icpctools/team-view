import { browser } from '$app/environment';

export const CONTEST = $state({
    url: browser ? 'https://localhost:8443/api/' : (process?.env?.CONTEST_URL || 'https://localhost:8443/api/'),
    contest_id: browser ? 'systest' : (process?.env?.CONTEST_ID || 'systest'),
    user: browser ? 'admin' : (process?.env?.CONTEST_USER || 'admin'),
    password: browser ? 'adm1n' : (process?.env?.CONTEST_PASSWORD || 'adm1n'),
});