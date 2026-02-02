# Contributing Guide

Contributions come in many forms - please feel to open bugs, open issues for future ideas, comment, or review PRs.

The remainder of this document explains how to test locally, make code changes, and submit PRs.

## Developing

Team view is built using SvelteKit (a framework for building reactive node applications) and Tailwind
(a CSS styling library).

To start developing, you need to install (`pnpm`)[https://pnpm.io/installation]. Once you've done this,
clone the repo locally and use pnpm to pull dependencies:

```bash
pnpm install
```

Set the following environment variables (or edit /src/lib/hardcoded.svelte.ts) to point to a running Contest API server:

- CONTEST_URL - The Contest API base URL, e.g. http://cds/api/
- CONTEST_ID - Optional contest id, only required when more than one contest is configured.
- CONTEST_USER - A user on the contest server.
- CONTEST_PASSWORD - The user's password.

Then start a local development server:

```bash
pnpm dev
```

and open the URL it lists.

## Working on Issues

Before starting work in an area please make sure there is an open issue and assign it to yourself
or comment before working, so that we know what you're up to.

If you may submit a PR for the change, now is a good time to fork the repo and configure
your git remotes.

As you make changes you can test them as per the previous section. When you're
happy with them, you can lint, format, and run tests locally:

To lint:

```bash
pnpm lint
```

To format:

```bash
pnpm format
```

To run tests:

```bash
pnpm test
```

## Submitting Pull Requests

We use conventional commits and signing. Once those are complete, you're ready to push the
commits to your fork and open a PR for review!

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

Some examples for correct commit titles would be:

- `fix: corrected broken link`
- `chore: updated to latest library`
- `feat: added option to view submission source files`

### Signing Commits

Sign off is a line at the end of every git commit message that certifies that you
wrote the patch or otherwise have the right to pass it on as an open-source patch:

    Signed-off-by: Joe Smith <joe.smith@email.com>

Your legal name must be used (no pseudonyms or anonymous contributions). If you set
your `user.name` and `user.email` git configs, you can sign your commit automatically
with `git commit -s`.
