import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '$lib/state.svelte.js';
import type { Judgement, JudgementType } from '@icpctools/contest-api';
import type { SubmissionData } from '$lib/submissionData';
import { findManyBySubmissionId } from '@icpctools/contest-api';
import { hasEndpointProperty } from '@icpctools/contest-api';

export const load = async ({ params, depends }) => {
	depends('data:team');
	const cc = await loadContest();
	if (!cc) throw error(404);

	await Promise.all([
		cc.loadAccess(),
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
	const team = teams?.find((t) => t.id && t.id === params.id);
	if (!team) throw error(404);

	const orgs = cc.getOrganizations();
	const org = orgs?.find((o) => o.id === team.organization_id);

	const groups = cc.getGroups();
	const groups2 = groups?.filter((g) => team.group_ids?.includes(g.id));

	const logo = findById(orgs, team.organization_id)?.logo;

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
		const jud = findManyBySubmissionId(judgements, s.id);
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
			jt = findById(judgementTypes, j.judgement_type_id);
			if (j.score != undefined) judge += j.score + '';
		}
		return {
			id: s.id,
			time: s.contest_time,
			team: team,
			problem: findById(problems, s.problem_id),
			language: findById(languages, s.language_id),
			judgement: judge,
			judgementType: jt,
			files: s.files,
			reaction: s.reaction,
			auth: cc.getAuth()
		} as SubmissionData;
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
		hasReactions: hasEndpointProperty(cc.getAccess(), 'submissions', 'reaction')
	};
};
