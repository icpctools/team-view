import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ContestAPI } from './contest-api.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Response } from 'got';

function getFile(contestId: string, type: string): string {
	// use contest.json for the root
	const filename = type ? type : 'contest';
	// Path is relative to workspace root, not package root
	const filePath = resolve(`tests/contests/${contestId}/${filename}.json`);
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
