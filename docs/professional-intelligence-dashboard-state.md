# Professional Intelligence dashboard state

The dashboard reads a typed state module under `src/data/`.

The generator script can create a generated module from the Prophet Platform Gate 4 dashboard JSON export.

Command:

```bash
node scripts/generate-pi-dashboard-state.mjs path/to/dashboard-control-state.json
```

Default output:

```text
src/data/professionalIntelligenceControlState.generated.ts
```

Current source of truth upstream:

```text
SocioProphet/prophet-platform
build/professional-intelligence/dashboard-control-state.json
```

Next step: wire the generated module into the dashboard when CI or release automation copies the platform export into this repo.
