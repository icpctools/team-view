import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { loadContest } from '$lib/state.svelte.js';
import { timeToMin } from '$lib/contest-time-util.js';
import type { JudgementJSON } from '$lib/contest-types.js';
import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

export const load = async (params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();

	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	if (!cc.getOrganizations())
		await cc.loadOrganizations();
	const orgs = cc.getOrganizations();

	const org = orgs?.find((o) => o.id === team.organization_id);

	if (!cc.getGroups())
		await cc.loadGroups();
	const groups = cc.getGroups();

	const groups2 = groups?.filter((g) => team.group_ids?.includes(g.id));

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	if (!cc.getPersons())
		await cc.loadPersons();
	const persons = cc.getPersons();
	
	const coaches = persons?.filter((p) => p.role === 'coach' && p.team_ids?.includes(team.id));
	const contestants = persons?.filter(
		(p) => p.role === 'contestant' && p.team_ids?.includes(team.id)
	);

	if (!cc.getProblems())
		await cc.loadProblems();
	const problems = cc.getProblems();

	if (!cc.getLanguages())
		await cc.loadLanguages();
	const languages = cc.getLanguages();

	if (!cc.getSubmissions())
		await cc.loadSubmissions();
	const submissions2 = cc.getSubmissions();

	const submissions = submissions2?.filter(s => s.team_id === team.id);

	if (!cc.getJudgements())
		await cc.loadJudgements();
	const judgements = cc.getJudgements();

	if (!cc.getJudgementTypes())
		await cc.loadJudgementTypes();
	const judgementTypes = cc.getJudgementTypes();
	
	const submissionData = submissions?.map((s)=> {
		const jud = util.findManyBySubmissionId(judgements, s.id);
		let j: JudgementJSON | undefined;
		if (jud && jud.length > 0) {
			// find current judgement
			j = jud.find(jj => jj.current);

			// otherwise it is the first one
			if (!j)
				j = jud[0];
		}
		
		let judge = '';
		if (j) {
			const jt = util.findById(judgementTypes, j.judgement_type_id);
			judge = jt?.id + ': ';
			if (j.score != undefined)
				judge += j.score + '';
			else
				judge += jt?.solved + '';
		}
		return {
			time: timeToMin(s.contest_time),
			problem: util.findById(problems, s.problem_id)?.label,
			language: util.findById(languages, s.language_id)?.name,
			judgement: judge,
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
		country: country,
	};
};
