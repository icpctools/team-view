import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('app:teams', 'app:organizations');
	const cc = await loadContest();
	if (!cc) throw error(404);

	const teams = cc.getTeams();

	const orgs = cc.getOrganizations();

	const logos = teams?.map((team) => findById(orgs, team.organization_id)?.logo);

	return {
		teams: teams,
		logos: logos
	};
};
