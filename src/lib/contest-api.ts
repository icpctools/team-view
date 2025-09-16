/**
 * Copyright later.
 */
import type { HttpsOptions, OptionsOfTextResponseBody } from 'got';
import got from 'got';
import type {
	Access,
	Account,
	Award,
	Clarification,
	Commentary,
	Contest,
	ContestState,
	FileReference,
	Group,
	Judgement,
	JudgementType,
	Language,
	Organization,
	Person,
	Problem,
	Run,
	Scoreboard,
	StartStatus,
	Submission,
	Team
} from './contest-types';
import { CONTEST } from './hardcoded.svelte';

export class ContestAPI {
	contest?: Contest;
	access?: Access;
	state?: ContestState;
	organizations?: Organization[];
	groups?: Group[];
	teams?: Team[];
	persons?: Person[];
	accounts?: Account[];
	account?: Account;
	languages?: Language[];
	judgementTypes?: JudgementType[];
	problems?: Problem[];
	submissions?: Submission[];
	judgements?: Judgement[];
	runs?: Run[];
	clarifications?: Clarification[];
	commentary?: Commentary[];
	awards?: Award[];
	startStatus?: StartStatus[];
	scoreboard?: Scoreboard;

	contestURL: string;
	baseURL: string;
	serverURL: string;

	timeDelta = [];

	constructor(contestURL: string) {
		if (!contestURL.endsWith('/')) {
			contestURL += '/';
		}
		this.contestURL = contestURL;

		// base url, e.g. http://example.com/api/
		const bInd = this.contestURL.indexOf('/api/contests/');
		this.baseURL = this.contestURL.substring(0, bInd + 5);

		// server url, e.g. http://example.com
		const sInd = this.contestURL.indexOf('//');
		const sInd2 = this.contestURL.indexOf('/', sInd + 2);
		this.serverURL = this.contestURL.substring(0, sInd2);

		console.log('Contest URL: ' + this.contestURL);
	}

	getURL(type: any, id?: string) {
		if (id == null) {
			return this.contestURL + type;
		}
		return this.contestURL + type + '/' + id;
	}

