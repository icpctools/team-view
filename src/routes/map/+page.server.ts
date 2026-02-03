import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';

export const load = async () => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await cc.loadTeams();

	// map endpoint may not exist, so load it separately
	try {
		await cc.loadMapInfo();
	} catch (error) {
		console.log(`Could not load map: ${error}`);
	}

	return {
		mapInfo: cc.getMapInfo(),
		teams: cc.getTeams()
	};
};
