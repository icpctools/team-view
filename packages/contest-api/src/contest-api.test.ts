import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ContestAPI } from './contest-api';
import { setupServer, type SetupServerApi } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

class TestContestAPI extends ContestAPI {
	id: string;

	constructor(id: string) {
		super(`https://apiServer.org/api/contests/${id}`);
		this.id = id;

		server = setupServer(
			http.get(`https://apiServer.org/api/contests/${id}/*`, (x) => {
				const ind = x.request.url.lastIndexOf('/');
				const type = x.request.url.substring(ind+1);
				const file = this.getFile(type);
				return HttpResponse.json(JSON.parse(file));
			}),
		);
		server.listen({ onUnhandledRequest: 'error' });
	}

	getFile(type: string): string {
		// use contest.json for the root
		const filename = type ? type : 'contest';
		const filePath = resolve(`tests/contests/${this.id}/${filename}.json`);
		return readFileSync(filePath, 'utf8');
	}
}

let server: SetupServerApi | undefined = undefined;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  server?.close();
});

test('load contest', async () => {
	const contestAPI = new TestContestAPI('basic');

	await contestAPI.loadContest();
	const contest = contestAPI.getContest();
	expect(contest?.id).toBe("test");
	expect(contest?.name).toBe("Test Contest");
});

test('load groups', async () => {
	const contestAPI = new TestContestAPI('basic');

	await contestAPI.loadGroups();
	const groups = contestAPI.getGroups();
	expect(groups.length).toBe(3);
	expect(groups[0].id).toBe('1');
	expect(groups[0].name).toBe('East');
	expect(groups[2].id).toBe('3');
	expect(groups[2].name).toBe('Rest');
});

