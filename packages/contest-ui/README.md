# @icpctools/contest-ui

Reusable [Svelte 5](https://svelte.dev) components for displaying ICPC contest data: clocks,
logos, problems, judgements, floor maps, video streams, and sortable/animated tables for
scoreboards and submission lists.

Components work with the data types from
[@icpctools/contest-api](https://www.npmjs.com/package/@icpctools/contest-api), and are used by
[Team View](https://github.com/icpctools/team-view).

## Installation

```bash
npm install @icpctools/contest-ui
```

Requires Svelte 5 as a peer dependency.

### Styling

Components are styled with [Tailwind CSS 4](https://tailwindcss.com) utility classes and
[Font Awesome](https://fontawesome.com) icons, so your app needs both. Tell Tailwind to scan this
package and define the theme colors the components use:

```css
@import 'tailwindcss';

@source '../node_modules/@icpctools/contest-ui/dist';

@theme {
	--color-hover: light-dark(var(--color-gray-400), var(--color-gray-700));
	--color-link: light-dark(var(--color-blue-600), var(--color-blue-400));
}
```

And import the Font Awesome stylesheet once, e.g. in your root layout:

```ts
import '@fortawesome/fontawesome-free/css/all.min.css';
```

Light/dark logo selection uses [mode-watcher](https://www.npmjs.com/package/mode-watcher). A
fallback image is loaded from `/images/icpc-logo.png`, so serve one from your static assets.

## Components

| Component           | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `Clock`             | Contest time, remaining time, or wall clock                      |
| `Logo`, `Image`     | Best-fit image from a list of file references (light/dark aware) |
| `ProblemUI`         | Problem label badge in the problem's color                       |
| `JudgementTypeUI`   | Judgement type badge (e.g. AC, WA)                               |
| `JudgementUI`       | Judgement result badge                                           |
| `PersonUI`          | Person name and photo                                            |
| `FloorMap`          | Contest floor map with team locations                            |
| `Video`             | Live video player (supports MPEG-TS streams)                     |
| `ICPC`, `ICPCtools` | ICPC and ICPC Tools logos                                        |
| `Table`             | Sortable, animated table driven by column definitions            |

Table cell renderers: `SimpleColumn`, `RankColumn`, `TeamColumn`, `ProblemColumn`,
`ReactionColumn`, `SourceColumn`, `ScoreboardProblem`, `ScoreboardSolved`.

The package also exports ICPC color constants (`SOLVED`, `FAILED`, `PENDING`, `FIRST_TO_SOLVE`,
`ICPC_BLUE`, ...) and the `Column` type.

## Usage

```svelte
<script lang="ts">
	import { Clock, Logo, ProblemUI } from '@icpctools/contest-ui';
	import type { Contest, ContestState, Organization, Problem } from '@icpctools/contest-api';

	let {
		contest,
		state,
		org,
		problems
	}: {
		contest: Contest;
		state: ContestState;
		org: Organization;
		problems: Problem[];
	} = $props();
</script>

<Clock {contest} contestState={state} mode="remaining-time" />
<Logo ref={org.logo} size={12} />
{#each problems as problem (problem.id)}
	<ProblemUI {problem} />
{/each}
```

Components can also be imported individually, e.g.
`import Clock from '@icpctools/contest-ui/Clock'`.

### Tables

`Table` renders rows of any type from a list of column definitions. Each column specifies a
renderer component and a function that maps a row to the renderer's props:

```svelte
<script lang="ts">
	import { Table, RankColumn, TeamColumn, ScoreboardSolved, type Column } from '@icpctools/contest-ui';
	import type { ScoreboardRow, Team } from '@icpctools/contest-api';

	let { rows, teams }: { rows: ScoreboardRow[]; teams: Team[] } = $props();

	const columns: Column<ScoreboardRow>[] = [
		{
			title: 'Rank',
			width: '50px',
			align: 'center',
			renderer: RankColumn,
			rendererProps: (row) => ({ rank: row.rank })
		},
		{
			title: 'Team',
			width: '3fr',
			renderer: TeamColumn,
			rendererProps: (row) => ({ team: teams.find((t) => t.id === row.team_id) })
		},
		{
			title: 'Solved',
			width: '80px',
			align: 'center',
			renderer: ScoreboardSolved,
			rendererProps: (row) => ({ score: row.score })
		}
	];
</script>

<Table kind="scoreboard" {columns} data={rows} keyProperty="team_id" />
```

Columns can also define a `comparator` to make them sortable, and `Table` supports
`fitToScreen`, `visibleRowCount`, and `animationSpeed` for kiosk-style displays.

## License

MIT © ICPC Foundation
