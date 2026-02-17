import type { ContestAPI } from '@icpctools/contest-api';
import { Contests } from '@icpctools/contest-api';
import { CONTEST } from './hardcoded.svelte';

let contest: ContestAPI | undefined;

class Mutex {
	private locked: boolean = false;
	private queue: (() => void)[] = [];

	async lock(): Promise<void> {
		if (this.locked) {
			return new Promise<void>((resolve) => this.queue.push(resolve));
		}
		this.locked = true;
	}

	unlock(): void {
		this.locked = false;
		if (this.queue.length > 0) {
			const next = this.queue.shift();
			next?.();
		}
	}
}

const mutex = new Mutex();

export async function loadContest(): Promise<ContestAPI | undefined> {
	if (contest) return contest;

	await mutex.lock();
	try {
		if (contest) return contest;

		if (!CONTEST.url) {
			throw new Error('CONTEST.url is not defined');
		}

		const contests = new Contests(CONTEST.url, {
			user: CONTEST.user,
			password: CONTEST.password
		});
		await contests.loadContests();

		if (!contests) {
			console.log('error loading contests');
		}

		contest = contests.getContest(CONTEST?.contest_id);
		contest?.watch();
		return contest;
	} finally {
		mutex.unlock();
	}
}
