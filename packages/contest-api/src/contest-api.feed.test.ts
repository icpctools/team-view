import { expect, test } from 'vitest';
import { ContestAPI } from './contest-api.js';

test('update the contest', async () => {
	const contestAPI = new ContestAPI('test');

	let contest = contestAPI.getContest();
	expect(contest).toBeUndefined();

	contestAPI.processNotification({ type: 'contest', data: { id: 'a', name: 'b' } });

	contest = contestAPI.getContest();
	expect(contest).toBeDefined();
	expect(contest?.id).toBe('a');
	expect(contest?.name).toBe('b');

	contestAPI.processNotification({ type: 'contest', data: { id: 'c', name: 'd' } });

	contest = contestAPI.getContest();
	expect(contest).toBeDefined();
	expect(contest?.id).toBe('c');
	expect(contest?.name).toBe('d');
});

test('update state', async () => {
	const contestAPI = new ContestAPI('test');

	let state = contestAPI.getState();
	expect(state).toBeUndefined();

	contestAPI.processNotification({ type: 'state', data: { started: 'xx' } });

	state = contestAPI.getState();
	expect(state).toBeDefined();
	expect(state?.started).toBe('xx');
	expect(state?.frozen).toBeUndefined();

	contestAPI.processNotification({ type: 'state', data: { frozen: 'yy' } });

	state = contestAPI.getState();
	expect(state).toBeDefined();
	expect(state?.started).toBeUndefined();
	expect(state?.frozen).toBe('yy');
});

test('update teams', async () => {
	const contestAPI = new ContestAPI('test');

	contestAPI.processNotification({ type: 'teams', data: [{ id: 'team1' }] });

	const teams = contestAPI.getTeams();
	expect(teams?.length).toEqual(1);
	expect(teams[0].id).toBe('team1');
});

test('update teams array', async () => {
	const contestAPI = new ContestAPI('test');

	contestAPI.processNotification({ type: 'teams', data: [{ id: 'team2' }, { id: 'team1' }] });

	// expect sorted teams 1,2
	let teams = contestAPI.getTeams();
	expect(teams?.length).toEqual(2);
	expect(teams[0].id).toBe('team1');
	expect(teams[1].id).toBe('team2');

	contestAPI.processNotification({ type: 'teams', data: [{ id: 'team4' }, { id: 'team3' }, { id: 'team5' }] });

	// expect sorted teams 3,4, 5
	teams = contestAPI.getTeams();
	expect(teams?.length).toEqual(3);
	expect(teams[0].id).toBe('team3');
	expect(teams[1].id).toBe('team4');
	expect(teams[2].id).toBe('team5');
});

test('update teams add', async () => {
	const contestAPI = new ContestAPI('test');

	contestAPI.processNotification({ type: 'teams', id: 'team2', data: { id: 'team2' } });
	contestAPI.processNotification({ type: 'teams', id: 'team1', data: { id: 'team1' } });

	// expect sorted teams
	const teams = contestAPI.getTeams();
	expect(teams?.length).toEqual(2);
	expect(teams[0].id).toBe('team1');
	expect(teams[1].id).toBe('team2');
});

test('update teams remove', async () => {
	const contestAPI = new ContestAPI('test');

	// add two, then delete one
	contestAPI.processNotification({ type: 'teams', data: [{ id: 'team1' }, { id: 'team2' }] });
	contestAPI.processNotification({ type: 'teams', id: 'team1' });

	const teams = contestAPI.getTeams();
	expect(teams?.length).toEqual(1);
	expect(teams[0].id).toBe('team2');
});
