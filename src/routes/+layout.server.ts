import { loadContest } from '$lib/state.svelte.js';
import { error } from '@sveltejs/kit';

export const load = async ({ depends }) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	depends('data:contest');

	await Promise.all([cc.loadContest()]);

	try {
		await Promise.all([cc.loadMapInfo()]);
	} catch (error) {
		console.log(`Could not load map: ${error}`);
	}

	const contest = cc.getContest();
	if (!contest) throw error(404);

	return {
		contest: contest,
		name: contest.formal_name || contest.name,
		banner: contest.banner,
		logo: contest.logo,
		map: cc.getMapInfo()
	};
};
