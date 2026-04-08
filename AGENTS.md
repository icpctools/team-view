# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

Team View is a web application for watching ICPC programming contests. It displays teams, scoreboards, video feeds, and other contest data via the Contest API specification (2023-06 or 2026-01). Built as a performant, reactive web app that can run in kiosk mode as a replacement for ICPC Tools Coach View.

## Development Commands

**Prerequisites**: Install [pnpm](https://pnpm.io/installation) - this project uses pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Start development server (builds packages first)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run all tests (unit + integration)
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only (Playwright)
pnpm test:integration

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm check

# Build workspace packages only
pnpm build:packages
```

## Configuration

The app connects to a Contest API server via environment variables (or edit `src/lib/hardcoded.svelte.ts` for development):

- `CONTEST_URL` - Contest API base URL (e.g., http://cds/api/)
- `CONTEST_ID` - Optional contest ID (required when multiple contests exist)
- `CONTEST_USER` - Contest server user
- `CONTEST_PASSWORD` - User password

- `CONTEST_PROXY` - Enable Contest API proxying by setting to 'true'

## Architecture

### Monorepo Structure

This is a pnpm workspace monorepo with three main parts:

1. **Root** (`/src`) - Main SvelteKit web application
   - Routes in `src/routes/`: team views, scoreboard, map, problems, clarifications
   - Shared UI components in `src/lib/ui/`
   - Global state management in `src/lib/state.svelte.ts`

2. **@icpctools/contest-api** (`packages/contest-api/`) - TypeScript library
   - Provides `ContestAPI` and `Contests` classes for accessing Contest API
   - Uses `got` for HTTP requests (server-only, stubbed for client builds)
   - Types defined in `contest-types.ts`
   - Main implementation in `contest-api.ts`

3. **@icpctools/contest-ui** (`packages/contest-ui/`) - Reusable Svelte components
   - Published as an npm package for use in other ICPC tools
   - Exports: Clock, FloorMap, Image, JudgementTypeUI, Logo, PersonUI, ProblemUI, ScoreboardHeader, ScoreboardRowUI, Video
   - Built with `svelte-package` to `dist/` directory

### Key Technologies

- **SvelteKit** with Node adapter (`@sveltejs/adapter-node`) - SSR-enabled web framework
- **Svelte 5** - Uses new runes API (`$state`, `$derived`, etc.)
- **Tailwind CSS 4** - Styling via `@tailwindcss/vite` plugin
- **TypeScript** - Fully typed codebase
- **Vitest** - Unit testing with `@testing-library/svelte`
- **Playwright** - Integration/E2E testing

### Build System Notes

- **Vite configuration** (`vite.config.ts`) includes custom plugin to exclude Node.js-only packages (like `got`) from client bundles
- Packages use TypeScript source directly (no build step for contest-api during development)
- SSR setting `noExternal: ['@icpctools/contest-api', '@icpctools/contest-ui']` ensures workspace packages are bundled
- Monaco Editor is used for source code viewing

### State Management

- Uses Svelte 5's built-in reactivity with `$state` and `$derived`
- Contest data loaded server-side via `loadContest()` in `src/lib/state.svelte.ts`
- Contest API client singleton pattern with mutex for concurrent request handling
- Contest state cached after initial load and watched for updates

### Routes

SvelteKit file-based routing:

- `/` - Home page
- `/team/[id]` - Team view with sub-routes: `/desktop`, `/webcam`, `/pip`, `/rpip`, `/side-side`
- `/scoreboard` - Contest scoreboard
- `/map` - Floor map showing team locations
- `/problem/[id]` - Problem details
- `/clarifications` - Clarification requests
- `/proxy/[...path]` - Server-side proxy to `CONTEST_URL/*` (GET requests only, authenticated)

### API Proxy

The `/proxy/*` route (`src/routes/proxy/[...path]/+server.ts`) acts as a server-side streaming proxy:

- Client requests to `/proxy/contests/123` are proxied to `CONTEST_URL/contests/123`
- Currently supports GET requests only (returns 501 for other methods)
- **Streaming support** - Uses `got.stream()` to stream responses without buffering (enables MPEG-TS video and other large/streaming content)
- Forwards request headers (excluding host, connection, content-length)
- Includes HTTP Basic Auth using `CONTEST_USER` and `CONTEST_PASSWORD` from environment variables
- **Accepts self-signed/invalid SSL certificates** (`rejectUnauthorized: false`) for development environments
- Returns proxied response with appropriate headers and status codes
- Handles errors with 502 Bad Gateway status

This allows client-side code to call `/proxy/...` endpoints without CORS issues while streaming video and other large responses efficiently.

## Development Workflow

### Working on Packages

When modifying `@icpctools/contest-api` or `@icpctools/contest-ui`:

```bash
# Rebuild packages manually if needed
pnpm build:packages

# For contest-ui, can watch for changes
cd packages/contest-ui
pnpm watch
```

The main app's `pnpm dev` automatically rebuilds packages on startup but won't hot-reload package changes during development.

### Running Single Tests

```bash
# Run specific unit test file
pnpm test:unit packages/contest-api/src/contest-api.test.ts

# Run specific integration test
pnpm test:integration tests/test.ts
```

## Git Conventions

This project follows strict commit conventions:

1. **Conventional Commits** - Use format: `type: description`
   - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, etc.
   - Examples: `feat: add video pip mode`, `fix: scoreboard sorting`, `chore: update dependencies`

2. **Signed Commits** - All commits must include sign-off
   ```bash
   git commit -s -m "feat: your change"
   ```
   This adds: `Signed-off-by: Your Name <your.email@example.com>`

## Deployment

Containerfile published at: https://github.com/icpctools/team-view/pkgs/container/team-view

Build locally:

```bash
docker build -t team-view .
```

The Dockerfile uses the Node adapter output from `pnpm build`.
