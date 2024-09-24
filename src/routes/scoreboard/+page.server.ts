import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { ContestUtil } from '$lib/contest-util';
import type { ProblemJSON, ScoreboardJSON, TeamJSON } from '$lib/contest-types.js';

export const load = async (_params) => {
    const c = new Contests("https://localhost:8443/api/");
	await c.loadContests();
	if (!c) throw error(404);

	console.log("contests: " + c.getContests()?.length);
	
	const cc = c.getContest();
	if (!cc) throw error(404);

	let scoreboard:ScoreboardJSON|undefined = await cc.loadScoreboard();
	if (!scoreboard) throw error(404);

	let teams:TeamJSON[]|undefined = await cc.loadTeams();
	if (!teams) throw error(404);

	let problems:ProblemJSON[]|undefined = await cc.loadProblems();
	if (!problems) throw error(404);

	// sort teams by scoreboard row
	const util = new ContestUtil();
	let sortedTeams = scoreboard.rows?.map(row => util.findById(teams, row.team_id));

	let orgs = await cc.loadOrganizations();

	let map = sortedTeams?.map(team => util.findById(orgs, team.organization_id));
	let logos = map?.map(org => cc.resolveURL(util.bestSquareLogo(org?.logo, 64)));

    return {
        name: c.getContests()[0].name,
		scoreboard: scoreboard,
		teams:sortedTeams,
		logos:logos,
		problems:problems
    };
};