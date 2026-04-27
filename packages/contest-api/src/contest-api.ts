/**
 * Contest API for getting data from a single contest. There are two basic ways of
 * using it: calling loadXxx() on individual contest endpoints, or using
 * watch() to connect to an event feed. After doing either, call getXxx() to get
 * contest data.
 */
import type { OptionsInit, OptionsOfTextResponseBody } from 'got';
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
	Team,
	Version
} from './contest-types.js';
import readline from 'node:readline';

export interface Credentials {
	user?: string;
	password?: string;
}

export type ContestEvent = {
	type: string;
	id?: Id;
};

export type FeedOptions = {
	ignore?: string[];
};

export type ContestListener = (event: ContestEvent) => void;

class InitialLoadGate {
	private loaded: boolean = false;
	private queue: (() => void)[] = [];
	private timeoutId?: NodeJS.Timeout;

	async wait(): Promise<void> {
		if (this.loaded) {
			return;
		}

		// start timeout on first call
		if (!this.timeoutId) {
			this.timeoutId = setTimeout(() => {
				if (this.loaded) {
					return;
				}
				console.log('Initial contest load timeout reached');
				this.release();
			}, 10000);
		}

		return new Promise<void>((resolve) => {
			this.queue.push(resolve);
		});
	}

	release(): void {
		this.loaded = true;
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
		// release all waiting threads
		while (this.queue.length > 0) {
			const resolve = this.queue.shift();
			resolve?.();
		}
	}
}

const initialLoadGate = new InitialLoadGate();

export class ContestAPI {
	private version?: Version;
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
	private proxyURL?: string;
	private credentials?: Credentials;

	private timeDelta = [];

	private interval: number | NodeJS.Timeout | undefined;

	private unknownTypes: string[] = [];

	private changeListeners: ContestListener[] = [];

	private scoreboardInvalid: boolean = false;

	private ignore: string[] = [];

	private shouldReconnect: boolean = false;

	constructor(contestURL: string, credentials?: Credentials, proxyURL?: string) {
		if (!contestURL.endsWith('/')) {
			contestURL += '/';
		}
		this.contestURL = contestURL;
		this.credentials = credentials;
		this.proxyURL = proxyURL;

		const bInd = this.contestURL.indexOf('/api/contests/');
		this.id = this.contestURL.substring(bInd + 14, this.contestURL.length - 1);

		// base url, e.g. http://example.com/api/
		this.baseURL = this.contestURL.substring(0, bInd + 5);

		// server url, e.g. http://example.com
		const sInd = this.contestURL.indexOf('//');
		const sInd2 = this.contestURL.indexOf('/', sInd + 2);
		this.serverURL = this.contestURL.substring(0, sInd2);

		//console.log('Contest URL: ' + this.contestURL);
	}

	getURL(type: string, id?: string): string {
		if (id == null) {
			if (type === 'contest') {
				return this.contestURL;
			} else if (type === 'version') {
				return this.baseURL;
			}
			return this.contestURL + type;
		}
		return this.contestURL + type + '/' + id;
	}

