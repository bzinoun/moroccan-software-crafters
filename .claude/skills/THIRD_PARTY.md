# Third-party skills

The skills in this table come from published repositories. Do not edit them in place. Update them with the procedure below. The folders `msca-design/` and `msca-nextjs/` are our own skills and are not listed here.

| Skill folder | Source repo | Path in repo | Commit SHA | License | Installed |
|---|---|---|---|---|---|
| `vercel-react-best-practices/` | https://github.com/vercel-labs/agent-skills | `skills/react-best-practices` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | MIT (declared in README.md and SKILL.md, no LICENSE file upstream, see `LICENSE` in the folder) | 2026-11-01 |
| `vercel-composition-patterns/` | https://github.com/vercel-labs/agent-skills | `skills/composition-patterns` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | MIT (same as above) | 2026-11-01 |

The files are byte-identical to the upstream folders at that commit, except for the added `LICENSE` file in each folder. Installed with skills CLI 1.7.4 (`--copy`, Claude Code target), output checked with `diff -r` against a clone at the same commit.

## Notes for agents

- Our project is a static export (`output: 'export'`) on GitHub Pages. Ignore the rules that need a server runtime: in `vercel-react-best-practices/rules/`, the `server-*` rules and `async-api-routes.md` (Server Actions, Route Handlers, `after()`, React `cache`, LRU caches).
- `AGENTS.md` in each folder is the compiled form of `rules/*.md`. `README.md`, `metadata.json`, `rules/_template.md` and `rules/_sections.md` are upstream contributor files.

## Update procedure

1. Run the command in an empty scratch directory, not in this repo. The CLI writes a `skills-lock.json` file at the project root, and we do not keep it.

   ```bash
   DISABLE_TELEMETRY=1 npx -y skills@latest add vercel-labs/agent-skills \
     --skill vercel-react-best-practices vercel-composition-patterns \
     -a claude-code --copy -y
   ```

2. Read the diff between the new `.claude/skills/<name>/` folders and the folders here. Reject any change that adds scripts, hooks, install commands or runtime fetches.
3. Copy the new folders here, keep each `LICENSE` file, and update the SHA and date in the table. Get the SHA with `git ls-remote https://github.com/vercel-labs/agent-skills HEAD`.
