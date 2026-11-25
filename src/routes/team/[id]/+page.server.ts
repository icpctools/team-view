import { error } from '@sveltejs/kit';
import { findById } from '@icpctools/contest-api';
import { loadContest } from '#lib/state.svelte.js';
import { getSubmissionData } from '#lib/submissionData.js';
import { hasEndpointProperty } from '@icpctools/contest-api';

export const load = async ({ params, depends }) => {
	depends(`app:teams/${params.id}`, 'app:submissions');
	const cc = await loadContest();
	if (!cc) throw error(404);

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

	const submissionData = getSubmissionData(
		cc,
		cc.getSubmissions().filter((s) => s.team_id === team.id)
	);

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
		hasLanguage: hasEndpointProperty(cc.getAccess(), 'submissions', 'language_id'),
		hasFiles: hasEndpointProperty(cc.getAccess(), 'submissions', 'files'),
		hasReactions: hasEndpointProperty(cc.getAccess(), 'submissions', 'reaction')
	};
};
