This repo is a very fresh first pass at:

- Converting the Javascript contest model from the CDS to Typescript.
- Using SvelteKit to create a basic contest webapp.

The contest model is incomplete and still has compile errors; there are
also some extremely hardcoded bits:

- hardcoded.ts hardcodes the contest API url (and it always uses the first contest).
- contest.ts resolveURL() strips chars from the URL instead of resolving
  contest URLs correctly.

## Developing

To start developing, you need to install `pnpm` and use it to pull dependencies:

```bash
pnpm install
```

then start a development server:

```bash
pnpm dev
```

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy the app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## License

This project is licensed under the terms of the MIT license.
