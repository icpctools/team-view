import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { ContestUtil } from '$lib/contest-util';

export const load = async (params) => {
    const c = new Contests("https://localhost:8443/api/");
	await c.loadContests();
	if (!c) throw error(404);
	
	const cc = c.getContest();
	if (!cc) throw error(404);
	
	const teams = await cc.loadTeams();
	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	const orgs = await cc.loadOrganizations();

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	const persons = await cc.loadPersons();
	const members = persons?.filter(p => p.team_ids?.includes(team.id));
	
    return {
        team:team,
		logo:logo,
		members:members
    };
};