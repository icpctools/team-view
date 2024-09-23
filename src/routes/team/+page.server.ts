import { error } from '@sveltejs/kit';
import { Contest } from '$lib/contest';
import { ContestUtil } from '$lib/contest-util';
import { TeamJSON } from '../lib/contest-types.js';

export const load = async (_params) => {
	const c:Contest | undefined = undefined;
    const t:TeamJSON[] | undefined = undefined;

	

	ContestUtil util = new ContestUtil();
	contest org:OrganizationJSON | undefined = util.findById(c.getOrganizations(),t.organization_id);
	
	if (!c) throw error(404);

	console.log("contests: " + c.getContests().length);

	let numTeams = 0;
	let teams:TeamJSON[] = [];
	const cc = c.getContest();
	if (cc) {
		teams = await cc.loadTeams();
		const o = await cc.loadOrganizations();
		if (teams)
			numTeams = teams.length;
	}

    return {
        name: c.getContests()[0].name,
		numTeams: numTeams,
		teams:teams
    };
};