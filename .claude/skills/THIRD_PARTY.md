# Third-party skills

The skill in this table comes from a published repository. Do not edit it in place. Update it with the procedure below. The folder `msca-design/` is our own skill and is not listed here.

| Skill folder | Source repo | Path in repo | Commit SHA | License | Installed |
|---|---|---|---|---|---|
| `vercel-composition-patterns/` | https://github.com/vercel-labs/agent-skills | `skills/composition-patterns` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | MIT (declared in README.md and SKILL.md, no LICENSE file upstream, see `LICENSE` in the folder) | 2026-11-01 |

The files are byte-identical to the upstream folder at that commit, except for the added `LICENSE` file. Installed with skills CLI 1.7.4 (`--copy`, Claude Code target), output checked with `diff -r` against a clone at the same commit.

The upstream skill `react-best-practices` was installed with it and removed on 2026-11-06: most of its rules need a server runtime and the app is a static export. Do not reinstall it.

## Notes for agents

- Our project is a static export (`output: 'export'`) on GitHub Pages. Apply the composition rules to client and shared components. Ignore any rule that needs a server runtime (Server Actions, Route Handlers, middleware).
- `AGENTS.md` in the folder is the compiled form of `rules/*.md`. `README.md`, `metadata.json`, `rules/_template.md` and `rules/_sections.md` are upstream contributor files.
- Where a composition rule and `.claude/skills/msca-design/` disagree on styling, `msca-design` wins.

## Update procedure

1. Run the command in an empty scratch directory, not in this repo. The CLI writes a `skills-lock.json` file at the project root, and we do not keep it.

   ```bash
   DISABLE_TELEMETRY=1 npx -y skills@latest add vercel-labs/agent-skills \
     --skill vercel-composition-patterns \
     -a claude-code --copy -y
   ```

2. Read the diff between the new `.claude/skills/vercel-composition-patterns/` folder and the folder here. Reject any change that adds scripts, hooks, install commands or runtime fetches.
3. Copy the new folder here, keep the `LICENSE` file, and update the SHA and date in the table. Get the SHA with `git ls-remote https://github.com/vercel-labs/agent-skills HEAD`.
