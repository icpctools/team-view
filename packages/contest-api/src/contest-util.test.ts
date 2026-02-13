import { expect, test } from 'vitest';
import { ContestUtil } from './contest-util.js';
import { Access, FileReference, Problem } from './contest-types.js';

const util = new ContestUtil();

test('getOppositeTag', () => {
	expect(util.getOppositeTag('light')).toBe('dark');
	expect(util.getOppositeTag('dark')).toBe('light');
	expect(util.getOppositeTag('sam')).toBeUndefined();
});

test('getFileByTag', () => {
	const file1 = {
		href: 'href',
		filename: 'name',
		mime: 'mime',
		tags: ['a', 'b']
	} as FileReference;
	const file2 = {
		href: 'href',
		filename: 'name',
		mime: 'mime',
		tags: ['c', 'd']
	} as FileReference;
	const file3 = {
		href: 'href',
		filename: 'name',
		mime: 'mime'
		// no tags
	} as FileReference;

	const files = [file1, file2, file3] as FileReference[];

	expect(util.getFileByTag(files, 'a')).toEqual(file1);
	expect(util.getFileByTag(files, 'b')).toEqual(file1);
	expect(util.getFileByTag(files, 'c')).toEqual(file2);
	expect(util.getFileByTag(files, 'd')).toEqual(file2);
	expect(util.getFileByTag(files, 'e')).toBeUndefined();
	expect(util.getFileByTag(undefined, 'b')).toBeUndefined();
});

test('hasEndpoint', () => {
	const access = {
		capabilities: [],
		endpoints: [
			{
				type: 'a',
				properties: []
			}
		]
	} as Access;

	expect(util.hasEndpoint(access, 'a')).toBeTruthy();
	expect(util.hasEndpoint(access, 'b')).toBeFalsy();
	expect(util.hasEndpoint(undefined, 'b')).toBeFalsy();
});

test('hasEndpointProperty', () => {
	const access = {
		capabilities: [],
		endpoints: [
			{
				type: 'a',
				properties: ['b', 'c']
			}
		]
	} as Access;

	expect(util.hasEndpointProperty(access, 'a', 'b')).toBeTruthy();
	expect(util.hasEndpointProperty(access, 'a', 'c')).toBeTruthy();
	expect(util.hasEndpointProperty(access, 'a', 'd')).toBeFalsy();
	expect(util.hasEndpointProperty(access, 'x', 'b')).toBeFalsy();
	expect(util.hasEndpointProperty(undefined, 'x', 'b')).toBeFalsy();
});

test('sortProblems', () => {
	const problems = [
		{
			id: 'c',
			label: 'C',
			name: 'C problem',
			ordinal: 2,
			statement: []
		},
		{
			id: 'a',
			label: 'A',
			name: 'A problem',
			ordinal: 0,
			statement: []
		},
		{
			id: 'b',
			label: 'B',
			name: 'B problem',
			ordinal: 1,
			statement: []
		}
	] as Problem[];

	const problems2 = util.sortProblems(problems);
	expect(problems2[0].ordinal).toBe(0);
	expect(problems2[0].id).toBe('a');
	expect(problems2[1].ordinal).toBe(1);
	expect(problems2[1].id).toBe('b');
	expect(problems2[2].ordinal).toBe(2);
	expect(problems2[2].id).toBe('c');
});
