/**
 * Contest API Types
 *
 * This file supports the 2026-01-next (future spec draft) Contest API Specification.
 *
 * References:
 *  - 2026-01-next Contest API: https://ccs-specs.icpc.io/draft/
 */

export type ContestType =
	| 'version'
	| 'access'
	| 'contest'
	| 'judgement-types'
	| 'languages'
	| 'problems'
	| 'groups'
	| 'organizations'
	| 'teams'
	| 'persons'
	| 'account'
	| 'accounts'
	| 'state'
	| 'submissions'
	| 'judgements'
	| 'runs'
	| 'clarifications'
	| 'awards'
	| 'commentary'
	| 'scoreboard';

export type Id = string;

export type RelTime = string;

export type Time = string;

export interface Provider {
	name: string;
	version?: string;
	logo?: FileReference[];
}

export interface Info {
	version: string;
	version_url: string;
	provider?: Provider;
}

export interface Access {
	capabilities: string[];
	endpoints: Endpoint[];
}

export interface Endpoint {
	type: string;
	properties: string[];
}

export interface ContestLocation {
	latitude: number;
	longitude: number;
}

export interface Contest {
	id: Id;
	name: string;
	formal_name?: string;
	start_time?: string;
	duration: RelTime;
	scoreboard_freeze_duration?: RelTime;
	scoreboard_type: 'pass-fail' | 'score';
	penalty_time?: RelTime;
	countdown_pause_time?: RelTime;
	banner?: FileReference[];
	logo?: FileReference[];
}

export interface FileReference {
	href: string;
	filename: string;
	mime: string;
	hash?: string;
	width?: number;
	height?: number;
	tags?: string[];
}

export interface RemovedInterval {
	start: Time;
	end?: Time;
	contest_time: RelTime;
}

export interface ContestState {
	started?: Time;
	frozen?: Time;
	ended?: Time;
	thawed?: Time;
	finalized?: Time;
	end_of_updates?: Time;
	removed_intervals?: RemovedInterval[];
}

export interface Team {
	id: Id;
	label: string;
	name: string;
	display_name: string;
	organization_id: string;
	group_ids?: string[];
	photo?: FileReference[];
	video?: FileReference[];
	desktop?: FileReference[];
	webcam?: FileReference[];
	audio?: FileReference[];
}

export interface Problem {
	id: Id;
	uuid?: string;
	label: string;
	name: string;
	ordinal: number;
	rgb?: string;
	color?: string;
	max_score?: number;
	statement: FileReference[];
	memory_limit?: number;
	output_limit?: number;
	code_limit?: number;
	attachments?: FileReference[];
}

export interface Group {
	id: Id;
	name: string;
	type?: string;
}

export interface Organization {
	id: Id;
	name: string;
	formal_name?: string;
	country?: string;
	country_subdivision?: string;
	country_subdivision_flag?: FileReference[];
	twitter_hashtag?: string;
	url?: string;
	logo?: FileReference[];
}

export interface Submission {
	id: Id;
	language_id: Id;
	problem_id: Id;
	team_id?: Id;
	account_id?: Id;
	time: Time;
	contest_time: RelTime;
	files: FileReference[];
	reaction?: FileReference[];
}

export interface JudgementType {
	id: Id;
	simplified_judgement_type_id?: Id;
	name: string;
	penalty: boolean;
	solved: boolean;
}

export interface Language {
	id: Id;
	name: string;
}

export interface PersonRole {
	type: 'contestant' | 'coach' | 'staff' | 'other';
	title?: string;
	team_id?: Id;
}

export interface Person {
	id: Id;
	name: string;
	team_ids?: Id[];
	title?: string;
	email?: string;
	sex?: 'male' | 'female';
	role: 'contestant' | 'coach' | 'staff' | 'other' | PersonRole;
	photo?: FileReference[];
}

export interface Scoreboard {
	time: Time;
	contest_time: RelTime;
	state: ContestState;
	rows: ScoreboardRow[];
}

export interface ScoreboardScore {
	num_solved?: number;
	score?: number;
	time?: RelTime;
	total_time?: RelTime;
}

export interface ScoreboardRow {
	rank: number;
	team_id: Id;
	score: ScoreboardScore;
	problems?: ScoreboardProblem[];
}

export interface ScoreboardProblem {
	problem_id: Id;
	num_judged: number;
	num_pending: number;
	solved?: boolean;
	score?: number;
	time?: RelTime;
}

export interface Judgement {
	id: Id;
	submission_id: Id;
	judgement_type_id: Id;
	simplified_judgement_type_id?: Id;
	score?: number;
	current?: boolean;
	start_time: Time;
	end_time: Time;
	max_run_time: number;
}

export interface Run {
	id: Id;
	judgement_id: Id;
	ordinal: number;
	judgement_type_id: Id;
	time: Time;
	contest_time: RelTime;
	run_time: number;
	score?: number;
}

export interface Account {
	id: Id;
	username: string;
	password?: string;
	name?: string;
	type: 'team' | 'coach' | 'judge' | 'admin' | 'analyst' | 'staff';
	ip?: string;
	team_id?: Id;
	person_id?: Id;
}

export interface Clarification {
	id: Id;
	from_team_id?: Id;
	to_team_ids?: Id[];
	to_group_ids?: Id[];
	reply_to_id?: Id;
	problem_id?: Id;
	text: string;
	time: Time;
	contest_time: RelTime;
}

export interface Commentary {
	id: Id;
	time: Time;
	contest_time: RelTime;
	message: string;
	tags: string[];
	source_id?: Id;
	team_ids?: Id[];
	problem_ids?: Id[];
	submission_ids?: Id[];
}

export interface Award {
	id: Id;
	citation: string;
	team_ids?: Id[];
}

export interface Notification {
	type: ContestType;
	id?: Id;
	data?: { id: Id }[] | object;
	token?: string;
}
