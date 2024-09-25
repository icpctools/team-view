import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { ContestUtil } from '$lib/contest-util';
import type { TeamJSON } from '$lib/contest-types.js';

export const load = async (_params) => {
    const c = new Contests("https://localhost:8443/api/");
	await c.loadContests();
	if (!c) throw error(404);
	
	const cc = c.getContest();
	if (!cc) throw error(404);

	let teams:TeamJSON[]|undefined = await cc.loadTeams();
	if (!teams) throw error(404);

	const orgs = await cc.loadOrganizations();

	const util = new ContestUtil();
	const logos = teams?.map(team => util.findById(orgs, team.organization_id)?.logo);
	const contest = c.getContests()[0];

    return {
        name: contest.formal_name || contest.name,
		banner: contest?.banner,
		logo: contest?.logo,
		teams:teams,
		logos:logos
    };
};
