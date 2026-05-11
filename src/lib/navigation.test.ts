import { describe, expect, test, vi, beforeEach } from 'vitest';
import type { Problem, Team } from '@icpctools/contest-api';
import { gotoTeam, gotoTeamId, gotoProblem } from './navigation.js';
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';

vi.mock('$app/navigation');
vi.mock('$app/paths');

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(resolve).mockImplementation((path) => path as ReturnType<typeof resolve>);
	vi.mocked(goto).mockResolvedValue(undefined);
});

describe('gotoTeam', () => {
	test('navigates to team page with team object', async () => {
		const team: Team = {
			id: 'team-123',
			name: 'Test Team'
		} as Team;

		await gotoTeam(team);

		expect(resolve).toHaveBeenCalledWith('/team/team-123');
		expect(goto).toHaveBeenCalledWith('/team/team-123');
	});

	test('does not navigate when team is undefined', async () => {
		await gotoTeam(undefined);

		expect(resolve).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});

	test('does not navigate when team has no id', async () => {
		const team = {} as Team;

		await gotoTeam(team);

		expect(resolve).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});
});

describe('gotoTeamId', () => {
	test('navigates to team page with team id', async () => {
		await gotoTeamId('team-456');

		expect(resolve).toHaveBeenCalledWith('/team/team-456');
		expect(goto).toHaveBeenCalledWith('/team/team-456');
	});

	test('does not navigate when team id is undefined', async () => {
		await gotoTeamId(undefined);

		expect(resolve).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});

	test('does not navigate when team id is empty string', async () => {
		await gotoTeamId('');

		expect(resolve).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});
});

describe('gotoProblem', () => {
	test('navigates to problem page with problem object', async () => {
		const problem: Problem = {
			id: 'problem-a',
			label: 'A',
			name: 'Test Problem'
		} as Problem;

		await gotoProblem(problem);

		expect(resolve).toHaveBeenCalledWith('/problem/problem-a');
		expect(goto).toHaveBeenCalledWith('/problem/problem-a');
	});

	test('does not navigate when problem is undefined', async () => {
		await gotoProblem(undefined);

		expect(resolve).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});

	test('navigates to problem page when problem has no id', async () => {
		const problem = {} as Problem;

		await gotoProblem(problem);

		expect(resolve).toHaveBeenCalledWith('/problem/undefined');
		expect(goto).toHaveBeenCalledWith('/problem/undefined');
	});
});
