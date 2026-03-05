import { expect, test } from 'vitest';
import { Access, FileReference, Problem } from './contest-types.js';
import { getFileByTag, getOppositeTag, hasEndpoint, hasEndpointProperty, sortProblems } from './contest-util.js';

test('getOppositeTag', () => {
	expect(getOppositeTag('light')).toBe('dark');
	expect(getOppositeTag('dark')).toBe('light');
	expect(getOppositeTag('sam')).toBeUndefined();
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

	expect(getFileByTag(files, 'a')).toEqual(file1);
	expect(getFileByTag(files, 'b')).toEqual(file1);
	expect(getFileByTag(files, 'c')).toEqual(file2);
	expect(getFileByTag(files, 'd')).toEqual(file2);
	expect(getFileByTag(files, 'e')).toBeUndefined();
	expect(getFileByTag(undefined, 'b')).toBeUndefined();
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

	expect(hasEndpoint(access, 'a')).toBeTruthy();
	expect(hasEndpoint(access, 'b')).toBeFalsy();
	expect(hasEndpoint(undefined, 'b')).toBeFalsy();
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

	expect(hasEndpointProperty(access, 'a', 'b')).toBeTruthy();
	expect(hasEndpointProperty(access, 'a', 'c')).toBeTruthy();
	expect(hasEndpointProperty(access, 'a', 'd')).toBeFalsy();
	expect(hasEndpointProperty(access, 'x', 'b')).toBeFalsy();
	expect(hasEndpointProperty(undefined, 'x', 'b')).toBeFalsy();
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

	const problems2 = sortProblems(problems);
	expect(problems2[0].ordinal).toBe(0);
	expect(problems2[0].id).toBe('a');
	expect(problems2[1].ordinal).toBe(1);
	expect(problems2[1].id).toBe('b');
	expect(problems2[2].ordinal).toBe(2);
	expect(problems2[2].id).toBe('c');
});
