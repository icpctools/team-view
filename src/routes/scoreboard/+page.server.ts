import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('app:teams', 'app:organizations', 'app:problems', 'app:scoreboard');

	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadContest(), cc.loadTeams(), cc.loadOrganizations(), cc.loadProblems(), cc.loadScoreboard()]);

	const contest = cc.getContest();
	if (!contest) throw error(404);

	const scoreboard = cc.getScoreboard();
	if (!scoreboard) throw error(404);

	const teams = cc.getTeams();

	const problems = cc.getProblems();

	// sort teams by scoreboard row
	const sortedTeams = scoreboard.rows?.map((row) => findById(teams, row.team_id));

	const orgs = cc.getOrganizations();

	const logos = sortedTeams?.map((team) => findById(orgs, team?.organization_id)?.logo);
	const hasLogos = logos.filter((x) => x).length > 0;

	return {
		scoreboard_type: contest.scoreboard_type,
		scoreboard: scoreboard,
		teams: sortedTeams,
		logos: logos,
		problems: problems,
		hasLogos: hasLogos
	};
};
