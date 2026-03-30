import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';
import { findById, findManyBySubmissionId } from '@icpctools/contest-api';
import type { Judgement } from '@icpctools/contest-api';
import type { SubmissionData } from '../../lib/submissionData.js';

export const load = async ({ depends }) => {
	depends('app:problems', 'app:submissions', 'app:judgements');
	const cc = await loadContest();
	if (!cc) throw error(404);

	const problems = cc.getProblems();
	const languages = cc.getLanguages();
	const teams = cc.getTeams();
	const orgs = cc.getOrganizations();
	const submissions = cc.getSubmissions();
	const judgements = cc.getJudgements();
	const judgementTypes = cc.getJudgementTypes();

	// for now only send the last 75 submissions
	const submissionData = submissions
		?.map((s) => {
			const jud = findManyBySubmissionId(judgements, s.id);
			let j: Judgement | undefined;
			if (jud && jud.length > 0) {
				// find current judgement
				j = jud.find((jj) => jj.current);

				// otherwise it is the first one
				if (!j) j = jud[0];
			}

			const team = findById(teams, s.team_id);
			return {
				id: s.id,
				time: s.contest_time,
				team: team,
				language: findById(languages, s.language_id),
				judgement: j,
				judgementType: findById(judgementTypes, j?.judgement_type_id),
				files: s.files,
				reaction: s.reaction,
				problem: findById(problems, s.problem_id),
				auth: cc.getAuth(),
				logo: findById(orgs, team?.organization_id)?.logo
			} as SubmissionData;
		})
		.slice(-75);

	return {
		submissions: submissionData,
		scoreboardType: cc.getContest()?.scoreboard_type
	};
};
