# @icpctools/contest-api

A TypeScript library for accessing ICPC contest data via the
[Contest API](https://ccs-specs.icpc.io). Supports servers implementing the 2023-06 and 2026-01
specifications.

It loads contest data over REST, keeps it up to date by following the event feed, and notifies
listeners when anything changes. It is used by [Team View](https://github.com/icpctools/team-view)
and [@icpctools/contest-ui](https://www.npmjs.com/package/@icpctools/contest-ui).

## Installation

```bash
npm install @icpctools/contest-api
```

The library uses the standard `fetch` API and runs in Node.js 18+ or modern browsers.

> **Note:** Contest servers commonly use self-signed certificates, so in Node.js this library sets
> `NODE_TLS_REJECT_UNAUTHORIZED=0` when it is loaded. This disables TLS certificate verification
> for the whole process.

## Usage

### Finding a contest

Use `Contests` to list the contests on a server and get a `ContestAPI` for one of them:

```ts
import { Contests } from '@icpctools/contest-api';

const contests = new Contests('https://cds.example.com/api/', {
	user: 'admin',
	password: 'secret'
});
await contests.loadContests();

console.log(contests.getContests()); // Contest[]

// Pass a contest id, or omit it to use the first contest
const contest = contests.getContest('finals');
```

You can also create a `ContestAPI` directly if you already know the contest URL:

```ts
import { ContestAPI } from '@icpctools/contest-api';

const contest = new ContestAPI('https://cds.example.com/api/contests/finals', {
	user: 'admin',
	password: 'secret'
});
```

### Loading data

Each endpoint has a `load*()` method that fetches it, and a matching `get*()` method that returns
the cached value. Pass `true` to force a reload.

```ts
await contest.loadContest();
await contest.loadProblems();
await contest.loadTeams();
await contest.loadScoreboard();

console.log(contest.getContest()?.name);
console.log(contest.getProblems().map((p) => p.label));
console.log(contest.getScoreboard()?.rows);
```

Available endpoints include contest, state, access, languages, judgement types, problems, groups,
organizations, teams, persons, accounts, submissions, judgements, runs, clarifications,
commentary, scoreboard, awards, and map info.

### Watching for live updates

`watch()` loads the full contest and then follows the event feed, keeping all data current and
automatically reconnecting if the connection drops. Register a listener to be notified of
changes:

```ts
contest.addContestListener((event) => {
	// e.g. { type: 'submissions', id: '123' }
	console.log(`Changed: ${event.type} ${event.id ?? ''}`);
});

await contest.watch(); // resolves once the initial contest data has loaded

// later
contest.unwatch();
```

The scoreboard is not part of the event feed, so it is reloaded automatically (throttled) when
relevant events arrive.

### Utilities

The package also exports helpers for working with contest data:

```ts
import {
	findById,
	sortProblems,
	bestLogo,
	isFirstToSolve,
	getContestTime,
	getRemainingContestTime,
	formatContestTime,
	parseRelTime
} from '@icpctools/contest-api';

const team = findById(contest.getTeams(), '42');
const org = findById(contest.getOrganizations(), team?.organization_id);
const logo = bestLogo(org?.logo, 64, 64); // pick the best-sized file reference

const elapsed = getContestTime(contest.getContest(), contest.getState());
console.log(formatContestTime(elapsed)); // e.g. "2:15:07"
```

All Contest API object types (`Contest`, `Team`, `Problem`, `Submission`, `Scoreboard`, etc.) are
exported as TypeScript types.

### Proxying file references

If your client cannot reach the contest server directly (e.g. a browser with CORS restrictions),
pass a proxy URL as the third constructor argument. Server-relative file references (logos,
photos, video streams) will then be rewritten to go through the proxy:

```ts
const contest = new ContestAPI(url, credentials, '/proxy');
```

## License

MIT © ICPC Foundation
