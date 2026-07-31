import type { Contest } from './contest-types.js';
import { ContestAPI, type Credentials } from './contest-api.js';
import { fetchOptions } from './fetch-utils.js';

export class Contests {
	contests: Contest[] | undefined;
	contestObjs: Contest[] | undefined;
	baseURL: string;
	credentials?: Credentials;
	proxyURL?: string;

	constructor(baseURL: string, credentials?: Credentials, proxyURL?: string) {
		if (!baseURL.endsWith('/')) {
			baseURL += '/';
		}
		this.baseURL = baseURL;
		this.credentials = credentials;
		this.proxyURL = proxyURL;
		console.log('Contest API URL: ' + this.baseURL);
	}

	public async loadContests(): Promise<void> {
		const url = this.baseURL + 'contests';
		const startTime = performance.now();
		try {
			const response = await fetch(url, fetchOptions(this.credentials));
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status} loading contests: ${response.statusText}`);
			}
			this.contests = JSON.parse(await response.text()) as Contest[];
			const endTime = performance.now();
			console.log(`Fetched ${this.baseURL} in ${(endTime - startTime).toFixed(1)}ms`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Error loading contests: ${error.message}`, { cause: error });
			}
			throw new Error(`Unexpected error loading contests: ${error}`, { cause: error });
		}
	}

	getBaseURL(): string {
		return this.baseURL;
	}

	getContests(): Contest[] | undefined {
		return this.contests;
	}

	getContest(contestId?: string): ContestAPI | undefined {
		if (!this.contests || this.contests.length === 0) {
			return undefined;
		}
		let contestURL = this.baseURL + 'contests/';
		if (contestId && contestId.length > 0) {
			contestURL += contestId;
		} else {
			contestURL += this.contests[0].id;
		}
		return new ContestAPI(contestURL, this.credentials, this.proxyURL);
	}

	getContestObjs(): Contest[] | undefined {
		if (this.contestObjs != null) return this.contestObjs;

		this.contests = [];
		/*for (var i = 0; i < this.contests.length; i++) {
			let c = new Contest(this.baseURL, this.contests[i].id);
			c.info = this.contests[i];
			contests.push(c);
		}*/
		//this.contestObjs = contests;
		return this.contestObjs;
	}

	clear(): void {
		this.contests = [];
	}
}
