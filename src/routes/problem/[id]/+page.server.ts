import { error } from '@sveltejs/kit';
import { loadContest } from '$lib/state.svelte.js';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getProblems())
		await cc.loadProblems();
	const problems = cc.getProblems();

	const problem = problems?.find((p) => p.id && p.id === params.params.id);
	if (!problem) throw error(404);
	
	if (!cc.getSubmissions())
		await cc.loadSubmissions();
	const submissions2 = cc.getSubmissions();

	const submissions = submissions2?.filter(s => s.problem_id === problem.id);

	return {
		problem: problem,
		submissions: submissions,
	};
};