	getHttpOptions(): OptionsOfTextResponseBody {
		const httpsOptions: HttpsOptions = {
			rejectUnauthorized: false
		};
		const user = CONTEST.user;
		const password = CONTEST.password;
		const options: OptionsOfTextResponseBody = {
			https: httpsOptions,
			retry: { limit: 0 },
			username: user,
			password: password,
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

	async loadObject(type: any): Promise<any> {
		console.log('Loading contest ' + type);
		const startTime = performance.now();
		try {
			const url = this.getURL(type);
			const response = await got.get(url, this.getHttpOptions());
			const obj = JSON.parse(response.body);
			const endTime = performance.now();
			console.log(`Fetched ${url} in ${endTime - startTime}ms`);
			this.processFileReferences(obj);
			return obj;
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
		/*return $.ajax({
			url: this.getURL(type),
			success: (result, status, xhr) => {
				var time = xhr.getResponseHeader("ICPC-Time");
				var d = null;
				if (time == null)
					d = new Date(xhr.getResponseHeader("Date"));
				else
					d = new Date(parseInt(time));
					
					this.end = Date.now();
				var serverTime = (Date.now() - d.getTime()) - (this.end - this.start) / 2;
				if (this.timeDelta.length > 4)
					this.timeDelta.shift();
				this.timeDelta.push(serverTime);
				ok(result);
			}
		});*/
	}

	async loadContest(force?: boolean): Promise<void> {
		if (force || !this.contest) {
			this.contest = await this.loadObject('');
		}
	}

	async loadAccess(force?: boolean): Promise<void> {
		if (force || !this.access) {
			this.access = await this.loadObject('access');
		}
	}

	async loadState(force?: boolean): Promise<void> {
		if (force || !this.state) {
			this.state = await this.loadObject('state');
		}
	}

	async loadStartStatus(force?: boolean): Promise<void> {
		if (force || !this.startStatus) {
			this.startStatus = await this.loadObject('start-status');
		}
	}

	async loadLanguages(force?: boolean): Promise<void> {
		if (force || !this.languages) {
			this.languages = await this.loadObject('languages');
		}
	}

	async loadJudgementTypes(force?: boolean): Promise<void> {
		if (force || !this.judgementTypes) {
			this.judgementTypes = await this.loadObject('judgement-types');
		}
	}

	async loadProblems(force?: boolean): Promise<void> {
		if (force || !this.problems) {
			const problems2: Problem[] = await this.loadObject('problems');
			problems2.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
			this.problems = problems2;
		}
	}

	async loadGroups(force?: boolean): Promise<void> {
		if (force || !this.groups) {
			this.groups = await this.loadObject('groups');
		}
	}

	async loadOrganizations(force?: boolean): Promise<void> {
		if (force || !this.organizations) {
			this.organizations = await this.loadObject('organizations');
		}
	}

	async loadTeams(force?: boolean): Promise<void> {
		if (force || !this.teams) {
			const teams2: Team[] = await this.loadObject('teams');
			// sort by team id
			teams2.sort((a, b) => {
				// try parsing as number first
				const an = parseInt(a.id);
				const bn = parseInt(b.id);
				if (!Number.isNaN(an) && !Number.isNaN(bn)) {
					return an - bn;
				}
				// otherwise compare by locale
				return a.id.localeCompare(b.id);
			});
			this.teams = teams2;
		}
	}

	async loadPersons(force?: boolean): Promise<void> {
		if (force || !this.persons) {
			this.persons = await this.loadObject('persons');
		}
	}

	async loadAccounts(force?: boolean): Promise<void> {
		if (force || !this.accounts) {
			this.accounts = await this.loadObject('accounts');
		}
	}

	async loadAccount(force?: boolean): Promise<void> {
		if (force || !this.account) {
			this.account = await this.loadObject('account');
		}
	}

	async loadSubmissions(force?: boolean): Promise<void> {
		if (force || !this.submissions) {
			this.submissions = await this.loadObject('submissions');
		}
	}

	async loadJudgements(force?: boolean): Promise<void> {
		if (force || !this.judgements) {
			this.judgements = await this.loadObject('judgements');
		}
	}

	async loadRuns(force?: boolean): Promise<void> {
		if (force || !this.runs) {
			this.runs = await this.loadObject('runs');
		}
	}

	async loadClarifications(force?: boolean): Promise<void> {
		if (force || !this.clarifications) {
			this.clarifications = await this.loadObject('clarifications');
		}
	}

	async loadCommentary(force?: boolean): Promise<void> {
		if (force || !this.commentary) {
			this.commentary = await this.loadObject('commentary');
		}
	}

	async loadScoreboard(force?: boolean): Promise<void> {
		if (force || !this.scoreboard) {
			const scoreboard2: Scoreboard = await this.loadObject('scoreboard');
			scoreboard2.rows.sort((a, b) => {
				return a.rank - b.rank;
			});

			this.scoreboard = scoreboard2;
		}
	}

	async loadAwards(force?: boolean): Promise<void> {
		if (force || !this.awards) {
			this.awards = await this.loadObject('awards');
		}
	}

	getContestURL(): string {
		return this.contestURL;
	}
	getContest(): Contest | undefined {
		return this.contest;
	}
	getAccess() {
		return this.access;
	}
	getState(): ContestState | undefined {
		return this.state;
	}
	getStartStatus() {
		return this.startStatus;
	}
	getLanguages(): Language[] {
		return this.languages || [];
	}
	getJudgementTypes(): JudgementType[] {
		return this.judgementTypes || [];
	}
	getProblems(): Problem[] {
		return this.problems || [];
	}
	getGroups(): Group[] {
		return this.groups || [];
	}
	getTeams(): Team[] {
		return this.teams || [];
	}
	getOrganizations(): Organization[] {
		return this.organizations || [];
	}
	getPersons(): Person[] {
		return this.persons || [];
	}
	getAccounts(): Account[] {
		return this.accounts || [];
	}
	getAccount(): Account | undefined {
		return this.account;
	}
	getSubmissions(): Submission[] {
		return this.submissions || [];
	}
	getJudgements(): Judgement[] {
		return this.judgements || [];
	}
	getRuns(): Run[] {
		return this.runs || [];
	}
	getClarifications(): Clarification[] {
		return this.clarifications || [];
	}
	getCommentary(): Commentary[] {
		return this.commentary || [];
	}
	getScoreboard(): Scoreboard | undefined {
		return this.scoreboard;
	}
	getAwards(): Award[] {
		return this.awards || [];
	}

	getTimeDelta() {
		if (this.timeDelta.length == 0) return 0;
		let total = 0;
		this.timeDelta.forEach(function (item) {
			total += item;
		});
		return total / this.timeDelta.length;
	}

	resolveURL(ref: FileReference | undefined): string | undefined {
		if (!ref || !ref.href) {
			return undefined;
		}
		// If href is already absolute, return as-is
		if (ref.href.startsWith('http://') || ref.href.startsWith('https://')) {
			return ref.href;
		}
		// Prepend server-relative URLs
		if (ref.href.startsWith('/')) {
			return this.serverURL + ref.href;
		}
		// ... and base-relative URLs
		return this.baseURL + ref.href;
	}

	private isFileReference(obj: any): obj is FileReference {
		if (!(typeof obj === 'object' && 'href' in obj && 'mime' in obj)) {
			return false;
		}
		return true;
	}

	private processFileReferences(obj: any) {
		// We get either one object or an array of objects, handle both cases
		let objs: any[];
		if (Array.isArray(obj)) {
			objs = obj;
		} else {
			objs = [obj];
		}
		for (const obj of objs) {
			for (const key in obj) {
				const prop = obj[key];
				if (!Array.isArray(prop)) {
					continue;
				}

				for (const item of prop) {
					if (this.isFileReference(item)) {
						item.href = this.resolveURL(item) || item.href;
					}
				}
			}
		}
	}
}
