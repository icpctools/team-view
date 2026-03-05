import type { Group, Problem, RelTime, Team } from '@icpctools/contest-api';

export interface ClarificationData {
	id: string;
	time: RelTime;
	text: string;
	problem?: Problem;
	from_team?: Team;
	to_teams?: Team[];
	to_groups?: Group[];
	replies?: ClarificationData[];
}
