import { Contests } from './contests';
import { CONTEST } from './hardcoded.svelte';

export async function loadContest() {
	const contestsImpl = new Contests(CONTEST.url);
	await contestsImpl.loadContests();

	if (!contestsImpl) {
		console.log('error loading contests');
	}

	return contestsImpl.getContest();
}
