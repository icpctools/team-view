import type { ContestAPI, Team } from '@icpctools/contest-api';
import { Contests } from '@icpctools/contest-api';
import { CONFIG, CONTEST } from './hardcoded.svelte';

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
		if (this.queue.length > 0) {
			const next = this.queue.shift();
			next?.();
		} else {
			this.locked = false;
		}
	}
}

const mutex = new Mutex();

export async function loadContest(): Promise<ContestAPI | undefined> {
	if (contest) {
		return contest;
	}

	await mutex.lock();
	try {
		if (contest) {
			return contest;
		}

		if (!CONTEST.url) {
			console.error('CONTEST.url is not defined');
			return undefined;
		}

		if (CONFIG.proxy) {
			console.log('Proxy server enabled');
		}

		const contests = new Contests(
			CONTEST.url,
			{
				user: CONTEST.user,
				password: CONTEST.password
			},
			CONFIG.proxy ? '/api/proxy' : undefined
		);
		await contests.loadContests();

		if (!contests) {
			console.log('error loading contests');
		}

		contest = contests.getContest(CONTEST?.contest_id);
		contest?.addContestModifier((n) => n.type !== 'runs');

		// if video feeds are disabled, strip them from team data so they're never exposed to the client
		if (!CONFIG.desktop || !CONFIG.webcam) {
			contest?.addContestModifier((n) => {
				if (n.type === 'teams' && n.data) {
					const teams = (Array.isArray(n.data) ? n.data : [n.data]) as Team[];
					for (const team of teams) {
						if (!CONFIG.desktop) delete team.desktop;
						if (!CONFIG.webcam) delete team.webcam;
					}
				}
				return true;
			});
		}

		await contest?.watch();
		return contest;
	} catch (error) {
		console.error('Error loading contest:', error);
		return undefined;
	} finally {
		mutex.unlock();
	}
}
