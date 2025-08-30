import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { contest } from '$lib/state.svelte.js';

export const load = async (_params) => {
	const cc = contest;
	if (!cc) throw error(404);

	if (!cc.getInfo())
		await cc.loadInfo();
	let info = cc.getInfo();
	if (!info) throw error(404);

	let scoreboard = await cc.loadScoreboard();
	if (!scoreboard) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();
	if (!teams) throw error(404);

	if (!cc.getProblems())
		await cc.loadProblems();
	const problems = cc.getProblems();

	if (!problems) throw error(404);

	// sort teams by scoreboard row
	const util = new ContestUtil();
	let sortedTeams = scoreboard.rows?.map((row) => util.findById(teams, row.team_id));

	if (!cc.getOrganizations())
		await cc.loadOrganizations();
	const orgs = cc.getOrganizations();

	let logos = sortedTeams?.map(team => util.findById(orgs, team?.organization_id)?.logo);
	const hasLogos = logos.filter(x => x).length > 0;

	return {
		name: info.name,
		scoreboard_type: info.scoreboard_type,
		scoreboard: scoreboard,
		teams: sortedTeams,
		logos: logos,
		problems: problems,
		hasLogos: hasLogos,
	};
};
