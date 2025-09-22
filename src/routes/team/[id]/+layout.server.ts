import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async ({ params }) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([
		cc.loadContest(),
		cc.loadTeams(),
		cc.loadOrganizations(),
		cc.loadProblems(),
		cc.loadScoreboard()
	]);

	const teams = cc.getTeams();
	const team = teams?.find((t) => t.id && t.id === params.id);
	if (!team) throw error(404);

	const orgs = cc.getOrganizations();

	const problems = cc.getProblems();

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	let scoreboard = cc.getScoreboard();
	const row = scoreboard?.rows?.find((r) => r.team_id === team.id);

	return {
		team: team,
		logo: logo,
		problems: problems,
		row: row,
		scoreboard_type: cc.getContest()?.scoreboard_type
	};
};
