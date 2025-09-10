import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadTeams(), cc.loadOrganizations()]);

	const teams = cc.getTeams();
	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	const orgs = cc.getOrganizations();

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	return {
		team: team,
		logo: logo
	};
};
