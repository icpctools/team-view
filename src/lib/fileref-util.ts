/**
 * Copyright later.
 */
import type { FileReferenceJSON } from '$lib/contest-types';
import { CONTEST } from '$lib/hardcoded.svelte';

export function resolveFileRef(ref: FileReferenceJSON | undefined): string | undefined {
	if (!ref)
		return undefined;

	const url: string = CONTEST.url + 'contests';
	return url.substring(0, CONTEST.url.length) + ref?.href;
}
