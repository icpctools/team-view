/**
 * Copyright later.
 */
import type { HttpsOptions, OptionsOfTextResponseBody } from 'got';
import got from 'got';
import type {
	AccessJSON,
	AccountJSON,
	AwardJSON,
	ClarificationJSON,
	CommentaryJSON,
	ContestJSON,
	ContestStateJSON,
	FileReferenceJSON,
	GroupJSON,
	JudgementJSON,
	JudgementTypeJSON,
	LanguageJSON,
	OrganizationJSON,
	PersonJSON,
	ProblemJSON,
	RunJSON,
	ScoreboardJSON,
	StartStatusJSON,
	SubmissionJSON,
	TeamJSON
} from './contest-types';

export class Contest {
	info?: ContestJSON;
	access?: AccessJSON;
	state?: ContestStateJSON;
	organizations?: OrganizationJSON[];
	groups?: GroupJSON[];
	teams?: TeamJSON[];
	persons?: PersonJSON[];
	accounts?: AccountJSON[];
	account?: AccountJSON;
	languages?: LanguageJSON[];
	judgementTypes?: JudgementTypeJSON[];
	problems?: ProblemJSON[];
	submissions?: SubmissionJSON[];
	judgements?: JudgementJSON[];
	runs?: RunJSON[];
	clarifications?: ClarificationJSON[];
	commentary?: CommentaryJSON[];
	awards?: AwardJSON[];
	startStatus?: StartStatusJSON[];
	scoreboard?: ScoreboardJSON;

	contestURL: string;

	timeDelta = [];

	/*constructor(baseURL: string, contestId: string) {
		if (!baseURL.endsWith('/'))
			baseURL += '/';
		this.contestURL = baseURL + 'contests/' + contestId;
		console.log("Contest URL: " + this.contestURL);
	}*/

	constructor(contestURL: string) {
		this.contestURL = contestURL;
		console.log('Contest URL: ' + this.contestURL);
	}

