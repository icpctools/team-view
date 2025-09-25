import type { ContestAPI } from './contest-api';
import { Contests } from './contests';
import { CONTEST } from './hardcoded.svelte';

let contest: ContestAPI | undefined;

class Mutex {
  private locked: boolean = false;
  private queue: (() => void)[] = [];

  async lock() {
    if (this.locked) {
      return new Promise<void>(resolve => this.queue.push(resolve));
    }
    this.locked = true;
  }

  unlock() {
    this.locked = false;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    }
  }
}

const mutex = new Mutex();

export async function loadContest() {
	if (contest)
    	return contest;

	await mutex.lock();
	try {
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
	} finally {
		mutex.unlock();
	}	
}
