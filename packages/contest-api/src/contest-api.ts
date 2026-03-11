/**
 * Copyright later.
 */
import type { HttpsOptions, OptionsOfTextResponseBody } from 'got';
import got, { HTTPError, RequestError } from 'got';
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
	Id,
	Judgement,
	JudgementType,
	Language,
	MapInfo,
	Notification,
	Organization,
	Person,
	Problem,
	Run,
	Scoreboard,
	StartStatus,
	Submission,
	Team
} from './contest-types.js';

export interface Credentials {
	user?: string;
	password?: string;
}

export class ContestAPI {
	private contest?: Contest;
	private access?: Access;
	private state?: ContestState;
	private organizations?: Organization[];
	private groups?: Group[];
	private teams?: Team[];
	private persons?: Person[];
	private accounts?: Account[];
	private account?: Account;
	private languages?: Language[];
	private judgementTypes?: JudgementType[];
	private problems?: Problem[];
	private submissions?: Submission[];
	private judgements?: Judgement[];
	private runs?: Run[];
	private clarifications?: Clarification[];
	private commentary?: Commentary[];
	private awards?: Award[];
	private startStatus?: StartStatus[];
	private scoreboard?: Scoreboard;
	private mapInfo?: MapInfo;

	private id: string;
	private contestURL: string;
	private baseURL: string;
	private serverURL: string;
	private credentials?: Credentials;

	private timeDelta = [];

	private interval: number | NodeJS.Timeout | undefined;

	private unknownTypes: string[] = [];

	constructor(contestURL: string, credentials?: Credentials) {
		if (!contestURL.endsWith('/')) {
			contestURL += '/';
		}
		this.contestURL = contestURL;
		this.credentials = credentials;

		// base url, e.g. http://example.com/api/
		const bInd = this.contestURL.indexOf('/api/contests/');
		this.baseURL = this.contestURL.substring(0, bInd + 5);
		this.id = this.contestURL.substring(bInd + 14, this.contestURL.length - 1);

		// server url, e.g. http://example.com
		const sInd = this.contestURL.indexOf('//');
		const sInd2 = this.contestURL.indexOf('/', sInd + 2);
		this.serverURL = this.contestURL.substring(0, sInd2);

		//console.log('Contest URL: ' + this.contestURL);
	}

	getURL(type: string, id?: string): string {
		if (id == null) {
			return this.contestURL + type;
		}
		return this.contestURL + type + '/' + id;
	}