	getURL(type: any, id?: string) {
		if (id == null) return this.contestURL + '/' + type;
		return this.contestURL + '/' + type + '/' + id;
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

	async loadObject(type: any): Promise<any> {
		console.log('Loading contest ' + type);
		const startTime = performance.now();
		try {
			const url = this.getURL(type);
			const response = await got.get(url, this.getHttpOptions());
			const obj = JSON.parse(response.body);
			const endTime = performance.now();
			console.log(`Fetched ${url} in ${endTime - startTime}ms`);
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

	async loadInfo(): Promise<ContestJSON | undefined> {
		return this.loadObject('');
	}

	async loadAccess(): Promise<StartStatusJSON | undefined> {
		this.access = await this.loadObject('access');
		return this.access;
	}

	async loadState(): Promise<ContestStateJSON | undefined> {
		this.state = await this.loadObject('state');
		return this.state;
	}

	async loadStartStatus(): Promise<StartStatusJSON[] | undefined> {
		this.startStatus = await this.loadObject('start-status');
		return this.startStatus;
	}

	async loadLanguages(): Promise<LanguageJSON[] | undefined> {
		this.problems = await this.loadObject('problems');
		return this.problems;
	}

	async loadJudgementTypes(): Promise<JudgementTypeJSON[] | undefined> {
		this.judgementTypes = await this.loadObject('judgement-types');
		return this.judgementTypes;
	}

	async loadProblems(): Promise<ProblemJSON[] | undefined> {
		this.problems = await this.loadObject('problems');
		return this.problems;
	}

	async loadGroups(): Promise<GroupJSON[] | undefined> {
		this.groups = await this.loadObject('groups');
		return this.groups;
	}

	async loadOrganizations(): Promise<OrganizationJSON[] | undefined> {
		this.organizations = await this.loadObject('organizations');
		return this.organizations;
	}

	async loadTeams(): Promise<TeamJSON[] | undefined> {
		this.teams = await this.loadObject('teams');
		return this.teams;

		/*return this.loadObject('teams', (result) => {
			var teams2 = result;
			teams2.sort(function(a,b) {
				if (!isNaN(a.id) && !isNaN(b.id))
					return Number(a.id) > Number(b.id);
				else
					return a.id.localeCompare(b.id);
			})
			this.teams = teams2;
		});*/
	}

	async loadPersons(): Promise<PersonJSON[] | undefined> {
		this.persons = await this.loadObject('persons');
		return this.persons;
	}

	async loadAccounts(): Promise<AccountJSON[] | undefined> {
		this.accounts = await this.loadObject('accounts');
		return this.accounts;
	}

	async loadAccount(): Promise<AccountJSON | undefined> {
		this.account = await this.loadObject('account');
		return this.account;
	}

	async loadSubmissions(): Promise<SubmissionJSON[] | undefined> {
		this.submissions = await this.loadObject('submissions');
		return this.submissions;
	}

	async loadJudgements(): Promise<JudgementJSON[] | undefined> {
		this.judgements = await this.loadObject('judgements');
		return this.judgements;
	}

	async loadRuns(): Promise<RunJSON[] | undefined> {
		this.runs = await this.loadObject('runs');
		return this.runs;
	}

	async loadClarifications(): Promise<ClarificationJSON[] | undefined> {
		this.clarifications = await this.loadObject('clarifications');
		return this.clarifications;
	}

	async loadCommentary(): Promise<CommentaryJSON[] | undefined> {
		this.commentary = await this.loadObject('commentary');
		return this.commentary;
	}

	async loadScoreboard(): Promise<ScoreboardJSON | undefined> {
		this.scoreboard = await this.loadObject('scoreboard');
		return this.scoreboard;
	}

	clearScoreboard() {
		this.scoreboard = undefined;
	}

	async loadAwards(): Promise<AwardJSON[] | undefined> {
		this.awards = await this.loadObject('awards');
		return this.awards;
	}

	getContestURL(): string {
		return this.contestURL;
	}
	getInfo(): ContestJSON | undefined {
		return this.info;
	}
	getAccess() {
		return this.access;
	}
	getState(): ContestStateJSON | undefined {
		return this.state;
	}
	getStartStatus() {
		return this.startStatus;
	}
	getLanguages(): LanguageJSON[] | undefined {
		return this.languages;
	}
	getJudgementTypes(): JudgementTypeJSON[] | undefined {
		return this.judgementTypes;
	}
	getProblems(): ProblemJSON[] | undefined {
		return this.problems;
	}
	getGroups(): GroupJSON[] | undefined {
		return this.groups;
	}
	getTeams(): TeamJSON[] | undefined {
		return this.teams;
	}
	getOrganizations(): OrganizationJSON[] | undefined {
		return this.organizations;
	}
	getPersons(): PersonJSON[] | undefined {
		return this.persons;
	}
	getAccounts(): AccountJSON[] | undefined {
		return this.accounts;
	}
	getAccount(): AccountJSON | undefined {
		return this.account;
	}
	getSubmissions(): SubmissionJSON[] | undefined {
		return this.submissions;
	}
	getJudgements(): JudgementJSON[] | undefined {
		return this.judgements;
	}
	getRuns(): RunJSON[] | undefined {
		return this.runs;
	}
	getClarifications(): ClarificationJSON[] | undefined {
		return this.clarifications;
	}
	getCommentary(): CommentaryJSON[] | undefined {
		return this.commentary;
	}
	getScoreboard(): ScoreboardJSON | undefined {
		return this.scoreboard;
	}
	getAwards(): AwardJSON[] | undefined {
		return this.awards;
	}

	getTimeDelta() {
		if (this.timeDelta.length == 0) return 0;
		var total = 0;
		this.timeDelta.forEach(function (item) {
			total += item;
		});
		return total / this.timeDelta.length;
	}

	getContestTimeObj() {
		// returns a single object with contest time/state
		// null - if unscheduled
		// -time - if in countdown
		// "time" - if countdown is paused
		// time - time if past contest start
		if (this.info == null) {
			// contest info wasn't loaded yet - so let's do that in the background in case we're called again
			this.loadInfo();
			return null;
		}

		/*var m = this.info.time_multiplier;
		if (m == null)
			m = 1;

		if (this.info.start_time == null) {
			if (this.info.countdown_pause_time == null)
				return null;
			else
				return formatTime(parseTime(this.info.countdown_pause_time) * m) + "";
		}

		var d = new Date(this.info.start_time);

		return (Date.now() - d.getTime()) * m - this.getTimeDelta();*/
	}

	resolveURL(ref: FileReferenceJSON | undefined): string | undefined {
		if (!ref || !ref.href) return undefined;
		// TODO: for now, hack off part of the URL
		return this.contestURL.substring(0, 27) + ref.href;
	}

	clear() {
		this.startStatus = undefined;
		this.problems = undefined;
		this.submissions = undefined;
		this.judgements = undefined;
		this.clarifications = undefined;
		this.commentary = undefined;
	}
}
