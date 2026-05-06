# Professional Intelligence dashboard state

The Professional Intelligence dashboard reads a typed state module under:

```text
src/data/professionalIntelligenceControlState.ts
```

The generator script can recreate that module from the Prophet Platform Gate 4 dashboard JSON export.

Command:

```bash
node scripts/generate-pi-dashboard-state.mjs path/to/dashboard-control-state.json
```

Default output:

```text
src/data/professionalIntelligenceControlState.ts
```

Current upstream source:

```text
SocioProphet/prophet-platform
build/professional-intelligence/dashboard-control-state.json
```

The generator validates that the input includes:

- `overallAlignment`
- `metrics`
- `gates`
- `nextMoves`

Next step: automate copying the Prophet Platform export into this repo during release or preview builds.
