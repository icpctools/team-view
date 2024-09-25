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

    return {
        team:team
    };
};