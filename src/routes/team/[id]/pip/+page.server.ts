import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();
	
	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	return {
		team: team
	};
};
