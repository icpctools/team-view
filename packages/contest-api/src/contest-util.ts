/**
 * Copyright later.
 */
import type { ContestAPI } from './contest-api.js';
import { parseRelTime } from './contest-time-util.js';
import type { Access, FileReference, Problem, Submission } from './contest-types.js';

export function findById<Type extends { id: string }>(
	arr: Array<Type> | undefined,
	id: string | undefined
): Type | undefined {
	if (!arr || arr.length === 0 || !id) {
		return undefined;
	}

	for (let i = 0; i < arr.length; i++) {
		if (id === arr[i].id) {
			return arr[i];
		}
	}
	return undefined;
}

export function findManyById<Type extends { id: string }>(
	arr: Array<Type> | undefined,
	ids: string[] | undefined
): Array<Type> | undefined {
	if (!arr || arr.length === 0 || !ids || ids.length == 0) {
		return undefined;
	}

	const list = [];
	for (let j = 0; j < ids.length; j++) {
		for (let i = 0; i < arr.length; i++) {
			if (ids[j] === arr[i].id) {
				list.push(arr[i]);
			}
		}
	}
	return list;
}

export function findManyBySubmissionId<Type extends { submission_id: string }>(
	arr: Array<Type> | undefined,
	id: string | undefined
): Array<Type> | undefined {
	if (!arr || arr.length === 0 || !id) {
		return undefined;
	}

	const list = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].submission_id === id) {
			list.push(arr[i]);
		}
	}
	return list;
}

export function getOppositeTag(tag: string): string | undefined {
	if ('light' === tag) {
		return 'dark';
	} else if ('dark' === tag) {
		return 'light';
	}
	return undefined;
}

export function getFileByTag(files: FileReference[] | undefined, tag: string): FileReference | undefined {
	if (!files || files.length == 0) {
		return undefined;
	}

	if (files.length === 1) {
		return files[0];
	}

	// look for a file that has the given tag
	for (const file of files) {
		if (file.tags) {
			for (const tag2 of file.tags) {
				if (tag2 === tag) {
					return file;
				}
			}
		}
	}

	return undefined;
}

export function bestLogo(
	logos: FileReference[] | undefined,
	width: number,
	height: number,
	tag?: string
): FileReference | undefined {
	if (!logos || logos.length === 0 || width < 1 || height < 1) {
		return undefined;
	}

	if (logos.length === 1) {
		return logos[0];
	}

	const matchingTags = [];
	const nonOppositeTags = [];
	// filter looking for files with matching tag
	if (tag) {
		for (const logo of logos) {
			if (logo.tags) {
				let found = false;
				for (const tag2 of logo.tags) {
					if (tag2 === tag) {
						matchingTags.push(logo);
						found = true;
						break;
					} else if (tag2 === getOppositeTag(tag)) {
						found = true;
						break;
					}
				}
				if (!found) {
					nonOppositeTags.push(logo);
				}
			} else {
				nonOppositeTags.push(logo);
			}
		}
	} else {
		for (const logo of logos) {
			if (!logo.tags || logo.tags.length === 0) {
				matchingTags.push(logo);
			}
		}
	}

	let logos2 = logos;
	if (matchingTags.length > 0) {
		// If we have at least one file with the tag, use it
		logos2 = matchingTags;
	} else if (nonOppositeTags.length > 0) {
		// Otherwise, use the list of files without any tag, if not empty
		logos2 = nonOppositeTags;
	}

	// return an svg if possible
	for (const logo of logos2) {
		if ('image/svg+xml' === logo.mime) {
			return logo;
		}
	}

	let best: FileReference | undefined;
	for (const ref of logos2) {
		if (!best) {
			best = ref;
		} else {
			if (best.width && best.width < width && best.height && best.height < height) {
				// current best image is too small - is this one better (larger than current)?
				if ((ref.width && best.width && ref.width > best.width) || (ref.height && ref.height > best.height)) best = ref;
				else if (best.width > width && best.height > height) {
					// current image is too big - is this one better (smaller but still big enough)?
					if ((ref.width && ref.width < best.width) || (ref.height && ref.height < best.height)) {
						if ((ref.width && ref.width >= width) || (ref.height && ref.height >= height)) best = ref;
					}
				}
			}
		}
	}
	return best;
}

export function isFirstToSolve(contest: ContestAPI, submission: Submission): boolean {
	const problem_id = submission.problem_id;
	const submissions = contest.getSubmissions();
	if (!submissions) {
		return false;
	}

	for (let i = 0; i < submissions.length; i++) {
		const time: number | string | undefined = parseRelTime(submissions[i].contest_time);
		if (time && time >= 0 && submissions[i].problem_id == problem_id) {
			// TODO: should we check if this is a public team too?
			const judgements = findManyBySubmissionId(contest.getJudgements(), submissions[i].id);
			if (judgements && judgements.length > 0) {
				const jt = findById(contest.getJudgementTypes(), judgements[judgements.length - 1].judgement_type_id);
				if (jt && jt.solved) {
					return submission == submissions[i];
				}
			}
		}
	}
	return false;
}

export function sortProblems(problems: Problem[]): Problem[] {
	return problems.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
}

export function hasEndpoint(acc: Access | undefined, endpoint: string): boolean {
	if (!acc || !acc.endpoints || !endpoint) {
		return false;
	}

	for (const ep of acc.endpoints) {
		if (endpoint === ep.type) return true;
	}

	return false;
}

export function hasEndpointProperty(acc: Access | undefined, endpoint: string, property: string): boolean {
	if (!acc || !acc.endpoints || !endpoint || !property) {
		return false;
	}

	for (const ep of acc.endpoints) {
		if (endpoint === ep.type) {
			for (const p of ep.properties) {
				if (property === p) {
					return true;
				}
			}
			return false;
		}
	}

	return false;
}
