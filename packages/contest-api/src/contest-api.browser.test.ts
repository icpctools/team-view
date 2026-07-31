// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from 'vitest';
import { ContestAPI } from './contest-api.js';
import { Contests } from './contests.js';
import { fetchOptions } from './fetch-utils.js';

const fixtures: Record<string, string> = {
	'': '{ "id": "test", "name": "Test Contest" }',
	groups: '[{ "id": "1", "name": "East" }, { "id": "2", "name": "West" }]',
	teams: '[{ "id": "5", "name": "Alpha" }, { "id": "3", "name": "Beta" }]',
	submissions: '[{ "id": "s1", "team_id": "3", "problem_id": "A" }]',
	scoreboard: '{ "rows": [{ "rank": 2, "team_id": "5", "score": {} }, { "rank": 1, "team_id": "3", "score": {} }] }',
	contests: '[{ "id": "test", "name": "Test Contest" }]'
};

const fetchMock = vi.fn((url: string) => {
	const urlObj = new URL(url);
	const pathParts = urlObj.pathname.split('/').filter(Boolean);
	const contestsIndex = pathParts.indexOf('contests');

	let type: string;
	if (pathParts.length <= contestsIndex + 1) {
		type = 'contests';
	} else {
		type = pathParts[contestsIndex + 2] || '';
	}

	const body = fixtures[type];
	if (body === undefined) {
		return Promise.resolve(new Response('Not found', { status: 404 }));
	}
	return Promise.resolve(new Response(body, { status: 200 }));
});

vi.stubGlobal('fetch', fetchMock);

beforeEach(() => {
	vi.clearAllMocks();
});

test('loadContest works in browser', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadContest();
	const contest = api.getContest();
	expect(contest?.id).toBe('test');
	expect(contest?.name).toBe('Test Contest');
});

test('loadGroups works in browser', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadGroups();
	const groups = api.getGroups();
	expect(groups.length).toBe(2);
	expect(groups[0].name).toBe('East');
});

test('loadTeams works in browser and sorts by id', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadTeams();
	const teams = api.getTeams();
	expect(teams.length).toBe(2);
	expect(teams[0].id).toBe('3');
	expect(teams[1].id).toBe('5');
});

test('loadSubmissions works in browser', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadSubmissions();
	const submissions = api.getSubmissions();
	expect(submissions.length).toBe(1);
	expect(submissions[0].team_id).toBe('3');
});

test('loadScoreboard works in browser and sorts by rank', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadScoreboard();
	const scoreboard = api.getScoreboard();
	expect(scoreboard?.rows.length).toBe(2);
	expect(scoreboard?.rows[0].rank).toBe(1);
	expect(scoreboard?.rows[1].rank).toBe(2);
});

test('processNotification works in browser', () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	api.processNotification({ type: 'teams', data: [{ id: 't1', name: 'Gamma' }] });
	expect(api.getTeams().length).toBe(1);
	expect(api.getTeams()[0].name).toBe('Gamma');
});

test('fetchOptions produces auth headers', () => {
	const opts = fetchOptions({ user: 'alice', password: 'secret' });
	const headers = opts.headers as Record<string, string>;
	expect(headers['Authorization']).toBe('Basic ' + btoa('alice:secret'));
});

test('fetchOptions works without credentials', () => {
	const opts = fetchOptions();
	const headers = opts.headers as Record<string, string>;
	expect(headers['Authorization']).toBeUndefined();
	expect(opts.signal).toBeDefined();
});

test('Contests.loadContests works in browser', async () => {
	const contests = new Contests('https://example.com/api/');
	await contests.loadContests();
	const list = contests.getContests();
	expect(list?.length).toBe(1);
	expect(list?.[0].id).toBe('test');
});

test('fetch is called with correct URL', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.loadContest();
	expect(fetchMock).toHaveBeenCalledWith(
		'https://example.com/api/contests/test/',
		expect.objectContaining({ headers: expect.any(Object) })
	);
});

test('fetch with credentials sends auth header', async () => {
	const api = new ContestAPI('https://example.com/api/contests/test', { user: 'u', password: 'p' });
	await api.loadContest();
	const callArgs = fetchMock.mock.calls[0] as unknown[];
	const headers = (callArgs[1] as RequestInit).headers as Record<string, string>;
	expect(headers['Authorization']).toBe('Basic ' + btoa('u:p'));
});

test('HTTP error throws in browser', async () => {
	fetchMock.mockResolvedValueOnce(new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' }));
	const api = new ContestAPI('https://example.com/api/contests/test');
	await expect(api.loadContest()).rejects.toThrow('401');
});

function ndjsonStream(lines: string[]): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	const data = encoder.encode(lines.join('\n') + '\n');
	return new ReadableStream({
		start(controller) {
			controller.enqueue(data);
			controller.close();
		}
	});
}

test('connectToFeed works in browser', async () => {
	const ndjson = [
		'{"type":"contest","data":{"id":"test","name":"Browser Contest"}}',
		'{"type":"teams","data":[{"id":"1","name":"Alpha"}]}',
		'{"type":"state","data":{"started":"2024-01-01T00:00:00Z"}}'
	];
	fetchMock.mockResolvedValueOnce(new Response(ndjsonStream(ndjson), { status: 200 }));

	const api = new ContestAPI('https://example.com/api/contests/test');
	const connected = await api.connectToFeed();

	expect(connected).toBe(true);
	expect(api.getContest()?.name).toBe('Browser Contest');
	expect(api.getTeams().length).toBe(1);
	expect(api.getTeams()[0].name).toBe('Alpha');
	expect(api.getState()?.started).toBe('2024-01-01T00:00:00Z');
});

test('connectToFeed handles chunked lines', async () => {
	const encoder = new TextEncoder();
	const line1 = '{"type":"teams","data":[{"id":"1","name":"Team1"}]}';
	const line2 = '{"type":"teams","id":"2","data":{"id":"2","name":"Team2"}}';
	const full = line1 + '\n' + line2 + '\n';
	const mid = Math.floor(full.length / 2);

	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(full.slice(0, mid)));
			controller.enqueue(encoder.encode(full.slice(mid)));
			controller.close();
		}
	});

	fetchMock.mockResolvedValueOnce(new Response(stream, { status: 200 }));

	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.connectToFeed();

	expect(api.getTeams().length).toBe(2);
});

test('connectToFeed handles CRLF line endings', async () => {
	const ndjson =
		'{"type":"teams","data":[{"id":"1","name":"A"}]}\r\n{"type":"teams","id":"2","data":{"id":"2","name":"B"}}\r\n';
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(ndjson));
			controller.close();
		}
	});

	fetchMock.mockResolvedValueOnce(new Response(stream, { status: 200 }));

	const api = new ContestAPI('https://example.com/api/contests/test');
	await api.connectToFeed();

	expect(api.getTeams().length).toBe(2);
});
