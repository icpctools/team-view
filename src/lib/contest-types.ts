/**
 * Copyright later.
 */

export type Id = string;

export type RelTime = string;

export type Time = string;

export interface ContestLocationJSON {
	latitude: number;
	longitude: number;
}

export interface ContestJSON {
	id: Id;
	name: string;
	formal_name?: string;
	start_time?: string;
	duration: RelTime;
	scoreboard_freeze_duration?: RelTime;
	scoreboard_type: 'pass-fail' | 'score';
	penalty_time?: number | RelTime; // 2023-06 | draft
	countdown_pause_time?: RelTime;
	banner?: FileReferenceJSON[];
	logo?: FileReferenceJSON[];
	location?: ContestLocationJSON;
	time_multiplier?: number;
}

export interface FileReferenceJSON {
	href: string;
	filename: string;
	mime: string;
	hash?: string;
	width?: number;
	height?: number;
}

export interface ContestStateJSON {
	started?: Time;
	frozen?: Time;
	ended?: Time;
	thawed?: Time;
	finalized?: Time;
	end_of_updates?: Time;
}


export interface TeamLocationJSON {
	x: number;
	y: number;
	rotation: number;
}

export interface TeamJSON {
	id: Id;
	label: string;
	name: string;
	display_name: string;
	organization_id: string;
	group_ids?: string[];
	photo?: FileReferenceJSON[];
	video?: FileReferenceJSON[];
	desktop?: FileReferenceJSON[];
	webcam?: FileReferenceJSON[];
	audio?: FileReferenceJSON[];
	location: TeamLocationJSON;
}

export interface ProblemJSON {
	id: Id;
	uuid?: string;
	label: string;
	name: string;
	ordinal: number;
	rgb?: string;
	color?: string;
    max_score?: number;
	statement: FileReferenceJSON[];
}

export interface GroupJSON {
	id: Id;
	name: string;
	type?: string;
}

export interface OrganizationJSON {
	id: Id;
	name: string;
	formal_name?: string;
	country?: string;
	twitter_hashtag?: string;
	url?: string;
	logo?: FileReferenceJSON[];
}

export interface SubmissionJSON {
	id: Id;
	language_id: Id;
	problem_id: Id;
	team_id: Id;
	time: Time;
	contest_time: RelTime;
	files: FileReferenceJSON;
	reaction?: FileReferenceJSON;
}

export interface JudgementTypeJSON {
	id: Id;
	name: string;
	penalty: boolean;
	solved: boolean;
}

export interface LanguageJSON {
	id: Id;
	name: string;
}

export interface PersonJSON {
	id: Id;
	name: string;
	team_ids?: Id[];
	title?: string;
	email?: string;
	sex?: string;
	role: 'contestant' | 'coach' | 'staff' | 'other';
	photo?: FileReferenceJSON[];
}

export interface ScoreboardJSON {
	time: Time;
	contest_time: RelTime;
	state: ContestStateJSON;
	rows: ScoreboardRowJSON[];
}

export interface ScoreboardScoreJSON {
	num_solved?: number;
	total_time?: number | RelTime; // 2023-06 | draft
	score?: number;
	time?: RelTime;
}

export interface ScoreboardRowJSON {
	rank: number;
	team_id: Id;
	score: ScoreboardScoreJSON;
	problems?: ScoreboardProblemJSON[];
}

export interface ScoreboardProblemJSON {
	problem_id: Id;
	num_judged: number;
	num_pending: number;
	solved?: boolean;
	score?: number;
	time?: number | RelTime; // 2023-06 | draft
}

export interface JudgementJSON {
	id: Id;
	submission_id: Id;
	judgement_type_id: Id;
	score?: number;
	current?: boolean;
	start_time: Time;
	start_contest_time: RelTime;
	end_time: Time;
	end_contest_time: RelTime;
	max_run_time: number;
}

export interface AwardJSON {
	id: Id; // todo
}

export interface RunJSON {
	id: Id; // todo
}

export interface AccountJSON {
	id: Id; // todo
}

export interface ClarificationJSON {
	id: Id; // todo
}

export interface CommentaryJSON {
	id: Id; // todo
}

export interface AccessJSON {
	id: Id; // todo
}

export interface StartStatusJSON {
	id: Id; // todo
}
