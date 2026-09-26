---
description: Research and produce an implementation-ready spec using Superpowers methodology
agent: plan
---

Load the `brainstorming` skill (superpowers) and follow its workflow strictly.

## Superpowers Workflow

1. Explore project context (files, commits, docs — start with `AGENTS.md`,
   `discovery-brief.md`, `specification-design.md`)
2. Ask clarifying questions one at a time
3. Propose 2-3 approaches with recommendations
4. Present design sections for confirmation
5. Write the design to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   (existing convention — match the naming of neighbouring files)
6. Self-review the spec (scan for TBD/TODO, contradictions, scope issues)
7. Hand off to the `writing-plans` skill, producing
   `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`

## GitOps Integration

After the Superpowers workflow produces the design document:

- Create a branch: `git checkout -b plan/<topic>`
- Commit the design doc: `docs(plan): add design for <topic>`
- Push and open a **draft** PR for review:
  `gh pr create --draft --base main --title "docs(plan): <topic>" --body "..."`

Do NOT write any implementation code until the design is committed and
approved. Implementation proceeds on its own branch with the
`executing-plans` skill and the TDD gate — never inside this plan branch.
