import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import Clock from './Clock.svelte';
import { Contest } from '@icpctools/contest-api';
import { beforeEach } from 'vitest';

beforeEach(() => {
	vi.resetAllMocks();
});

test('Expect unscheduled styling', async () => {
	await render(Clock);

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
});

test('Expect unscheduled styling', async () => {
	await render(Clock, { contest: {} });

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
	expect(clock).toHaveTextContent('Contest not scheduled');
	expect(clock).toHaveClass('text-gray-400');
});

test('Expect paused styling', async () => {
	const contest = { countdown_pause_time: '1:00:00.000' } as Contest;
	await render(Clock, { contest: contest });

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
	expect(clock).toHaveTextContent('-1:00:00 (paused)');
	expect(clock).toHaveClass('text-yellow-500');
});

test('Expect countdown styling', async () => {
	const contest = { start_time: '2200-01-01T12:00:00+00:00' } as Contest;
	await render(Clock, { contest: contest });

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
	expect(clock).toHaveClass('text-green-300');
});

test('Expect frozen styling', async () => {
	const contest = {
		start_time: '2026-03-03T12:00:00+00:00',
		duration: '99:00:00.000',
		scoreboard_freeze_duration: '98:00:00.000'
	} as Contest;
	vi.spyOn(Date, 'now').mockReturnValue(1772569075932);

	await render(Clock, { contest: contest });

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
	expect(clock).toHaveClass('text-blue-200');
});

test('Expect finished styling', async () => {
	const contest = { start_time: '2000-01-01T12:00:00+00:00', duration: '5:00:00.000' } as Contest;
	// Mock Date.now to be after contest end (start 12:00 UTC + 5h duration)
	vi.useFakeTimers();
	vi.setSystemTime(new Date('2000-01-01T17:00:01Z'));
	await render(Clock, { contest: contest });

	const clock = screen.getByLabelText('contest clock');
	expect(clock).toBeInTheDocument();
	expect(clock).toHaveClass('text-gray-300');
	vi.useRealTimers();
});
