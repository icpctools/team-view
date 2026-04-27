import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('app:contest', 'app:state');
	const cc = await loadContest();
	if (!cc) {
		return {
			contest: null,
			contestState: null,
			name: null,
			banner: null,
			logo: null,
			map: null
		};
	}

	const contest = cc.getContest();
	if (!contest) {
		return {
			contest: null,
			contestState: null,
			name: null,
			banner: null,
			logo: null,
			map: null
		};
	}

	return {
		contest: contest,
		contestState: cc.getState(),
		name: contest.formal_name || contest.name,
		banner: contest.banner,
		logo: contest.logo,
		map: cc.getMapInfo()
	};
};
