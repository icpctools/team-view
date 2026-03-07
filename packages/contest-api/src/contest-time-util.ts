/**
 * Copyright later.
 */
import type { Contest, ContestState, RelTime } from './contest-types.js';

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

	if (!match || match.length < 4) {
		return undefined;
	}

	const h = parseInt(match[1]);
	const m = parseInt(match[2]);
	const s = parseInt(match[3]);
	let ms = 0;
	if (match[4]) {
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

/**
 * Returns the current contest time:
 * - undefined if the contest isn't scheduled
 * - negative if we're before the scheduled start, or countdown is paused
 * - positive once the contest has been started (taking removed intervals and multiplier into account)
 * - continues past contest duration if the contest is over
 */
export function getContestTime(contest?: Contest, state?: ContestState, currentTimeMs?: number): number | undefined {
	if (!contest) {
		return undefined;
	}

	// paused
	const m = contest?.time_multiplier ?? 1;
	if (contest.countdown_pause_time) {
		const pause = parseRelTime(contest.countdown_pause_time);
		if (!pause) {
			return undefined;
		}

		return -pause * m;
	}

	// not started
	const currentTime = currentTimeMs ?? Date.now();
	if (!state?.started) {
		if (!contest.start_time) {
			return undefined;
		} else {
			// scheduled
			const d = new Date(contest.start_time);
			return (currentTime - d.getTime()) * m;
		}
	}

	// started - apply removed intervals
	let removedTime = 0;
	if (state.removed_intervals) {
		for (const interval of state.removed_intervals) {
			const intervalStart = new Date(interval.start).getTime();
			if (intervalStart < currentTime) {
				// interval started before now, so it applies
				if (!interval.end) {
					// we're in the interval
					return parseRelTime(interval.contest_time) ?? 0;
				}
				const intervalEnd = new Date(interval?.end).getTime();
				if (intervalEnd > currentTime) {
					// we're in the interval
					return parseRelTime(interval.contest_time) ?? 0;
				}
				removedTime += intervalEnd - intervalStart;
			}
		}
	}

	const d = new Date(state.started);
	return (currentTime - d.getTime() - removedTime) * m;
}

/**
 * Returns the current time remaining in the contest:
 * - undefined if there's no contest or it doesn't have a valid duration
 * - the contest duration if it hasn't started yet
 * - a positive, decreasing number if the contest is running (taking removed intervals and multiplier into account)
 * - zero once the contest is over
 * Use formatContestTime(x, true) for user formatting.
 */
export function getRemainingContestTime(
	contest?: Contest,
	state?: ContestState,
	currentTimeMs?: number
): number | undefined {
	if (!contest || !contest.duration) {
		return undefined;
	}

	const duration = parseRelTime(contest.duration);
	if (!duration) {
		return undefined;
	}

	if (!state?.started) {
		return duration;
	}

	if (state?.ended) {
		return 0;
	}

	// started - apply removed intervals
	const currentTime = currentTimeMs ?? Date.now();
	let removedTime = 0;
	if (state.removed_intervals) {
		for (const interval of state.removed_intervals) {
			const intervalStart = new Date(interval.start).getTime();
			if (intervalStart < currentTime) {
				// interval started before now, so it applies
				if (!interval.end) {
					// we're in the interval
					return duration - (parseRelTime(interval.contest_time) ?? 0);
				}
				const intervalEnd = new Date(interval?.end).getTime();
				if (intervalEnd > currentTime) {
					// we're in the interval
					return duration - (parseRelTime(interval.contest_time) ?? 0);
				}
				removedTime += intervalEnd - intervalStart;
			}
		}
	}

	const d = new Date(state.started);
	return Math.max(0, duration - (currentTime - d.getTime() - removedTime) * (contest?.time_multiplier ?? 1));
}

export function formatContestTime(time: number | undefined, ceil?: boolean): string | undefined {
	if (time === undefined) {
		return undefined;
	}

	const sb = [];
	if (time < 0) {
		sb.push('-');
	}

	const ss = Math.abs(ceil ? Math.ceil(time / 1000.0) : Math.floor(time / 1000.0));

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
