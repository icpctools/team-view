import { loadContest } from '$lib/state.svelte.js';
import { error } from '@sveltejs/kit';

export const load = async (_params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadContest()]);

	const contest = cc.getContest();
	if (!contest) throw error(404);

	return {
		contest: contest,
		name: contest.formal_name || contest.name,
		banner: contest.banner,
		logo: contest.logo,
	};
};
