import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import ScoreboardHeader from './ScoreboardHeader.svelte';
import type { Problem } from '@icpctools/contest-api';

test('Expect pass-fail headers', async () => {
	const problems = [
		{ id: 'A', label: 'A', name: 'Problem A', ordinal: 0, statement: [] },
		{ id: 'B', label: 'B', name: 'Problem B', ordinal: 1, statement: [] }
	] as Problem[];
	render(ScoreboardHeader, { problems });

	expect(screen.getByText('Rank')).toBeInTheDocument();
	expect(screen.getByText('Team')).toBeInTheDocument();
	expect(screen.getByText('Solved')).toBeInTheDocument();
	expect(screen.getByText('Penalty')).toBeInTheDocument();
	expect(screen.getByText('A')).toBeInTheDocument();
	expect(screen.getByText('B')).toBeInTheDocument();
});

test('Expect score headers', async () => {
	const problems = [{ id: 'A', label: 'A', name: 'Problem A', ordinal: 0, statement: [] }] as Problem[];
	render(ScoreboardHeader, { problems, scoreboard_type: 'score' });

	expect(screen.getByText('Rank')).toBeInTheDocument();
	expect(screen.getByText('Score')).toBeInTheDocument();
	expect(screen.getByText('A')).toBeInTheDocument();
});

test('Expect problem click callback', async () => {
	const problems = [{ id: 'A', label: 'A', name: 'Problem A', ordinal: 0, statement: [] }] as Problem[];
	const mock = vi.fn();
	render(ScoreboardHeader, { problems, onselectproblem: mock });

	const problemLabel = screen.getByText('A');
	await userEvent.click(problemLabel.parentElement!);
	expect(mock).toHaveBeenCalledWith(problems[0]);
});
