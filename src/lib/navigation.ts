import { goto } from '$app/navigation';
import type { Problem, Team } from '@icpctools/contest-api';
import { resolve } from '$app/paths';

export async function gotoTeam(team?: Team): Promise<void> {
	if (!team) return;

	return gotoTeamId(team?.id);
}

export async function gotoTeamId(team_id?: string): Promise<void> {
	if (!team_id) return;

	return goto(resolve(`/team/${team_id}`));
}

export async function gotoProblem(problem?: Problem): Promise<void> {
	if (!problem) return;

	return goto(resolve(`/problem/${problem.id}`));
}
