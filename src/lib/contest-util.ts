/**
 * Copyright later.
 */
import type { ContestAPI } from './contest-api';
import { parseRelTime } from './contest-time-util';
import type { FileReference, Problem, Submission } from './contest-types';

export class ContestUtil {
	findById<Type extends { id: string }>(arr: Array<Type> | undefined, id: string | undefined): Type | undefined {
		if (!arr || arr.length === 0 || !id) {
			return undefined;
		}

		for (var i = 0; i < arr.length; i++) {
			if (id === arr[i].id) {
				return arr[i];
			}
		}
		return undefined;
	}

	findManyById<Type extends { id: string }>(
		arr: Array<Type> | undefined,
		ids: string | undefined
	): Array<Type> | undefined {
		if (!arr || arr.length === 0 || !ids || ids.length == 0) {
			return undefined;
		}

		var list = [];
		for (var j = 0; j < ids.length; j++) {
			for (var i = 0; i < arr.length; i++) {
				if (ids[j] === arr[i].id) {
					list.push(arr[i]);
				}
			}
		}
		return list;
	}

	findManyBySubmissionId<Type extends { submission_id: string }>(
		arr: Array<Type> | undefined,
		id: string | undefined
	): Array<Type> | undefined {
		if (!arr || arr.length === 0 || !id) {
			return undefined;
		}

		var list = [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].submission_id === id) {
				list.push(arr[i]);
			}
		}
		return list;
	}

	bestLogo(logos: FileReference[] | undefined, width: number, height: number, tag?: string): FileReference | undefined {
		if (!logos || logos.length == 0 || width < 1 || height < 1) {
			return undefined;
		}

		if (logos.length == 1) {
			return logos[0];
		}

		if (tag) {
			// look for images that have the given tag
			const arr = [];
			for (const logo of logos) {
				let found = false;
				if (logo.tags) {
					for (const tag2 of logo.tags) {
						if (tag2 === tag) {
							found = true;
							break;
						}
					}
				}
				if (found) {
					arr.push(logo);
				}
			}

			// use the filtered list - unless it's empty
			if (arr.length > 0) {
				logos = arr;
			}
		}

		// return an svg if possible
		for (const logo of logos) {
			if ('image/svg+xml' == logo.mime) {
				return logo;
			}
		}

		let best: FileReference | undefined;
		for (const ref of logos) {
			if (best == null) {
				best = ref;
			} else {
				if (best.width && best.width < width && best.height && best.height < height) {
					// current best image is too small - is this one better (larger than current)?
					if ((ref.width && best.width && ref.width > best.width) || (ref.height && ref.height > best.height))
						best = ref;
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

	isFirstToSolve(contest: ContestAPI, submission: Submission): boolean {
		const problem_id = submission.problem_id;
		const submissions = contest.getSubmissions();
		if (!submissions) {
			return false;
		}

		for (var i = 0; i < submissions.length; i++) {
			const time: number | string | undefined = parseRelTime(submissions[i].contest_time);
			if (time && time >= 0 && submissions[i].problem_id == problem_id) {
				// TODO: should we check if this is a public team too?
				const judgements = this.findManyBySubmissionId(contest.getJudgements(), submissions[i].id);
				if (judgements != null && judgements.length > 0) {
					const jt = this.findById(
						contest.getJudgementTypes(),
						judgements[judgements.length - 1].judgement_type_id
					);
					if (jt != null) {
						if (jt.solved) {
							if (submission == submissions[i]) return true;
							return false;
						}
					}
				}
			}
		}
		return false;
	}

	sortProblems(problems: Problem[]): any {
		return problems.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
	}
}
