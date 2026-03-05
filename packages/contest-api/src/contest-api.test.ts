import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ContestAPI } from './contest-api.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Response } from 'got';

function getFile(contestId: string, type: string): string {
	// use contest.json for the root
	const filename = type ? type : 'contest';
	// Path is relative to workspace root (two levels up from packages/contest-api)
	const filePath = resolve(import.meta.dirname, `../../../tests/contests/${contestId}/${filename}.json`);
	return readFileSync(filePath, 'utf8');
}

// Mock got module
vi.mock('got', () => {
	return {
		default: vi.fn((url: string) => {
			// Extract contest ID and type from URL
			const urlObj = new URL(url);
			const pathParts = urlObj.pathname.split('/').filter(Boolean);
			const contestsIndex = pathParts.indexOf('contests');
			const contestId = pathParts[contestsIndex + 1];
			const type = pathParts[contestsIndex + 2] || '';

			const file = getFile(contestId, type);

			return Promise.resolve({
				body: file,
				statusCode: 200
			} as Response);
		}),
		HTTPError: class HTTPError extends Error {
			response: { statusCode: number; statusMessage: string };
			constructor(response: { statusCode: number; statusMessage: string }) {
				super();
				this.response = response;
			}
		},
		RequestError: class RequestError extends Error {
			code: string;
			constructor(code: string) {
				super();
				this.code = code;
			}
		}
	};
});

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	// Cleanup if needed
});

test('load contest', async () => {
	const contestAPI = new ContestAPI('https://apiServer.org/api/contests/basic');

	await contestAPI.loadContest();
	const contest = contestAPI.getContest();
	expect(contest?.id).toBe('test');
	expect(contest?.name).toBe('Test Contest');
});

test('load groups', async () => {
	const contestAPI = new ContestAPI('https://apiServer.org/api/contests/basic');

	await contestAPI.loadGroups();
	const groups = contestAPI.getGroups();
	expect(groups.length).toBe(3);
	expect(groups[0].id).toBe('1');
	expect(groups[0].name).toBe('East');
	expect(groups[2].id).toBe('3');
	expect(groups[2].name).toBe('Rest');
});

test('load start-status', async () => {
	const contestAPI = new ContestAPI('https://apiServer.org/api/contests/basic');

	await contestAPI.loadStartStatus();
	const startStatus = contestAPI.getStartStatus();
	expect(startStatus?.length).toBe(3);
	expect(startStatus?.[0].id).toBe('Security');
	expect(startStatus?.[0].label).toBe('Security');
	expect(startStatus?.[0].status).toBe(1);
	expect(startStatus?.[1].id).toBe('SysOps');
	expect(startStatus?.[1].status).toBe(0);
	expect(startStatus?.[2].id).toBe('Teams');
	expect(startStatus?.[2].status).toBe(0);
});

test('load persons', async () => {
	const contestAPI = new ContestAPI('https://apiServer.org/api/contests/basic');

	await contestAPI.loadPersons();
	const persons = contestAPI.getPersons();
	expect(persons.length).toBe(6);
	expect(persons[0].id).toBe('29');
	expect(persons[0].name).toBe('Ali Kent');
	expect(persons[0].role).toBe('coach');
	expect(persons[0].team_ids).toEqual(['124']);
	expect(persons[2].name).toBe('Pawel Ollack');
	expect(persons[2].role).toBe('staff');
	expect(persons[2].title).toBe('ICPC Director');
});

test('load clarifications', async () => {
	const contestAPI = new ContestAPI('https://apiServer.org/api/contests/basic');

	await contestAPI.loadClarifications();
	const clarifications = contestAPI.getClarifications();
	expect(clarifications.length).toBe(8);
	expect(clarifications[0].id).toBe('A');
	expect(clarifications[0].text).toBe('A');
	expect(clarifications[0].to_team_id).toEqual('10');
	expect(clarifications[2].id).toBe('C');
	expect(clarifications[2].to_team_ids).toEqual(['10']);
	expect(clarifications[4].id).toBe('E');
	expect(clarifications[4].to_group_ids).toEqual(['1']);
	expect(clarifications[6].id).toBe('G');
	expect(clarifications[6].to_team_ids).toEqual(['10', '11']);
});

test('getURL', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	expect(contestAPI.getURL('groups')).toBe('https://api.example.com/api/contests/abc/groups');
	expect(contestAPI.getURL('teams', '1')).toBe('https://api.example.com/api/contests/abc/teams/1');
});

test('resolveURL with absolute href', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	const ref = { href: 'https://cdn.example.com/logo.png', filename: 'logo.png', mime: 'image/png' };
	expect(contestAPI.resolveURL(ref)).toBe('https://cdn.example.com/logo.png');
});

test('resolveURL with server-relative href', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	const ref = { href: '/static/logo.png', filename: 'logo.png', mime: 'image/png' };
	expect(contestAPI.resolveURL(ref)).toBe('https://api.example.com/static/logo.png');
});

test('resolveURL with base-relative href', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	const ref = { href: 'contests/abc/logo.png', filename: 'logo.png', mime: 'image/png' };
	expect(contestAPI.resolveURL(ref)).toBe('https://api.example.com/api/contests/abc/logo.png');
});

test('resolveURL with undefined ref', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	expect(contestAPI.resolveURL(undefined)).toBeUndefined();
});

test('getAuth', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/', {
		user: 'alice',
		password: 'secret'
	});
	expect(contestAPI.getAuth()).toBe(Buffer.from('alice:secret').toString('base64'));
});

test('getTimeDelta', () => {
	const contestAPI = new ContestAPI('https://api.example.com/api/contests/abc/');
	expect(contestAPI.getTimeDelta()).toBe(0);
});
