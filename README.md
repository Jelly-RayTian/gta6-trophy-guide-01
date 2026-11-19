# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01/)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Jelly-RayTian/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01/)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Jelly-RayTian/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01/)

An offline, dependency-free guide and tracker for all 55 official GTA VI PS5 trophies, with an original neon-coast look (no Rockstar artwork).

- **Tracker:** checkbox per trophy, progress saved in localStorage, summary with per-grade counts and a bar, JSON export/import, counters for counted trophies.
- **Filters:** kind (story, missable, collectibles, activities, online), grade, earned state, text search; a spoiler setting hides story trophies as `???` until earned.
- **Roadmap & Missables:** eleven ordered stages built from the official descriptions; missable badges everywhere, plus a Missables view with reasons.
- **Guides:** every trophy has an original guide and a cited `source`. Names, descriptions and grades come from the official PlayStation list as published by Exophase and PSNProfiles. The game has no published walkthrough, so method text is reasoned from the official descriptions only, and missable flags are precautionary judgements, not confirmed facts.

## Run

```
node serve.ts          # http://localhost:8080
MAKEFUN_OUTPUT_DIR=out node main.ts   # stage app/, screenshots/ and dossier.json
```

## Data

`app/data/trophies.json` and `app/data/roadmap.json` are maintained directly: edit them by hand, there is no generator step. Each trophy needs `name`, `description`, `grade`, `guide` and `source`; `main.ts` refuses to stage the app if a data file is missing or a trophy lacks one of those. Roadmap stages refer to trophies by exact `name`.
