# Agent Operating Instructions

Work issue-first.

Rules:
- One repo, one issue, one PR.
- Inspect the live repository before editing.
- Keep scope bounded to the issue body.
- Do not broaden scope without asking in the issue.
- Do not touch unrelated files.
- Do not claim production readiness unless acceptance criteria prove it.
- Include validation evidence in the PR body.
- Leave known gaps explicit.

PR body must include:
- What changed.
- Exact commands run.
- Pass/fail output summary.
- Known gaps.
- Anything blocked.

Never:
- Commit secrets, tokens, credentials, or private keys.
- Invent backend behavior, live device authority, release URLs, checksums, SBOMs, or provenance.
- Claim real host control from mock fixtures.

SocioProphet Web-specific rules:
- This repo is the Vue product shell, not the marketing site.
- Product-shell dashboards may use mock fixtures unless the issue explicitly scopes backend integration.
- Keep UI surfaces bounded to the requested feature slice.
- Do not invent backend authority or device-control behavior.
- For NLBoot evidence work, display plan records, cache evidence, proof records, adapter records, and boot-entry records as evidence artifacts only.

Validation:
- Use repository-native validation/build commands.
- Include exact command output summary in the PR body.
