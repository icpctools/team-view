import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ depends }) => {
	depends('data:scoreboard');

	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([
		cc.loadContest(),
		cc.loadTeams(),
		cc.loadOrganizations(),
		cc.loadProblems(),
		cc.loadScoreboard()
	]);

	let contest = cc.getContest();
	if (!contest) throw error(404);

	let scoreboard = cc.getScoreboard();
	if (!scoreboard) throw error(404);

	const teams = cc.getTeams();

	const problems = cc.getProblems();

	// sort teams by scoreboard row
	const util = new ContestUtil();
	let sortedTeams = scoreboard.rows?.map((row) => util.findById(teams, row.team_id));

	const orgs = cc.getOrganizations();

	let logos = sortedTeams?.map((team) => util.findById(orgs, team?.organization_id)?.logo);
	const hasLogos = logos.filter((x) => x).length > 0;

	return {
		name: contest.name,
		scoreboard_type: contest.scoreboard_type,
		scoreboard: scoreboard,
		teams: sortedTeams,
		logos: logos,
		problems: problems,
		hasLogos: hasLogos
	};
};
