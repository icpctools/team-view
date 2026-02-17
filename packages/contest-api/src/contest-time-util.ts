/**
 * Copyright later.
 */
import type { Contest, RelTime } from './contest-types.js';

function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

export function parseRelTime(relTime: RelTime | number | undefined): number | undefined {
	if (!relTime) {
		return undefined;
	}
	if (isNumber(relTime)) {
		// times were in minutes, but we want ms
		return relTime * 60 * 1000;
	}
	const match = relTime.match('-?([0-9]+):([0-9]{2}):([0-9]{2})(\\.[0-9]{3})?');

	if (match == null || match.length < 4) {
		return undefined;
	}

	const h = parseInt(match[1]);
	const m = parseInt(match[2]);
	const s = parseInt(match[3]);
	let ms = 0;
	if (match.length == 5) {
		ms = parseInt(match[4].substring(1));
	}

	const ret = h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000 + ms;
	if (relTime.startsWith('-')) {
		return -ret;
	}

	return ret;
}

export function timeToMin(relTime: RelTime | number | undefined): string {
	if (!relTime) {
		return '';
	}
	return formatTimeInMin(parseRelTime(relTime));
}

function formatTimeInMin(timeMs: number | undefined): string {
	if (!timeMs) {
		return '';
	}
	if (timeMs >= 0 && timeMs < 1000) {
		return '0';
	}

	const sb = [];
	if (timeMs < 0) {
		sb.push('-');
		timeMs = -timeMs;
	}
	const timeS = Math.floor(timeMs / 1000);

	const mins = Math.floor(timeS / 60.0);
	if (mins > 0) {
		sb.push(mins);
	}

	return sb.join('');
}

export function getContestState(
	contest: Contest | undefined
): 'unscheduled' | 'countdown' | 'paused' | 'running' | 'frozen' | 'finished' {
	if (contest == null) {
		return 'unscheduled';
	}

	let m = 1;
	if (contest.time_multiplier) {
		m = contest.time_multiplier;
	}

	if (contest.start_time == null) {
		if (contest.countdown_pause_time) {
			return 'paused';
		}
		return 'unscheduled';
	}

	const d = new Date(contest.start_time);

	const time = (Date.now() - d.getTime()) * m; // - contest.getTimeDelta();
	if (time < 0) {
		return 'countdown';
	}
	const duration = parseRelTime(contest.duration);
	if (duration) {
		if (time > duration) {
			return 'finished';
		}

		const freeze = parseRelTime(contest.scoreboard_freeze_duration);
		if (freeze && time > duration - freeze) {
			return 'frozen';
		}
	}

	return 'running';
}

export function getContestTime(contest: Contest | undefined, short: boolean): string | undefined {
	if (contest == null) {
		return undefined;
	}

	let m = 1;
	if (contest.time_multiplier) {
		m = contest.time_multiplier;
	}

	if (contest.start_time == null) {
		if (!contest.countdown_pause_time) {
			return 'Contest not scheduled';
		} else {
			const pause = parseRelTime(contest.countdown_pause_time);
			if (!pause) {
				return 'Paused';
			}

			if (short) {
				return formatContestTime(-pause * m, false) + ' (paused)';
			} else {
				return 'Countdown paused: ' + formatContestTime(-pause * m, false);
			}
		}
	}

	const d = new Date(contest.start_time);

	const time = (Date.now() - d.getTime()) * m; // - contest.getTimeDelta();
	if (time < 0) {
		if (short) {
			return formatContestTime(time, true);
		} else {
			return 'Countdown: ' + formatContestTime(time, true);
		}
	}
	const duration = parseRelTime(contest.duration);
	if (duration && time > duration) {
		return 'Contest is over';
	}

	return formatContestTime(time, true);
}

export function formatContestTime(time: number, floor: boolean): string {
	const sb = [];
	if (time < 0) {
		sb.push('-');
	}

	let ss: number;
	if (floor) {
		ss = Math.abs(Math.floor(time / 1000.0));
	} else {
		ss = Math.abs(Math.ceil(time / 1000.0));
	}

	const days = Math.floor(ss / 86400.0);

	if (days > 0) {
		sb.push(days + 'd ');
	}

	const hours = Math.floor(ss / 3600.0) % 24;
	sb.push(hours + ':');

	const minutes = Math.floor(ss / 60) % 60;
	if (minutes < 10) {
		sb.push('0');
	}
	sb.push(minutes + ':');

	const seconds = ss % 60;
	if (seconds < 10) {
		sb.push('0');
	}
	sb.push(seconds);
	return sb.join('');
}
