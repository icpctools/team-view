import { error } from '@sveltejs/kit';
import { loadContest } from '#lib/state.svelte.js';
import { getSubmissionData } from '../../lib/submissionData.js';

export const load = async ({ depends }) => {
	depends('app:problems', 'app:submissions', 'app:judgements');
	const cc = await loadContest();
	if (!cc) throw error(404);

	return {
		// for now only send the last 75 submissions
		submissions: getSubmissionData(cc, cc.getSubmissions().slice(-75)),
		scoreboardType: cc.getContest()?.scoreboard_type
	};
};
