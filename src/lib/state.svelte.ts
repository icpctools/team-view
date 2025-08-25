import { Contests } from "./contests";
import { CONTEST } from "./hardcoded.svelte";

const contestsImpl = new Contests(CONTEST.url);

await contestsImpl.loadContests();

if (!contestsImpl) {
    console.log('error loading contests');
}

export const contests = contestsImpl;

export const contest = contests.getContest();
