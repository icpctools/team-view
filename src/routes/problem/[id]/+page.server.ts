import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';
import { findById, findManyBySubmissionId, hasEndpointProperty } from '@icpctools/contest-api';
import type { Judgement, JudgementType } from '@icpctools/contest-api';
import type { SubmissionData } from '../../../lib/submissionData.js';

export const load = async ({ params, depends }) => {
	depends('app:problems', 'app:submissions', 'app:judgements');
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([
		cc.loadAccess(),
		cc.loadTeams(),
		cc.loadLanguages(),
		cc.loadProblems(),
		cc.loadJudgementTypes(),
		cc.loadSubmissions(),
		cc.loadJudgements()
	]);

	const problems = cc.getProblems();

	const problem = problems?.find((p) => p.id && p.id === params.id);
	if (!problem) throw error(404);

	const languages = cc.getLanguages();

	const teams = cc.getTeams();
	const orgs = cc.getOrganizations();

	const submissions2 = cc.getSubmissions();
	const submissions = submissions2?.filter((s) => s.problem_id === problem.id);

	const judgements = cc.getJudgements();
	const judgementTypes = cc.getJudgementTypes();

	const submissionData = submissions?.map((s) => {
		const jud = findManyBySubmissionId(judgements, s.id);
		let j: Judgement | undefined;
		if (jud && jud.length > 0) {
			// find current judgement
			j = jud.find((jj) => jj.current);

			// otherwise it is the first one
			if (!j) j = jud[0];
		}

		let judge = '';
		let jt: JudgementType | undefined;
		if (j) {
			jt = findById(judgementTypes, j.judgement_type_id);
			if (j.score != undefined) judge += j.score + '';
		}

		const team = findById(teams, s.team_id);
		const org = orgs?.find((o) => o.id === team?.organization_id);
		return {
			id: s.id,
			time: s.contest_time,
			team: team,
			logo: org?.logo,
			language: findById(languages, s.language_id),
			judgement: judge,
			judgementType: jt,
			files: s.files,
			reaction: s.reaction,
			problem: problem,
			auth: cc.getAuth()
		} as SubmissionData;
	});

	return {
		problem: problem,
		submissions: submissionData,
		hasReactions: hasEndpointProperty(cc.getAccess(), 'submissions', 'reaction')
	};
};
