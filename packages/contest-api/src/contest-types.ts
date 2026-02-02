/**
 * Contest API Types
 *
 * This file supports both the 2023-06 and 2026-01 Contest API specifications, with optional
 * extensions from the Contest Data Server (CDS). Inline comments are used to indicate objects
 * and properties that are unique to any of these.
 *
 * References:
 *  - 2023-06 Contest API: https://ccs-specs.icpc.io/2023-06/
 *  - 2026-01 Contest API: https://ccs-specs.icpc.io/2026-01/
 *  - CDS extensions: https://github.com/icpctools/icpctools/blob/main/doc/spec-extensions.md
 */

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
	penalty_time?: number | RelTime; // 2023-06 | 2026-01 spec
	countdown_pause_time?: RelTime;
	banner?: FileReference[];
	logo?: FileReference[];
	location?: ContestLocation; // CDS extension
	time_multiplier?: number; // CDS extension
}

export interface FileReference {
	href: string;
	filename: string;
	mime: string;
	hash?: string;
	width?: number;
	height?: number;
	tags?: string[]; // 2026-01 spec
}

export interface ContestState {
	started?: Time;
	frozen?: Time;
	ended?: Time;
	thawed?: Time;
	finalized?: Time;
	end_of_updates?: Time;
}

// CDS extension
export interface MapInfo {
	table_width: number;
	table_depth: number;
	table_area_width: number;
	table_area_depth: number;
	aisles?: Aisle[];
	spare_teams?: TeamLocation[];
	printer?: Location;
}

// CDS extension
export interface Aisle {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

// CDS extension
export interface Location {
	x: number;
	y: number;
}

// CDS extension
export interface TeamLocation extends Location {
	rotation: number;
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
	location?: TeamLocation; // CDS extension
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
	location?: Location; // CDS extension
	memory_limit?: number; // 2026-01 spec
	output_limit?: number; // 2026-01 spec
	code_limit?: number; // 2026-01 spec
	attachments?: FileReference[]; // 2026-01 spec
}

export interface Group {
	id: Id;
	name: string;
	type?: string;
	logo?: FileReference[]; // CDS extension
}

export interface Organization {
	id: Id;
	name: string;
	formal_name?: string;
	country?: string;
	country_subdivision?: string; // 2026-01 spec
	country_subdivision_flag?: FileReference[]; // 2026-01 spec
	twitter_hashtag?: string;
	url?: string;
	logo?: FileReference[];

	audio?: FileReference[]; // CDS extension
}

export interface Submission {
	id: Id;
	language_id: Id;
	problem_id: Id;
	team_id?: Id; // optional in 2026-01 spec
	account_id?: Id; // 2026-01 spec
	time: Time;
	contest_time: RelTime;
	files: FileReference[];
	reaction?: FileReference[];
}

export interface JudgementType {
	id: Id;
	simplified_judgement_type_id?: Id; // 2026-01 spec
	name: string;
	penalty: boolean;
	solved: boolean;
}

export interface Language {
	id: Id;
	name: string;
}

export interface Person {
	id: Id;
	name: string;
	team_ids?: Id[];
	title?: string;
	email?: string;
	sex?: string;
	role: 'contestant' | 'coach' | 'staff' | 'other';
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
	time?: number | RelTime; // 2023-06 | 2026-01 spec
	total_time?: number | RelTime; // 2023-06 | 2026-01 spec
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
	time?: number | RelTime; // 2023-06 | 2026-01 spec
}

export interface Judgement {
	id: Id;
	submission_id: Id;
	judgement_type_id: Id;
	simplified_judgement_type_id?: Id; // 2026-01 spec
	score?: number;
	current?: boolean; // 2026-01 spec
	start_time: Time;
	start_contest_time: RelTime;
	end_time: Time;
	end_contest_time: RelTime;
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
}

export interface Account {
	id: Id;
	username: string;
	password?: string;
	name?: string;
	type: 'team' | 'judge' | 'admin' | 'analyst' | 'staff';
	ip?: string;
	team_id?: Id;
	person_id?: Id;
}

export interface Clarification {
	id: Id;
	from_team_id?: Id;
	to_team_id?: Id[]; // 2023-06 spec
	to_team_ids?: Id[]; // 2026-01 spec
	to_group_ids?: Id[]; // 2026-01 spec
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
	display_mode?: string; // CDS extension
}

// CDS extension
export interface StartStatus {
	id: Id;
	label: string;
	status: 0 | 1 | 2;
}

export interface Notification {
	type: string;
	id?: Id;
	data?: [] | object;
	token?: string;
}
