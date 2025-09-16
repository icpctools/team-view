import type { ContestAPI } from './contest-api';
import { Contests } from './contests';
import { CONTEST } from './hardcoded.svelte';

let contest: ContestAPI | undefined;

export async function loadContest() {
	if (contest)
    	return contest;

	const contestsImpl = new Contests(CONTEST.url);
	await contestsImpl.loadContests();

	if (!contestsImpl) {
		console.log('error loading contests');
	}

	contest = contestsImpl.getContest();
	contest?.watch();
	return contest;
}
