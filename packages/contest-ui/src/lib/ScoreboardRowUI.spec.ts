import '@testing-library/jest-dom/vitest';

import { render, screen, within } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import ScoreboardRowUI from './ScoreboardRowUI.svelte';
import type { Problem, ScoreboardRow, Team } from '@icpctools/contest-api';

test('Expect pass-fail row displayed', async () => {
	const problems = [
		{ id: 'A', label: 'A', name: 'Problem A', ordinal: 0, statement: [] },
		{ id: 'B', label: 'B', name: 'Problem B', ordinal: 1, statement: [] }
	] as Problem[];
	const row = {
		rank: 1,
		team_id: '1',
		score: { num_solved: 2, total_time: 120 },
		problems: [
			{ problem_id: 'A', num_judged: 1, num_pending: 0, solved: true, time: 60 },
			{ problem_id: 'B', num_judged: 1, num_pending: 0, solved: true, time: 60 }
		]
	} as ScoreboardRow;
	const team = { id: '1', name: 'Team One', display_name: 'Team One', label: '1', organization_id: 'org1' } as Team;

	render(ScoreboardRowUI, { row, problems, team, scoreboard_type: 'pass-fail' });

	const scoreboardRow = screen.getByRole('row');
	expect(within(scoreboardRow).getByText('Team One')).toBeInTheDocument();
	expect(screen.getByText('2')).toBeInTheDocument();
	expect(screen.getByText('120')).toBeInTheDocument();
});

test('Expect score row displayed', async () => {
	const problems = [{ id: 'A', label: 'A', name: 'Problem A', ordinal: 0, statement: [], max_score: 100 }] as Problem[];
	const row = {
		rank: 1,
		team_id: '1',
		score: { score: 85 },
		problems: [{ problem_id: 'A', num_judged: 1, num_pending: 0, score: 85 }]
	} as ScoreboardRow;
	const team = { id: '1', name: 'Team One', display_name: 'Team One', label: '1', organization_id: 'org1' } as Team;

	render(ScoreboardRowUI, { row, problems, team, scoreboard_type: 'score' });

	expect(screen.getByText('Team One')).toBeInTheDocument();
	expect(screen.getAllByText('85').length).toBeGreaterThanOrEqual(1);
});

test('Expect team link has correct href', async () => {
	const problems = [] as Problem[];
	const row = { rank: 1, team_id: '1', score: {} } as ScoreboardRow;
	const team = { id: '42', name: 'Test Team', display_name: 'Test Team', label: '42', organization_id: 'org1' } as Team;

	render(ScoreboardRowUI, { row, problems, team });

	const link = screen.getByRole('link', { name: 'Test Team' });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', '/team/42');
});
