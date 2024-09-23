import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { ContestUtil } from '$lib/contest-util';
import type { TeamJSON } from '$lib/contest-types.js';

export const load = async (_params) => {
    const c = new Contests("https://localhost:8443/api/");
	await c.loadContests();

	if (!c) throw error(404);

	console.log("contests: " + c.getContests()?.length);

	let teams:TeamJSON[]|undefined = [];
	let logos:(string|undefined)[] = [];

	const util = new ContestUtil();
	
	const cc = c.getContest();
	if (cc) {
		teams = await cc.loadTeams();
		let orgs = await cc.loadOrganizations();
		let map = teams?.map(team => util.findById(orgs, team.organization_id));
		logos = map?.map(org => cc.resolveURL(util.bestSquareLogo(org?.logo, 64)));
	}

    return {
        name: c.getContests()[0].name,
		teams:teams,
		logos:logos,
    };
};