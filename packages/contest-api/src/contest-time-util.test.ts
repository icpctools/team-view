import { expect, test } from 'vitest';
import { formatContestTime, getContestState, getContestClock, parseRelTime, timeToMin } from './contest-time-util.js';
import type { Contest } from './contest-types.js';

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

test('getContestState with undefined contest', () => {
	expect(getContestState(undefined)).toBe('unscheduled');
});

test('getContestState with unscheduled contest', () => {
	const contest = {
		id: 'test',
		name: 'Test',
		duration: '5:00:00',
		scoreboard_type: 'pass-fail'
	} as Contest;
	expect(getContestState(contest)).toBe('unscheduled');
});

test('getContestState with countdown', () => {
	const futureTime = new Date(Date.now() + 3600000).toISOString();
	const contest = {
		id: 'test',
		name: 'Test',
		start_time: futureTime,
		duration: '5:00:00',
		scoreboard_type: 'pass-fail'
	} as Contest;
	expect(getContestState(contest)).toBe('countdown');
});

test('getContestState with finished contest', () => {
	const pastTime = new Date(Date.now() - 7200000).toISOString();
	const contest = {
		id: 'test',
		name: 'Test',
		start_time: pastTime,
		duration: '1:00:00',
		scoreboard_type: 'pass-fail'
	} as Contest;
	expect(getContestState(contest)).toBe('finished');
});

test('getContestClock with undefined contest', () => {
	expect(getContestClock(undefined, false)).toBeUndefined();
});

test('getContestClock when not scheduled', () => {
	const contest = {
		id: 'test',
		name: 'Test',
		duration: '5:00:00',
		scoreboard_type: 'pass-fail'
	} as Contest;
	expect(getContestClock(contest)).toBeUndefined();
});

test('getContestClock when contest is over', () => {
	const pastTime = new Date(Date.now() - 7200000).toISOString();
	const contest = {
		id: 'test',
		name: 'Test',
		start_time: pastTime,
		duration: '1:00:00',
		scoreboard_type: 'pass-fail'
	} as Contest;
	expect(getContestClock(contest)).toBe('2:00:00');
});