	getHttpOptions(): OptionsOfTextResponseBody {
		const httpsOptions: HttpsOptions = {
			rejectUnauthorized: false
		};
		const options: OptionsOfTextResponseBody = {
			https: httpsOptions,
			retry: { limit: 0 },
			username: this.credentials?.user,
			password: this.credentials?.password,
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async loadObject(type: string): Promise<any> {
		const startTime = performance.now();
		const url = this.getURL(type);
		try {
			const response = await got(url, this.getHttpOptions());
			const obj = JSON.parse(response.body);
			const endTime = performance.now();
			console.log(`Fetched ${url} in ${(endTime - startTime).toFixed(1)}ms`);
			this.processFileReferences(obj);
			return obj;
		} catch (error: unknown) {
			if (error instanceof HTTPError) {
				throw new Error(`HTTP error ${error.response.statusCode} loading ${url}: ${error.response.statusMessage}`, {
					cause: error
				});
			} else if (error instanceof RequestError) {
				throw new Error(`Error loading ${url}: ${error.code}`, { cause: error });
			} else {
				throw new Error(`Unexpected error loading ${url}: ${error}`, { cause: error });
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

	private sortProblems(problems2: Problem[]): Problem[] {
		return problems2.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
	}

	async loadProblems(force?: boolean): Promise<void> {
		if (force || !this.problems) {
			this.problems = this.sortProblems(await this.loadObject('problems'));
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

	private sortTeams(teams2: Team[]): Team[] {
		// sort by team id
		return teams2.sort((a, b) => {
			// try parsing as number first
			const an = parseInt(a.id);
			const bn = parseInt(b.id);
			if (!Number.isNaN(an) && !Number.isNaN(bn)) {
				return an - bn;
			}
			// otherwise compare by locale
			return a.id.localeCompare(b.id);
		});
	}

	async loadTeams(force?: boolean): Promise<void> {
		if (force || !this.teams) {
			this.teams = this.sortTeams(await this.loadObject('teams'));
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

	async loadMapInfo(force?: boolean): Promise<void> {
		if (force || !this.mapInfo) {
			this.mapInfo = await this.loadObject('map-info');
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
	getMapInfo(): MapInfo | undefined {
		return this.mapInfo;
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

	private isFileReference(obj: unknown): obj is FileReference {
		if (obj == null || !(typeof obj === 'object' && 'href' in obj && 'mime' in obj)) {
			return false;
		}
		return true;
	}

	private processFileReferences(obj: unknown) {
		// We get either one object or an array of objects, handle both cases
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	getAuth() {
		return btoa(this.credentials?.user + ':' + this.credentials?.password);
	}

	private processNotificationSingleton(type: string, data: object) {
		// update a 'singleton' object, e.g. contest, state
		switch (type) {
			case 'contest': {
				this.contest = data as Contest;
				return;
			}
			case 'state': {
				this.state = data as ContestState;
				return;
			}
			case 'mapInfo': {
				this.mapInfo = data as MapInfo;
				break;
			}
			default: {
				if (!this.unknownTypes.includes(type)) {
					console.log('Unknown singleton type in feed: ' + type);
					this.unknownTypes.push(type);
				}
			}
		}
	}

	private processData(
		id: Id | undefined,
		arr: { id: Id }[] | undefined,
		obj: { id: Id } | { id: Id }[] | undefined
	): { id: Id }[] {
		if (Array.isArray(obj)) {
			if (id) {
				console.log('Event can never have id and data array');
				return arr ?? [];
			}
			return obj;
		}

		if (!arr || arr.length === 0) {
			// deletion on empty array
			if (!obj) {
				return [];
			}

			return [obj];
		}

		// search for existing object to replace
		let index = -1;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].id === id) {
				index = i;
				break;
			}
		}

		// deletion
		if (obj === undefined) {
			if (index >= 0) {
				arr.splice(index, 1);
			}
			return arr;
		}

		// replacement
		if (index >= 0) {
			arr[index] = obj;
			return arr;
		}

		// addition
		arr.push(obj);
		return arr;
	}

	processNotification(n: Notification): void {
		if (!n.id && !Array.isArray(n.data)) {
			// no id and not an array: must be a 'singleton' object (e.g. state)
			this.processNotificationSingleton(n.type, n.data ?? {});
			return;
		}

		const data = n.data as { id: Id } | undefined;
		switch (n.type) {
			case 'judgement-types': {
				this.judgementTypes = this.processData(n.id, this.judgementTypes, data) as JudgementType[];
				break;
			}
			case 'languages': {
				this.languages = this.processData(n.id, this.languages, data) as Language[];
				break;
			}
			case 'problems': {
				this.problems = this.sortProblems(this.processData(n.id, this.problems, data) as Problem[]);
				break;
			}
			case 'groups': {
				this.groups = this.processData(n.id, this.groups, data) as Group[];
				break;
			}
			case 'organizations': {
				this.organizations = this.processData(n.id, this.organizations, data) as Organization[];
				break;
			}
			case 'teams': {
				this.teams = this.sortTeams(this.processData(n.id, this.teams, data) as Team[]);
				break;
			}
			case 'persons': {
				this.persons = this.processData(n.id, this.persons, data) as Person[];
				break;
			}
			case 'accounts': {
				this.accounts = this.processData(n.id, this.accounts, data) as Account[];
				break;
			}
			case 'submissions': {
				this.submissions = this.processData(n.id, this.submissions, data) as Submission[];
				break;
			}
			case 'judgements': {
				this.judgements = this.processData(n.id, this.judgements, data) as Judgement[];
				break;
			}
			case 'runs': {
				this.runs = this.processData(n.id, this.runs, data) as Run[];
				break;
			}
			case 'clarifications': {
				this.clarifications = this.processData(n.id, this.clarifications, data) as Clarification[];
				break;
			}
			case 'awards': {
				this.awards = this.processData(n.id, this.awards, data) as Award[];
				break;
			}
			case 'commentary': {
				this.commentary = this.processData(n.id, this.commentary, data) as Commentary[];
				break;
			}
			case 'start-status': {
				this.startStatus = this.processData(n.id, this.startStatus, data) as StartStatus[];
				break;
			}
			default: {
				if (!this.unknownTypes.includes(n.type)) {
					console.log('Unknown type in feed: ' + n.type);
					this.unknownTypes.push(n.type);
				}
			}
		}
	}

	watch(): void {
		if (this.interval) {
			return;
		}
		console.log(`Watching ${this.id}`);
		this.interval = setInterval(async () => {
			console.log(`Invalidating ${this.id}`);
			try {
				if (this.contest) {
					await this.loadContest(true);
				}
				if (this.submissions) {
					await this.loadSubmissions(true);
				}
				if (this.judgements) {
					await this.loadJudgements(true);
				}
				if (this.clarifications) {
					await this.loadClarifications(true);
				}
				if (this.scoreboard) {
					await this.loadScoreboard(true);
				}
			} catch (error: unknown) {
				console.error(`Error reloading contest data: ${error}`);
			}
		}, 5000);
	}

	unwatch(): void {
		if (!this.interval) {
			return;
		}
		clearInterval(this.interval);
	}
}
