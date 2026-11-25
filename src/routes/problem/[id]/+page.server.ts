import { error } from '@sveltejs/kit';
import { loadContest } from '#lib/state.svelte.js';
import { hasEndpointProperty } from '@icpctools/contest-api';
import { getSubmissionData } from '../../../lib/submissionData.js';

export const load = async ({ params, depends }) => {
	depends('app:problems', 'app:submissions', 'app:judgements');
	const cc = await loadContest();
	if (!cc) throw error(404);

	const problems = cc.getProblems();

	const problem = problems?.find((p) => p.id && p.id === params.id);
	if (!problem) throw error(404);

	const submissionData = getSubmissionData(
		cc,
		cc.getSubmissions().filter((s) => s.problem_id === problem.id)
	);

	return {
		problem: problem,
		submissions: submissionData,
		hasLanguage: hasEndpointProperty(cc.getAccess(), 'submissions', 'language_id'),
		hasFiles: hasEndpointProperty(cc.getAccess(), 'submissions', 'files'),
		hasReactions: hasEndpointProperty(cc.getAccess(), 'submissions', 'reaction'),
		scoreboard_type: cc.getContest()?.scoreboard_type
	};
};
