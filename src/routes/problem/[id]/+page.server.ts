import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';
import { timeToMin } from '$lib/contest-time-util';
import type { JudgementJSON, JudgementTypeJSON } from '$lib/contest-types';
import { ContestUtil } from '$lib/contest-util';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([cc.loadTeams(), cc.loadLanguages(), cc.loadProblems(),
		cc.loadJudgementTypes(), cc.loadSubmissions(), cc.loadJudgements()
	]);

	const problems = cc.getProblems();

	const problem = problems?.find((p) => p.id && p.id === params.params.id);
	if (!problem) throw error(404);

	const languages = cc.getLanguages();

	const teams = cc.getTeams();

	const submissions2 = cc.getSubmissions();
	const submissions = submissions2?.filter(s => s.problem_id === problem.id);

	const judgements = cc.getJudgements();
	const judgementTypes = cc.getJudgementTypes();
	
	const util = new ContestUtil();
	const submissionData = submissions?.map((s)=> {
		const jud = util.findManyBySubmissionId(judgements, s.id);
		let j: JudgementJSON | undefined;
		if (jud && jud.length > 0) {
			// find current judgement
			j = jud.find(jj => jj.current);

			// otherwise it is the first one
			if (!j)
				j = jud[0];
		}
		
		let judge = '';
		let jt: JudgementTypeJSON | undefined;
		if (j) {
			jt = util.findById(judgementTypes, j.judgement_type_id);
			if (j.score != undefined)
				judge += j.score + '';
		}
		return {
			time: timeToMin(s.contest_time),
			team: util.findById(teams, s.team_id),
			language: util.findById(languages, s.language_id)?.name,
			judgement: judge,
			judgement_type: jt
		};
	});

	return {
		problem: problem,
		submissions: submissionData,
	};
};
