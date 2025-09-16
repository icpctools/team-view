import { loadContest } from '$lib/state.svelte.js';
import { error } from '@sveltejs/kit';

export async function load({ depends }) {
	const cc = await loadContest();
	if (!cc) throw error(404);

	depends('data:contest');

	await Promise.all([cc.loadContest()]);

	const contest = cc.getContest();
	if (!contest) throw error(404);

	return {
		contest: contest,
		name: contest.formal_name || contest.name,
		banner: contest.banner,
		logo: contest.logo
	};
};
