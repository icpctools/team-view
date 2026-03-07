import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import StartStatusUI from './StartStatusUI.svelte';
import type { StartStatus } from '@icpctools/contest-api';

test('renders label text', async () => {
	const label = 'Contest Director';
	const status = { id: '1', label: label, status: 0 } as StartStatus;
	render(StartStatusUI, { status });

	expect(screen.getByText(label)).toBeInTheDocument();
});

test('status 0 shows red indicator aligned left', async () => {
	const status = { id: '1', label: 'Systems', status: 0 } as StartStatus;
	const { container } = render(StartStatusUI, { status });

	const indicator = container.querySelector('.rounded-full');
	expect(indicator).toHaveClass('bg-red-500');
	expect(indicator).toHaveClass('justify-self-start');
});

test('status 1 shows yellow indicator aligned center', async () => {
	const status = { id: '1', label: 'Marshalls', status: 1 } as StartStatus;
	const { container } = render(StartStatusUI, { status });

	const indicator = container.querySelector('.rounded-full');
	expect(indicator).toHaveClass('bg-yellow-500');
	expect(indicator).toHaveClass('justify-self-center');
});

test('status 2 shows green indicator aligned right', async () => {
	const status = { id: '1', label: 'Stroopwafels', status: 2 } as StartStatus;
	const { container } = render(StartStatusUI, { status });

	const indicator = container.querySelector('.rounded-full');
	expect(indicator).toHaveClass('bg-green-500');
	expect(indicator).toHaveClass('justify-self-end');
});