	getHttpOptions(): OptionsOfTextResponseBody {
		return {
			https: {
				rejectUnauthorized: false
				//certificateAuthority = this.certificates.getAllCertificates();
			},
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
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async loadObject(type: string): Promise<any> {
		const startTime = performance.now();
		const url = this.getURL(type);
		try {
			const response = await got(url, this.getHttpOptions());
			const obj = JSON.parse(response.body, (_key, value) => {
				return value === null ? undefined : value;
			});
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

	async loadVersion(force?: boolean): Promise<void> {
		if (force || !this.version) {
			this.version = await this.loadObject('version');
		}
	}

	async loadContest(force?: boolean): Promise<void> {
		if (force || !this.contest) {
			this.contest = await this.loadObject('contest');
			this.fireChange({ type: 'contest' });
		}
	}

	async loadAccess(force?: boolean): Promise<void> {
		if (force || !this.access) {
			this.access = await this.loadObject('access');
			this.fireChange({ type: 'access' });
		}
	}

	async loadState(force?: boolean): Promise<void> {
		if (force || !this.state) {
			this.state = await this.loadObject('state');
			this.fireChange({ type: 'state' });
		}
	}

	async loadStartStatus(force?: boolean): Promise<void> {
		if (force || !this.startStatus) {
			this.startStatus = await this.loadObject('start-status');
			this.fireChange({ type: 'start-status' });
		}
	}

	async loadLanguages(force?: boolean): Promise<void> {
		if (force || !this.languages) {
			this.languages = await this.loadObject('languages');
			this.fireChange({ type: 'languages' });
		}
	}

	async loadJudgementTypes(force?: boolean): Promise<void> {
		if (force || !this.judgementTypes) {
			this.judgementTypes = await this.loadObject('judgement-types');
			this.fireChange({ type: 'judgement-types' });
		}
	}

	private sortProblems(problems2: Problem[]): Problem[] {
		return problems2.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
	}

	async loadProblems(force?: boolean): Promise<void> {
		if (force || !this.problems) {
			this.problems = this.sortProblems(await this.loadObject('problems'));
			this.fireChange({ type: 'problems' });
		}
	}

	async loadGroups(force?: boolean): Promise<void> {
		if (force || !this.groups) {
			this.groups = await this.loadObject('groups');
			this.fireChange({ type: 'groups' });
		}
	}

	async loadOrganizations(force?: boolean): Promise<void> {
		if (force || !this.organizations) {
			this.organizations = await this.loadObject('organizations');
			this.fireChange({ type: 'organizations' });
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
			this.fireChange({ type: 'teams' });
		}
	}

	async loadPersons(force?: boolean): Promise<void> {
		if (force || !this.persons) {
			this.persons = await this.loadObject('persons');
			this.fireChange({ type: 'persons' });
		}
	}

	async loadAccounts(force?: boolean): Promise<void> {
		if (force || !this.accounts) {
			this.accounts = await this.loadObject('accounts');
			this.fireChange({ type: 'accounts' });
		}
	}

	async loadAccount(force?: boolean): Promise<void> {
		if (force || !this.account) {
			this.account = await this.loadObject('account');
			this.fireChange({ type: 'account' });
		}
	}

	async loadSubmissions(force?: boolean): Promise<void> {
		if (force || !this.submissions) {
			this.submissions = await this.loadObject('submissions');
			this.fireChange({ type: 'submissions' });
		}
	}

	async loadJudgements(force?: boolean): Promise<void> {
		if (force || !this.judgements) {
			this.judgements = await this.loadObject('judgements');
			this.fireChange({ type: 'judgements' });
		}
	}

	async loadRuns(force?: boolean): Promise<void> {
		if (force || !this.runs) {
			this.runs = await this.loadObject('runs');
			this.fireChange({ type: 'runs' });
		}
	}

	async loadClarifications(force?: boolean): Promise<void> {
		if (force || !this.clarifications) {
			this.clarifications = await this.loadObject('clarifications');
			this.fireChange({ type: 'clarifications' });
		}
	}

	async loadCommentary(force?: boolean): Promise<void> {
		if (force || !this.commentary) {
			this.commentary = await this.loadObject('commentary');
			this.fireChange({ type: 'commentary' });
		}
	}

	async loadScoreboard(force?: boolean): Promise<void> {
		if (force || !this.scoreboard) {
			const scoreboard2: Scoreboard = await this.loadObject('scoreboard');
			scoreboard2.rows.sort((a, b) => {
				return a.rank - b.rank;
			});

			this.scoreboard = scoreboard2;
			this.fireChange({ type: 'scoreboard' });
		}
	}

	async loadAwards(force?: boolean): Promise<void> {
		if (force || !this.awards) {
			this.awards = await this.loadObject('awards');
			this.fireChange({ type: 'awards' });
		}
	}

	async loadMapInfo(force?: boolean): Promise<void> {
		if (force || !this.mapInfo) {
			this.mapInfo = await this.loadObject('map-info');
			this.fireChange({ type: 'map-info' });
		}
	}

	getContestURL(): string {
		return this.contestURL;
	}
	getVersion(): Version | undefined {
		return this.version;
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

	resolveClientURL(ref: FileReference): string | undefined {
		if (!ref || !ref.href) {
			return undefined;
		}
		// If href is already absolute, return as-is
		if (ref.href.startsWith('http://') || ref.href.startsWith('https://')) {
			return ref.href;
		}
		// Prepend server-relative URLs
		if (ref.href.startsWith('/')) {
			if (this.proxyURL) {
				return this.proxyURL + '/api' + ref.href;
			}
			return this.serverURL + ref.href;
		}
		// ... and base-relative URLs
		if (this.proxyURL) {
			return this.proxyURL + '/' + ref.href;
		}
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
						item.href = this.resolveClientURL(item) || item.href;
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
				const obj = data as Contest;
				this.processFileReferences(obj);
				this.contest = obj;
				initialLoadGate.release();
				return;
			}
			case 'state': {
				this.state = data as ContestState;
				return;
			}
			case 'map-info': {
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
		obj: { id: Id } | { id: Id }[] | undefined | null
	): { id: Id }[] {
		if (Array.isArray(obj)) {
			if (id) {
				console.log('Event can never have id and data array');
				return arr ?? [];
			}

			obj.forEach((obj) => this.processFileReferences(obj));
			return obj;
		}

		if (!arr || arr.length === 0) {
			// deletion on empty array
			if (!obj) {
				return [];
			}

			this.processFileReferences(obj);
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
		if (obj === undefined || obj === null) {
			if (index >= 0) {
				arr.splice(index, 1);
			}
			return arr;
		}

		// replacement
		if (index >= 0) {
			this.processFileReferences(obj);
			arr[index] = obj;
			return arr;
		}

		// addition
		this.processFileReferences(obj);
		arr.push(obj);
		return arr;
	}

	processNotification(n: Notification): void {
		if (this.ignore.includes(n.type)) {
			return;
		}
		if ((!n.id || n.type === 'contest') && !Array.isArray(n.data)) {
			// no id and not an array: must be a 'singleton' object (e.g. state)
			this.processNotificationSingleton(n.type, n.data ?? {});
			this.fireChange({ type: n.type, id: n.id });
			return;
		}

		const data = n.data as { id: Id } | null | undefined;
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

		this.fireChange({ type: n.type, id: n.id });
	}

	getStreamOptions(): OptionsInit & { isStream?: true } {
		return {
			https: {
				rejectUnauthorized: false
				//certificateAuthority = this.certificates.getAllCertificates();
			},
			retry: { limit: 0 },
			username: this.credentials?.user,
			password: this.credentials?.password,
			// specify short timeouts
			timeout: {
				lookup: 2000,
				connect: 2000,
				secureConnect: 2000,
				send: 10000
			},
			isStream: true
		};
	}

	async connectToFeed(): Promise<boolean> {
		const url = this.getURL('event-feed');
		let connected = false;
		try {
			const stream = got.stream(url, this.getStreamOptions());

			const rl = readline.createInterface({
				input: stream,
				crlfDelay: Infinity // Recognizes all instances of CR LF as a single line break
			});

			// TODO 120s timeout
			for await (const line of rl) {
				if (!connected) {
					// reset delay on successful connection
					console.log('Connected to feed');
					connected = true;
				}
				if (line && line.length > 0) {
					const obj: Notification = JSON.parse(line, (_key, value) => {
						return value === null ? undefined : value;
					});
					this.processNotification(obj);
				}
			}

			console.log(`Event feed stream ended for ${url}`);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// release the gate so waiting threads don't hang forever
			initialLoadGate.release();

			if (error instanceof HTTPError) {
				console.error(`HTTP error ${error.response.statusCode} loading ${url}: ${error.response.statusMessage}`);
			} else if (error instanceof RequestError) {
				console.error(`Error loading ${url}: ${error.code}`);
			} else {
				console.error(`Unexpected error loading ${url}: ${error}`);
			}
		}
		return connected;
	}

	async readEventFeed(): Promise<void> {
		console.log('Connecting to event feed');

		let reconnectDelay: number = 1000;
		const maxReconnectDelay = 30000; // max 30 seconds

		while (this.shouldReconnect) {
			// TODO should we reset here, or support event feed token?
			if (await this.connectToFeed()) {
				reconnectDelay = 1000;
			}

			if (this.state?.end_of_updates) {
				this.shouldReconnect = false;
			}

			if (this.shouldReconnect) {
				console.log(`Reconnecting to event feed in ${reconnectDelay / 1000}s...`);
				await new Promise((resolve) => setTimeout(resolve, reconnectDelay));
				reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
			}
		}

		console.log('Done reading event feed');
	}

	private reset(): void {
		this.version = undefined;
		this.contest = undefined;
		this.access = undefined;
		this.state = undefined;
		this.organizations = [];
		this.groups = [];
		this.teams = [];
		this.persons = [];
		this.accounts = [];
		this.account = undefined;
		this.languages = [];
		this.judgementTypes = [];
		this.problems = [];
		this.submissions = [];
		this.judgements = [];
		this.runs = [];
		this.clarifications = [];
		this.commentary = [];
		this.awards = [];
		this.startStatus = [];
		this.scoreboard = undefined;
		this.mapInfo = undefined;
	}

	async watch(options?: FeedOptions): Promise<void> {
		if (options?.ignore) {
			this.ignore = options.ignore;
			console.log('Ignoring: ' + this.ignore);
		}
		if (this.interval) {
			return;
		}
		console.log(`Watching ${this.id}`);

		// reset the contest to empty arrays
		this.reset();

		// load the initial version, access, and scoreboard endpoints since they're not in the feed
		await this.loadVersion(true);
		await this.loadAccess(true);
		await this.loadScoreboard(true);

		// Enable reconnection and start reading the event feed
		this.shouldReconnect = true;

		this.readEventFeed().catch((error) => {
			console.error(`Event feed error: ${error}`);
		});

		// wait for initial contest load (or timeout)
		await initialLoadGate.wait();

		this.interval = setInterval(async () => {
			try {
				if (this.scoreboardInvalid) {
					this.scoreboardInvalid = false;
					await this.loadScoreboard(true);
				}
			} catch (error: unknown) {
				console.error(`Error reloading contest data: ${error}`);
			}
		}, 2000);

		console.log(`Done watching ${this.id}`);
	}

	unwatch(): void {
		if (!this.interval) {
			return;
		}
		this.shouldReconnect = false;
		clearInterval(this.interval);
	}

	addChangeListener(listener: ContestListener): void {
		this.changeListeners.push(listener);
	}

	removeChangeListener(listener: ContestListener): void {
		const index = this.changeListeners.indexOf(listener);
		if (index >= 0) {
			this.changeListeners.splice(index, 1);
		}
	}

	private fireChange(event: ContestEvent): void {
		if (event.type === 'submissions' || event.type === 'judgements') {
			this.scoreboardInvalid = true;
		}
		for (const listener of this.changeListeners) {
			try {
				listener(event);
			} catch (error) {
				console.error('Error in change listener:', error);
			}
		}
	}
}
