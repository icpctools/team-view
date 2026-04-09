import type { FileReference, Judgement, JudgementType, Language, Problem, RelTime, Team } from '@icpctools/contest-api';

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
