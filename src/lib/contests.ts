/**
 * Copyright later.
 */
import type { HttpsOptions, OptionsOfTextResponseBody } from 'got';
import got from 'got';
import type { ContestJSON } from './contest-types.ts';
import { Contest } from './contest.ts';

export class Contests {
	contests: ContestJSON[] | undefined;
	contestObjs: Contest[] | undefined;
	baseURL: string;

	constructor(baseURL: string) {
		if (!baseURL.endsWith('/')) baseURL += '/';
		this.baseURL = baseURL;
		console.log('Contest API URL: ' + this.baseURL);
	}

	public async loadContests() {
		const startTime = performance.now();
		try {
			const response = await got.get(this.baseURL + 'contests', this.getHttpOptions());
			this.contests = JSON.parse(response.body) as ContestJSON[];
			const endTime = performance.now();
			console.log(`Fetched ${this.baseURL} in ${endTime - startTime}ms`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (requestErr: any) {
			// unable to fetch the extensions
			// extract only the error message
			if (requestErr.message) {
				throw new Error(`Unable to fetch contests: ${String(requestErr.message)}`);
			} else {
				throw new Error(`Unable to fetch contests: ${String(requestErr)}`);
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
				response: 1000
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

	getContests(): ContestJSON[] | undefined {
		return this.contests;
	}

	getContest(): Contest | undefined {
		if (!this.contests || this.contests.length === 0) {
			return undefined;
		}
		let baseURL = this.baseURL;
		if (!baseURL.endsWith('/')) baseURL += '/';
		let contestURL = baseURL + 'contests/' + this.contests[0].id;
		const c: Contest = new Contest(contestURL);
		return c;
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
