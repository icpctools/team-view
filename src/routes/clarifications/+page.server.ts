import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';
import type { ClarificationData } from './clarificationData.js';
import {
	findById,
	findManyById,
	type Clarification,
	type Group,
	type Problem,
	type Team
} from '@icpctools/contest-api';

function createClarData(c: Clarification, teams: Team[], groups: Group[], problems: Problem[]) {
	return {
		id: c.id,
		time: c.contest_time,
		text: c.text,
		from_team: findById(teams, c.from_team_id),
		to_teams: findManyById(teams, c.to_team_ids),
		to_groups: findManyById(groups, c.to_group_ids),
		problem: findById(problems, c.problem_id)
	} as ClarificationData;
}

export const load = async ({ depends }) => {
	depends('data:clarifications');
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadGroups(), cc.loadTeams(), cc.loadProblems(), cc.loadClarifications()]);

	const problems = cc.getProblems();

	const teams = cc.getTeams();

	const groups = cc.getGroups();

	const clars = cc.getClarifications();

	const clarDataMap = new Map<string, ClarificationData>();
	for (const c of clars ?? []) {
		clarDataMap.set(c.id, createClarData(c, teams, groups, problems));
	}

	// Attach replies as children of their parent
	const rootClars: ClarificationData[] = [];
	for (const c of clars ?? []) {
		const data = clarDataMap.get(c.id)!;
		const parentId = c.reply_to_id;
		if (parentId) {
			const parent = clarDataMap.get(parentId);
			if (parent) {
				parent.replies ??= [];
				parent.replies.push(data);
			} else {
				rootClars.push(data);
			}
		} else {
			rootClars.push(data);
		}
	}

	return {
		clarifications: rootClars
	};
};
