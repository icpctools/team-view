import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async (_params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();

	if (!teams) throw error(404);

	// sort teams by id
	teams.sort((a, b) => {
		// todo: try parsing as number first
		const an = parseInt(a.id);
		const bn = parseInt(b.id);
		if (!Number.isNaN(an) && !Number.isNaN(bn)) {
			return an - bn;
		}
		return a.id.localeCompare(b.id);
	});

	if (!cc.getOrganizations())
		await cc.loadOrganizations();
	const orgs = cc.getOrganizations();

	if (!orgs) throw error(404);

	const util = new ContestUtil();
	const logos = teams?.map((team) => util.findById(orgs, team.organization_id)?.logo);

	return {
		teams: teams,
		logos: logos
	};
};
