import { expect, test } from 'vitest';
import { formatContestTime, getContestClock, parseRelTime, timeToMin } from './contest-time-util.js';
import type { Contest, ContestState } from './contest-types.js';

test('parseRelTime with number', () => {
	expect(parseRelTime(5)).toBe(5 * 60 * 1000);
	expect(parseRelTime(0)).toBeUndefined();
	expect(parseRelTime(120)).toBe(120 * 60 * 1000);
});

test('parseRelTime with undefined', () => {
	expect(parseRelTime(undefined)).toBeUndefined();
});

test('parseRelTime with HH:MM:SS string', () => {
	expect(parseRelTime('1:30:00')).toBe(90 * 60 * 1000);
	expect(parseRelTime('0:00:00')).toBe(0);
	expect(parseRelTime('2:15:30')).toBe(2 * 3600 * 1000 + 15 * 60 * 1000 + 30 * 1000);
});

test('parseRelTime with HH:MM:SS.mmm string', () => {
	expect(parseRelTime('0:00:01.500')).toBe(1500);
	expect(parseRelTime('1:00:00.123')).toBe(3600123);
});

test('parseRelTime with negative string', () => {
	expect(parseRelTime('-1:30:00')).toBe(-90 * 60 * 1000);
	expect(parseRelTime('-0:00:05')).toBe(-5000);
});

test('parseRelTime with invalid string', () => {
	expect(parseRelTime('invalid')).toBeUndefined();
	expect(parseRelTime('1:2:3')).toBeUndefined();
});

test('timeToMin', () => {
	expect(timeToMin(5)).toBe('5');
	expect(timeToMin('1:00:00')).toBe('60');
	expect(timeToMin(undefined)).toBe('');
});

test('formatContestTime', () => {
	expect(formatContestTime(0, true)).toBe('0:00:00');
	expect(formatContestTime(3600000, true)).toBe('1:00:00');
	expect(formatContestTime(3661000, true)).toBe('1:01:01');
	expect(formatContestTime(90061000, true)).toBe('1d 1:01:01');
	expect(formatContestTime(-5000, true)).toBe('-0:00:05');
});

test('formatContestTime with floor false', () => {
	expect(formatContestTime(1000, false)).toBe('0:00:01');
	expect(formatContestTime(500, false)).toBe('0:00:01');
});

test('getContestClock with undefined parameters', () => {
	expect(getContestClock(undefined, undefined)).toBeUndefined();
});

test('getContestClock when not scheduled', () => {
	const contest = {} as Contest;
	expect(getContestClock(contest)).toBeUndefined();
});

test('getContestClock when scheduled', () => {
	const startTime = new Date(Date.now() + 1800000).toISOString();
	const contest = {
		start_time: startTime
	} as Contest;
	expect(getContestClock(contest)).toBe('-0:30:00');
});

test('getContestClock when scheduled with time multiple', () => {
	const startTime = new Date(Date.now() + 1800000).toISOString();
	const contest = {
		start_time: startTime,
		time_multiplier: 2
	} as Contest;
	expect(getContestClock(contest)).toBe('-1:00:00');
});

test('getContestClock when countdown paused', () => {
	const contest = {
		countdown_pause_time: '1:00:00'
	} as Contest;
	expect(getContestClock(contest)).toBe('-1:00:00');
});

test('getContestClock when countdown paused with time mutliple', () => {
	const contest = {
		countdown_pause_time: '1:00:00',
		time_multiplier: 2.5
	} as Contest;
	expect(getContestClock(contest)).toBe('-2:30:00');
});

test('getContestClock when contest in progress', () => {
	const now = Date.now();
	const pastTime = new Date(now - 3600000).toISOString();
	const contest = {
		id: 'test',
		start_time: pastTime,
		duration: '2:00:00'
	} as Contest;
	const state = {
		started: pastTime
	} as ContestState;
	expect(getContestClock(contest, state, now)).toBe('1:00:00');
});

test('getContestClock when contest in progress with time multiple', () => {
	const now = Date.now();
	const startTime = new Date(now - 3600000).toISOString();
	const contest = {
		start_time: startTime,
		time_multiplier: 2.5
	} as Contest;
	const state = {
		started: startTime
	} as ContestState;
	expect(getContestClock(contest, state, now)).toBe('2:30:00');
});

test('getContestClock when contest is over', () => {
	const now = Date.now();
	const startTime = new Date(now - 7200000).toISOString();
	const contest = {
		start_time: startTime
	} as Contest;
	const state = {
		started: startTime
	} as ContestState;
	expect(getContestClock(contest, state, now)).toBe('2:00:00');
});

test('getContestClock when contest in progress during removed interval', () => {
	const now = Date.now();
	const startTime = new Date(now - 7200000).toISOString();
	const startIntervalTime = new Date(now - 3600000).toISOString();
	const contest = {
		start_time: startTime
	} as Contest;
	const state = {
		started: startTime,
		removed_intervals: [{ start: startIntervalTime, contest_time: '1:00:00' }]
	} as ContestState;
	expect(getContestClock(contest, state, now)).toBe('1:00:00');
});

test('getContestClock when contest in progress after removed interval', () => {
	const now = Date.now();
	const startTime = new Date(now - 7200000).toISOString();
	const startIntervalTime = new Date(now - 3600000).toISOString();
	const endIntervalTime = new Date(now - 1800000).toISOString();
	const contest = {
		start_time: startTime
	} as Contest;
	const state = {
		started: startTime,
		removed_intervals: [{ start: startIntervalTime, end: endIntervalTime, contest_time: '1:00:00' }]
	} as ContestState;
	expect(getContestClock(contest, state, now)).toBe('1:30:00');
});
