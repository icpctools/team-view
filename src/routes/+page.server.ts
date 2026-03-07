import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('app:teams', 'app:organizations', 'app:state', 'app:start-status');
	const cc = await loadContest();
	if (!cc) throw error(404);

	const teams = cc.getTeams();

	const orgs = cc.getOrganizations();

	const logos = teams?.map((team) => findById(orgs, team.organization_id)?.logo);

	return {
		teams: teams,
		logos: logos,
		status: cc.getStartStatus(),
		state: cc.getState()
	};
};
