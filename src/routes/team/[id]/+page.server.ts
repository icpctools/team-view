import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';
import { timeToMin } from '$lib/contest-time-util.js';
import type { Judgement, JudgementType } from '$lib/contest-types.js';
import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([
		cc.loadGroups(),
		cc.loadOrganizations(),
		cc.loadTeams(),
		cc.loadPersons(),
		cc.loadLanguages(),
		cc.loadProblems(),
		cc.loadJudgementTypes(),
		cc.loadSubmissions(),
		cc.loadJudgements()
	]);

	const teams = cc.getTeams();
	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	const orgs = cc.getOrganizations();
	const org = orgs?.find((o) => o.id === team.organization_id);

	const groups = cc.getGroups();
	const groups2 = groups?.filter((g) => team.group_ids?.includes(g.id));

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	const persons = cc.getPersons();

	const coaches = persons?.filter((p) => p.role === 'coach' && p.team_ids?.includes(team.id));
	const contestants = persons?.filter((p) => p.role === 'contestant' && p.team_ids?.includes(team.id));

	const problems = cc.getProblems();

	const languages = cc.getLanguages();

	const submissions2 = cc.getSubmissions();

	const submissions = submissions2?.filter((s) => s.team_id === team.id);

	const judgements = cc.getJudgements();

	const judgementTypes = cc.getJudgementTypes();

	const submissionData = submissions?.map((s) => {
		const jud = util.findManyBySubmissionId(judgements, s.id);
		let j: Judgement | undefined;
		if (jud && jud.length > 0) {
			// find current judgement
			j = jud.find((jj) => jj.current);

			// otherwise it is the first one
			if (!j) j = jud[0];
		}

		let judge = '';
		let jt: JudgementType | undefined;
		if (j) {
			jt = util.findById(judgementTypes, j.judgement_type_id);
			if (j.score != undefined) judge += j.score + '';
		}
		return {
			time: timeToMin(s.contest_time),
			problem: util.findById(problems, s.problem_id),
			language: util.findById(languages, s.language_id)?.name,
			judgement: judge,
			judgement_type: jt
		};
	});

	let country;
	if (org?.country) {
		//countries.registerLocale(en);
		//country = countries.getName(org.country, 'en');
		country = org.country;
	}

	return {
		team: team,
		organization: org,
		groups: groups2,
		logo: logo,
		coaches: coaches,
		contestants: contestants,
		submissions: submissionData,
		country: country
	};
};
