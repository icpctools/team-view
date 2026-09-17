/**
 * Contest API Types
 *
 * This file defines the optional spec extensions supported by the ICPC Tools, including the Contest Data Server (CDS).
 *
 * ICPC Tools extension reference: https://github.com/icpctools/icpctools/blob/main/doc/spec-extensions.md
 */

export type ContestType = 'map-info' | 'start-status';

export interface Contest {
	time_multiplier?: number;
}

export interface MapInfo {
	table_width: number;
	table_depth: number;
	team_area_width: number;
	team_area_depth: number;
	aisles?: Aisle[];
	spare_teams?: TeamLocation[];
	printer?: FloorLocation;
}

export interface Aisle {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface FloorLocation {
	x: number;
	y: number;
}

export interface Problem {
	location?: FloorLocation;
}

export interface Group {
	logo?: FileReference[];
}

export interface Organization {
	audio?: FileReference[];
}

export interface Award {
	display_mode?: string;
	parameters?: AwardParameters;
}

export interface AwardParameters {
	numTeams?: number;
	solvedTop?: number;
	solvedBottom?: number;
	percentileTop?: number;
	percentileBottom?: number;
	//before?: number;
	//highlight?: boolean;
	//showScoreboardBefore?: boolean;
}

export interface StartStatus {
	id: Id;
	label: string;
	status: 0 | 1 | 2;
}
