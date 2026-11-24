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

For ease of use, team view is packaged as a container image:
https://github.com/icpctools/team-view/pkgs/container/team-view

To configure your backend Contest API server, set the following environment variables:

- CONTEST_URL - The Contest API base URL, e.g. http://cds/api/
- CONTEST_ID - Optional contest id, only required when more than one contest is configured.
- CONTEST_USER - A user on the contest server.
- CONTEST_PASSWORD - The user's password.

For instance:

```
podman pull ghcr.io/icpctools/team-view:0.x.x
podman images (to see the image sha)
podman run -e CONTEST_URL="<url>" -e CONTEST_ID="<id>" -e CONTEST_USER="<user>" -e CONTEST_PASSWORD="<pwd>" -p 80:3000 <image-sha>
```

Team view works with any server that supports the 2023-06 or 2026-01 Contest API specifications.

## Communication

Please feel free to open bugs, issues, or start discussions on GitHub.
You can also reach us on Slack at https://icpctools.slack.com - we'd love
to know if you've used these tools at a contest.

## Contributing

Want to get involved? Our contribution guide is [here](CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license.
