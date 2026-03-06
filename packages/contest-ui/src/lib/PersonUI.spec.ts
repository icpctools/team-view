import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import PersonUI from './PersonUI.svelte';
import type { Person } from '@icpctools/contest-api';

test('Expect person name displayed', async () => {
	const person = { id: '1', name: 'Alice Smith', role: 'contestant' } as Person;
	render(PersonUI, { person });

	expect(screen.getByText('Alice Smith')).toBeInTheDocument();
});

test('Expect unavailable when no photo', async () => {
	const person = { id: '1', name: 'Bob Jones', role: 'contestant' } as Person;
	render(PersonUI, { person });

	expect(screen.getByText('Bob Jones')).toBeInTheDocument();
	expect(screen.getByText('(unavailable)')).toBeInTheDocument();
});

test('Expect photo displayed when present', async () => {
	const person = {
		id: '1',
		name: 'Carol Lee',
		role: 'contestant',
		photo: [{ href: 'https://example.com/photo.png', filename: 'photo.png', mime: 'image/png' }]
	} as Person;
	render(PersonUI, { person });

	expect(screen.getByText('Carol Lee')).toBeInTheDocument();
	expect(screen.getByAltText('logo')).toBeInTheDocument();
});
