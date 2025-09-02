/**
 * Copyright later.
 */
import type { FileReferenceJSON } from '$lib/contest-types';
import { CONTEST } from '$lib/hardcoded.svelte';

export function resolveFileRef(ref: FileReferenceJSON | undefined): string | undefined {
	if (!ref)
		return undefined;

	// Use fullHref if available (set by server-side processing)
	if (ref.fullHref) {
		return ref.fullHref;
	}

	// Fallback to original logic for client-side usage
	const url: string = CONTEST.url + 'contests';
	return url.substring(0, CONTEST.url.length) + ref?.href;
}
