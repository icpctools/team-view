import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();

	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	if (!cc.getOrganizations())
		await cc.loadOrganizations();
	const orgs = cc.getOrganizations();

	if (!cc.getProblems())
		await cc.loadProblems();
	const problems = cc.getProblems();

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	let scoreboard = await cc.loadScoreboard();
	const row = scoreboard?.rows?.find((r) => r.team_id === team.id);

	return {
		team: team,
		logo: logo,
		problems: problems,
		row: row,
		scoreboard_type: cc.getInfo()?.scoreboard_type
	};
};
