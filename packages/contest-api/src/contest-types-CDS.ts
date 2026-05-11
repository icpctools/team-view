/**
 * Contest API Types
 *
 * This file supports both the 2023-06 and 2026-01 Contest API specifications, with optional
 * extensions from the Contest Data Server (CDS). Inline comments are used to indicate objects
 * and properties that are unique to any of these.
 *
 * References:
 *  - 2026-01 Contest API: https://ccs-specs.icpc.io/2026-01/
 *  - CDS extensions: https://github.com/icpctools/icpctools/blob/main/doc/spec-extensions.md
 */

export type ContestType = 'map-info' | 'start-status';

export interface Contest {
	location?: ContestLocation;
	time_multiplier?: number;
}

// CDS extension
export interface MapInfo {
	table_width: number;
	table_depth: number;
	team_area_width: number;
	team_area_depth: number;
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
	location?: TeamLocation;
}

export interface Problem {
	location?: Location;
}

export interface Group {
	logo?: FileReference[];
}

export interface Organization {
	audio?: FileReference[];
}

export interface Award {
	display_mode?: string;
}

// CDS extension
export interface StartStatus {
	id: Id;
	label: string;
	status: 0 | 1 | 2;
}
