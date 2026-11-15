import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Table from './Table.svelte';
import SimpleColumn from './SimpleColumn.svelte';
import type { Column } from './table.js';

interface Row {
	id: string;
	name: string;
	score: number;
}

const data: Row[] = [
	{ id: '1', name: 'Beta', score: 30 },
	{ id: '2', name: 'Alpha', score: 10 },
	{ id: '3', name: 'Gamma', score: 20 }
];

const columns: Column<Row>[] = [
	{
		title: 'Name',
		renderer: SimpleColumn,
		rendererProps: (row) => ({ object: row.name }),
		comparator: (a, b) => a.name.localeCompare(b.name)
	},
	{
		title: 'Score',
		renderer: SimpleColumn,
		rendererProps: (row) => ({ object: String(row.score) }),
		comparator: (a, b) => a.score - b.score,
		initialOrder: 'descending'
	}
];

function names(): (string | null)[] {
	return screen
		.getAllByRole('row')
		.slice(1)
		.map((row) => row.querySelector('[role="cell"]')!.textContent);
}

test('clicking a column sets its indicator and clicking again reverses the sort', async () => {
	render(Table<Row>, { kind: 'test', data, columns });
	const name = screen.getByRole('columnheader', { name: 'Name' });

	await fireEvent.click(name);
	expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
	expect(name.querySelector('i')).toHaveClass('fa-sort-up');
	expect(name.querySelector('i')).not.toHaveClass('fa-sort');

	await fireEvent.click(name);
	expect(names()).toEqual(['Gamma', 'Beta', 'Alpha']);
	expect(name.querySelector('i')).toHaveClass('fa-sort-down');
	expect(data.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Gamma']);
});

test('default sort shows its direction and can be reversed', async () => {
	render(Table<Row>, { kind: 'test', data, columns, defaultSortColumn: 'Name' });
	const name = screen.getByRole('columnheader', { name: 'Name' });
	expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
	expect(name.querySelector('i')).toHaveClass('fa-sort-up');

	await fireEvent.click(name);
	expect(names()).toEqual(['Gamma', 'Beta', 'Alpha']);
	expect(name.querySelector('i')).toHaveClass('fa-sort-down');
});

test('switching columns uses the initial direction and clears the previous indicator', async () => {
	render(Table<Row>, { kind: 'test', data, columns, defaultSortColumn: 'Name' });
	const name = screen.getByRole('columnheader', { name: 'Name' });
	const score = screen.getByRole('columnheader', { name: 'Score' });

	await fireEvent.click(score);
	expect(names()).toEqual(['Beta', 'Gamma', 'Alpha']);
	expect(score.querySelector('i')).toHaveClass('fa-sort-down');
	expect(name.querySelector('i')).toHaveClass('fa-sort');
	expect(name.querySelector('i')).not.toHaveClass('fa-sort-up', 'fa-sort-down');

	await fireEvent.click(score);
	expect(names()).toEqual(['Alpha', 'Gamma', 'Beta']);
	expect(score.querySelector('i')).toHaveClass('fa-sort-up');
});
