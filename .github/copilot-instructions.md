Use the GitHub issue body as the source of truth.

Before editing:
1. Read the issue.
2. Inspect the Vue shell structure.
3. Identify existing validation/build commands.
4. Keep the PR bounded.

When implementing:
- This is the SocioProphet Web Vue product shell, not the marketing site.
- Use mock fixtures unless backend integration is explicitly scoped.
- Do not invent device-control or release-management authority.
- Keep route/component changes focused on the issue.
- Add tests or fixtures where repository patterns support them.

When opening the PR:
- Link the issue.
- Include validation evidence.
- List known gaps.
- State non-goals preserved.
- Do not mark ready if validation did not run.
