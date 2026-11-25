import {
	findById,
	getCurrentJudgement,
	type ContestAPI,
	type FileReference,
	type Judgement,
	type JudgementType,
	type Language,
	type Problem,
	type RelTime,
	type Submission,
	type Team
} from '@icpctools/contest-api';

export interface SubmissionData {
	id: string;
	time: RelTime;
	problem: Problem;
	language: Language;
	team: Team;
	logo?: FileReference[];
	judgement?: Judgement;
	judgementType?: JudgementType;
	files: FileReference[];
	reaction: FileReference[];
	auth: string;
}

/**
 * Builds the submission data for a set of submissions.
 */
export function getSubmissionData(cc: ContestAPI, submissions: Submission[]): SubmissionData[] {
	const problems = cc.getProblems();
	const languages = cc.getLanguages();
	const teams = cc.getTeams();
	const orgs = cc.getOrganizations();
	const judgements = cc.getJudgements();
	const judgementTypes = cc.getJudgementTypes();

	return submissions.map((s) => {
		const j = getCurrentJudgement(s.id, judgements);
		const team = findById(teams, s.team_id);

		return {
			id: s.id,
			time: s.contest_time,
			team: team,
			language: findById(languages, s.language_id),
			judgement: j,
			judgementType: findById(judgementTypes, j?.judgement_type_id),
			files: s.files,
			reaction: s.reaction,
			problem: findById(problems, s.problem_id),
			auth: cc.getAuth(),
			logo: findById(orgs, team?.organization_id)?.logo
		} as SubmissionData;
	});
}

/**
 * Counts submissions that have a completed judgement (i.e. a judgement with a type).
 */
export function countJudgedSubmissions(cc: ContestAPI): number {
	const judgements = cc.getJudgements();

	return cc.getSubmissions().filter((s) => getCurrentJudgement(s.id, judgements)?.judgement_type_id).length;
}
