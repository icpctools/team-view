/**
 * Copyright later.
 */
import type { HttpsOptions, OptionsOfTextResponseBody } from 'got';
import got, { HTTPError, RequestError } from 'got';
import type { Contest } from './contest-types';
import { ContestAPI } from './contest-api';
import { CONTEST } from './hardcoded.svelte';

export class Contests {
	contests: Contest[] | undefined;
	contestObjs: Contest[] | undefined;
	baseURL: string;

	constructor(baseURL: string) {
		if (!baseURL.endsWith('/')) {
			baseURL += '/';
		}
		this.baseURL = baseURL;
		console.log('Contest API URL: ' + this.baseURL);
	}

	public async loadContests() {
		const startTime = performance.now();
		try {
			const response = await got.get(this.baseURL + 'contests', this.getHttpOptions());
			this.contests = JSON.parse(response.body) as Contest[];
			const endTime = performance.now();
			console.log(`Fetched ${this.baseURL} in ${(endTime - startTime).toFixed(1)}ms`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error instanceof HTTPError) {
				throw new Error(`HTTP error ${error.response.statusCode} loading contests: ${error.response.statusMessage}`);
			} else if (error instanceof RequestError) {
				throw new Error(`Error loading contests: ${error.code}`);
			} else {
				throw new Error(`Unexpected error loading contests: ${error}`);
			}
		}
	}

	getHttpOptions(): OptionsOfTextResponseBody {
		const httpsOptions: HttpsOptions = {
			rejectUnauthorized: false
		};
		const options: OptionsOfTextResponseBody = {
			https: httpsOptions,
			retry: { limit: 0 },
			// specify short timeout
			timeout: {
				lookup: 2000,
				connect: 2000,
				secureConnect: 2000,
				socket: 2000,
				send: 10000,
				response: 2000
			}
		};

		/*if (options.https) {
			options.https.certificateAuthority = this.certificates.getAllCertificates();
		}*/

		return options;
	}

	getBaseURL(): string {
		return this.baseURL;
	}

	getContests(): Contest[] | undefined {
		return this.contests;
	}

	getContest(): ContestAPI | undefined {
		if (!this.contests || this.contests.length === 0) {
			return undefined;
		}
		let contestURL = this.baseURL + 'contests/';
		if (CONTEST.contest_id && CONTEST.contest_id.length > 0) {
			contestURL += CONTEST.contest_id;
		} else {
			contestURL += this.contests[0].id;
		}
		return new ContestAPI(contestURL);
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

	clear() {
		this.contests = [];
	}
}
