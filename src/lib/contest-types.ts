/**
 * Copyright later.
 */

export interface ContestJSON {
	id: string,
	name: string,
	formal_name?: string,
	start_time?: string,
	duration: string,
	scoreboard_freeze_duration?: string,
	scoreboard_type: "pass-fail" | "scoring",
	penalty_time?: number,
	countdown_pause_time?: string,
	banner?: FileReferenceJSON[],
	logo?: FileReferenceJSON[]
}

export interface Time {
// todo
}

export interface RelTime {

}

// ID too?
export interface FileReferenceJSON {
	href?: string,
	filename: string,
	mime: string,
	hash?: string,
	width?: number,
	height?: number
}

export interface ContestStateJSON {
	started?: Time,
	frozen?: Time,
	ended?: Time,
	thawed?: Time,
	finalized?: Time,
	end_of_updates?: Time
}
export interface TeamJSON {
	id: string,
	label: string,
	name: string,
	display_name: string,
	organization_id: string
}

export interface ProblemJSON {
	id: string,
	label: string,
	name: string,
	ordinal: number
}

export interface GroupJSON {
	id: string,
	name: string,
	type?: string
}

export interface OrganizationJSON {
	id: string,
	name: string,
	formal_name?: string,
	country?: string,
	logo?: FileReferenceJSON[]
}

export interface SubmissionJSON {
	id: string,
	language_id: string,
	problem_id: string,
	team_id: string,
	time:Time,
	contest_time:RelTime,
	files: FileReferenceJSON,
	reaction?: FileReferenceJSON
}

export interface JudgementTypeJSON {
	id: string,
	name: string,
	penalty: boolean,
	solved: boolean
}

export interface LanguageJSON {
	id: string,
	name: string
}

export interface PersonJSON {
	id: string,
	name: string // todo
}

export interface ScoreboardJSON {
	time: Time,
	contest_time: RelTime,
	state: ContestStateJSON,
	rows: []
}

export interface ScoreboardScoreJSON {
	num_solved: number,
	total_time:number,
	score: number,
	time: number
}

export interface ScoreboardRowJSON {
	rank: number,
	team_id: string,
	score: ScoreboardScoreJSON,
	problems?: any[] // TODO
}

export interface AwardJSON {
	id: string // todo
}

export interface RunJSON {
	id: string // todo
}
export interface JudgementJSON {
	id: string // todo
}
export interface AccountJSON {
	id: string // todo
}
export interface ClarificationJSON {
	id: string // todo
}
export interface CommentaryJSON {
	id: string // todo
}
export interface AccessJSON {
	id: string // todo
}
export interface StartStatusJSON {
	id: string // todo
}