import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import ProblemUI from './ProblemUI.svelte';
import { Problem } from '@icpctools/contest-api';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

test('Expect basic styling', async () => {
	const problem = { label: 'A' } as Problem;
	render(ProblemUI, { problem: problem });

	const pr = screen.getByText('A');
	expect(pr).toBeInTheDocument();
	expect(pr.parentElement).toHaveClass('cursor-default');
});

test('Expect basic styling', async () => {
	const problem = { label: 'B' } as Problem;
	render(ProblemUI, { problem: problem, onclick: () => {} });

	const pr = screen.getByText('B');
	expect(pr).toBeInTheDocument();
});

test('Expect clicking works', async () => {
	const problem = { label: 'C' } as Problem;
	const mock = vi.fn();
	await render(ProblemUI, { problem: problem, onclick: mock });

	const pr = screen.getByText('C');
	expect(pr).toBeInTheDocument();
	expect(pr.parentElement).toHaveClass('cursor-pointer');

	await userEvent.click(pr.parentElement);
	expect(mock).toHaveBeenCalled();
});
