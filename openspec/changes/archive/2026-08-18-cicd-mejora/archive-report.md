# Archive Report — cicd-mejora

**Status**: CLOSED
**Archived**: 2026-08-18
**Outcome**: shipped in two passes, fifteen months apart, because the first one
silently dropped a step the proposal had asked for.

## What the proposal asked for

A versioned production compose plus a two-job pipeline: build and push, then
**scp the compose to the server** and `docker compose pull && up -d`.

## What actually shipped in May

`deploy/docker-compose.yml` and the two-job split landed. **The scp step did
not.** The deploy job went straight to `cd /opt/camandrefactory && docker
compose pull && docker compose up -d`, so the compose file was only ever edited
in this repo and never reached the host.

Nobody noticed, because a deploy that changes nothing still exits 0.

## What that cost

Commit `2600295` added Traefik's compress middleware to the compose in this
repo. It sat in git for four days doing nothing: the server kept running the
old compose, and production served every asset uncompressed — 112KB of CSS
where 25KB would have done. The commit was real, the config was correct, and
the change simply never travelled.

The same gap hid a second failure. When the host filled its disk, `docker
compose pull` could not extract the layer, `up -d` kept the old container and
exited 0, and the pipeline reported success. Every deploy from 2026-08-14
onward was a silent no-op.

## What closed it

`b3b1a11` finished the original intent and hardened it:

- the compose and the edge Caddy config are scp'd on every deploy
- the script runs under `set -euo pipefail`
- free disk is checked before pulling, and the error names the command that fixes it
- the running container's image id is compared against the one just pulled,
  because `up -d` exits 0 when it decides to keep what is already running
- a smoke test over the public domain asserts 200s and a compressed response

## Superseded

The Traefik half of this proposal no longer applies. `0385534` moved the site to
a static build served by Caddy inside the image, with an edge Caddy replacing
Traefik entirely — see `deploy/Caddyfile.edge`.

## Lesson

The proposal was right and the implementation was incomplete, and no gate
compared the two. A pipeline that reports success without verifying the effect
is worse than no pipeline: it converts a visible failure into an invisible one.
