This repo is a very fresh first pass at:

- Converting the Javascript contest model from the CDS to Typescript.
- Using SvelteKit to create a webapp, for now just using the contest API to show
  a list of teams.

The contest model is incomplete and still has compile errors; there are
also some extremely hardcoded bits:

- page.server.ts hardcodes the contest API url and always uses the first contest.
- contest.ts resolveURL() strips chars from the URL instead of resolving
  contest URLs correctly.

## Developing

To start developing, you need to install `pnpm` and use it to pull dependencies:

```bash
pnpm install
```

then start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
