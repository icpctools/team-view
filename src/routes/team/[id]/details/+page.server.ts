import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';

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
	const org = orgs?.find(o => o.id === team.organization_id);

	const groups = await cc.loadGroups();
	const groups2 = groups?.filter(g => team.group_ids?.includes(g.id));

	const persons = await cc.loadPersons();
	const coaches = persons?.filter(p => p.role === 'coach' && p.team_ids?.includes(team.id));
	const contestants = persons?.filter(p => p.role === 'contestant' && p.team_ids?.includes(team.id));

    return {
        team:team,
		organization:org,
		groups:groups2,
		coaches:coaches,
		contestants:contestants
    };
};