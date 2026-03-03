import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import JudgementTypeUI from './JudgementTypeUI.svelte';
import { JudgementType } from '@icpctools/contest-api';

test('Expect basic styling', async () => {
	const jt = { id: 'JE' } as JudgementType;
	await render(JudgementTypeUI, { judgementType: jt });

	const jtui = screen.getByText('JE');
	expect(jtui).toBeInTheDocument();
	expect(jtui).toHaveClass('bg-cyan-600');
});

test('Expect solved styling', async () => {
	const jt = { id: 'AC', solved: true } as JudgementType;
	await render(JudgementTypeUI, { judgementType: jt });

	const jtui = screen.getByText('AC');
	expect(jtui).toBeInTheDocument();
	expect(jtui).toHaveClass('bg-green-600');
});

test('Expect penalty styling', async () => {
	const jt = { id: 'WA', penalty: true } as JudgementType;
	await render(JudgementTypeUI, { judgementType: jt });

	const jtui = screen.getByText('WA');
	expect(jtui).toBeInTheDocument();
	expect(jtui).toHaveClass('bg-red-600');
});
