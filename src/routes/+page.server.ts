import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async () => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadTeams(), cc.loadOrganizations()]);

	const teams = cc.getTeams();

	const orgs = cc.getOrganizations();

	const util = new ContestUtil();
	const logos = teams?.map((team) => util.findById(orgs, team.organization_id)?.logo);

	return {
		teams: teams,
		logos: logos
	};
};
