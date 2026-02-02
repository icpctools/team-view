# Team View

Team view is a web application for watching ICPC programming contests. It allows you to see
the teams that are competing, track how they're doing, view the scoreboard, or watch live
webcam and desktop feeds.

If you run team view in a web browser in kiosk mode, it is a direct replacement for the ICPC Tools
Coach View (https://tools.icpc.global).

But it is also much more:

- A performant web app for all contest data - runs on any client and minimal load on network and backend server.
- Fully reactive - portions of the UI appear only when content is available, so for instance, if your contest
  doesn't have video streaming or maps those options won't appear in the UI.
- Responsive design (still WIP) - can be accessed on a phone, tablet, Raspberry Pi, or computer.
- A reusable typescript library for accessing the Contest API (https://ccs-specs.icpc.io).

## Running

For ease of use, the latest team view is packaged as a Docker container here:
https://github.com/icpctools/team-view/pkgs/container/team-view

To configure your backend Contest API server, set the following environment variables:

- CONTEST_URL - The Contest API base URL, e.g. http://cds/api/
- CONTEST_ID - Optional contest id, only required when more than one contest is configured.
- CONTEST_USER - A user on the contest server.
- CONTEST_PASSWORD - The user's password.

Team view wil work with any server that supports the 2023-06 or 2026-01 Contest API specifications.

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy the app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Communication

Please feel free to open bugs, issues, or start discussions on GitHub.
You can also reach us on Slack at https://icpctools.slack.com - we'd love
to know if you've used these tools at a contest.

## Contributing

Want to get involved? Our contribution guide is [here](CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license.
