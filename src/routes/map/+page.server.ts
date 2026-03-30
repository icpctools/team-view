import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('app:teams', 'app:map-info');
	const cc = await loadContest();
	if (!cc) throw error(404);

	return {
		mapInfo: cc.getMapInfo(),
		teams: cc.getTeams()
	};
};
