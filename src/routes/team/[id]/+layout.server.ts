import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ params, depends }) => {
	depends(`app:teams/${params.id}`, 'app:problems', 'app:submissions', 'app:scoreboard');
	const cc = await loadContest();
	if (!cc) throw error(404);

	const teams = cc.getTeams();
	const team = teams?.find((t) => t.id && t.id === params.id);
	if (!team) throw error(404);

	const orgs = cc.getOrganizations();

	const problems = cc.getProblems();

	const logo = findById(orgs, team.organization_id)?.logo;

	const scoreboard = cc.getScoreboard();
	const row = scoreboard?.rows?.find((r) => r.team_id === team.id);

	return {
		team: team,
		logo: logo,
		problems: problems,
		row: row,
		scoreboard_type: cc.getContest()?.scoreboard_type
	};
};
