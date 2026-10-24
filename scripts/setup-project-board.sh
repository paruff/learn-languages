#!/usr/bin/env bash
# One-shot setup of the "Acquira" GitHub Project board (AGENTS.md §12, plans/README.md row 5.2).
# Review, then run once from the repo root:  bash scripts/setup-project-board.sh
# Needs gh logged in with the `project` scope (check: gh auth status).
#
# Safe to re-run after a partial run: it reuses the "Acquira" project, skips items already on the
# board, and skips issues and comments that already exist (matched by exact title / marker text).
set -euo pipefail

OWNER=paruff
REPO=paruff/learn-languages
TITLE=Acquira
G1="G1 Prove learners succeed (Phase 1)"
G2="G2 Correct content (concept-keyed)"
G3="G3 Strengthen the loop for returners (Phase 2)"
G4="G4 Breadth: more languages and levels (Phase 3)"
G5="G5 Delivery and quality"

log() { echo "$*" >&2; }
url_of() { echo "https://github.com/$REPO/issues/$1"; }
set_status() { # <issue url> <status>
  gh project item-edit "$P" --owner "$OWNER" --url "$1" --field Status --value "$2" >/dev/null
  log "  $2 <- $1"
}
add_existing() { # <issue number> <status>
  # The board's "Auto-add sub-issues to project" workflow may already have added it (e.g. #166
  # with its parent #160). If the add really failed, the item-edit below fails and stops the script.
  gh project item-add "$P" --owner "$OWNER" --url "$(url_of "$1")" >/dev/null 2>&1 || true
  set_status "$(url_of "$1")" "$2"
}
existing_url() { # <exact title> -> URL of an issue with that title, or nothing
  gh issue list --repo "$REPO" --state all --limit 1000 --json title,url \
    --template '{{range .}}{{.title}}{{"\t"}}{{.url}}{{"\n"}}{{end}}' |
    awk -F'\t' -v t="$1" '$1 == t { print $2; exit }'
}
new_issue() { # <title> <milestone> <label> <status> <body>  -> prints the issue URL
  local url
  url=$(existing_url "$1")
  if [ -n "$url" ]; then
    log "  exists: $url"
    gh project item-add "$P" --owner "$OWNER" --url "$url" >/dev/null 2>&1 || true
  else
    url=$(gh issue create --repo "$REPO" --title "$1" --milestone "$2" --label "$3" \
      --assignee "$OWNER" --project "$TITLE" --body "$5")
  fi
  set_status "$url" "$4"
  echo "$url"
}
comment_once() { # <issue number> <marker text> <body>
  if gh issue view "$1" --repo "$REPO" --json comments --jq '.comments[].body' | grep -qF "$2"; then
    log "  comment already on #$1"
  else
    gh issue comment "$1" --repo "$REPO" --body "$3" >/dev/null
  fi
}

# --- 1. Project -------------------------------------------------------------
P=$(gh project list --owner "$OWNER" --limit 100 --format json \
  --jq ".projects[] | select(.title == \"$TITLE\") | .number")
if [ -n "$P" ]; then
  log "Reusing existing project #$P"
else
  P=$(gh project create --owner "$OWNER" --title "$TITLE" --format json --jq '.number')
  gh project edit "$P" --owner "$OWNER" --visibility PRIVATE \
    --description "Status for paruff/learn-languages. How it works: AGENTS.md §12." >/dev/null
  gh project link "$P" --owner "$OWNER" --repo learn-languages
  log "Created project #$P and linked it to $REPO"
fi

# --- 2. Status options (replaces the default Todo / In Progress / Done) ------
STATUS=$(gh project field-list "$P" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name=="Status") | "\(.id) \([.options[].name] | join("|"))"')
FIELD=${STATUS%% *}
case "$STATUS" in
*"Ready for agent"*) log "Status options already set" ;;
*)
  # shellcheck disable=SC2016  # $f is a GraphQL variable, not a shell one
  gh api graphql -f f="$FIELD" -f query='
mutation($f: ID!) {
  updateProjectV2Field(input: {fieldId: $f, singleSelectOptions: [
    {name: "Backlog",         color: GRAY,   description: "Not ready yet, or its goal is gated"},
    {name: "Ready for agent", color: BLUE,   description: "Goal open; spec ID and exit criterion present"},
    {name: "In progress",     color: YELLOW, description: "Claimed and being worked on"},
    {name: "Needs human",     color: PURPLE, description: "Waiting on the owner: decision, review, merge or human-only work"},
    {name: "Blocked",         color: RED,    description: "Waiting on something named in the issue"},
    {name: "Done",            color: GREEN,  description: "Closed"}
  ]}) { projectV2Field { ... on ProjectV2SingleSelectField { options { name } } } }
}' --jq '"Status options: " + ([.data.updateProjectV2Field.projectV2Field.options[].name] | join(", "))' >&2
  ;;
esac

# --- 3. Labels (kind of issue, never status) ---------------------------------
gh label edit question --repo "$REPO" --description "Decision needed from the owner"
gh label edit plan --repo "$REPO" --description "Goal G1–G5: one per milestone"

# --- 4. Existing open issues -------------------------------------------------
log "Adding existing open issues"
for n in 241 160 166; do add_existing "$n" "Ready for agent"; done
for n in 21 195 143; do add_existing "$n" "Needs human"; done
for n in 185 148 126 144 200 205 247 248 249 250 146 147 251 252 253 254 255 256; do
  add_existing "$n" "Backlog"
done
# Closed sub-issues of #160 that "Auto-add sub-issues to project" brought in.
for n in 161 162 163 164 165; do set_status "$(url_of "$n")" "Done"; done

# #236 becomes an owner decision (spec.md §6, S6 bullet, before this change).
gh issue edit 236 --repo "$REPO" --add-label question --add-assignee "$OWNER" --milestone "$G3" >/dev/null
comment_once 236 "Now an owner decision" "Now an owner decision (AGENTS.md §12.5). A server counter needs an owner decision on hosting and a change to spec S3 (no third-party requests). **Default if unanswered:** no counter; day-2 and week-2 return stay on-device in the learner-sent report (#234)." >/dev/null
add_existing 236 "Needs human"

# --- 5. Decision issues (from the old "Decisions waiting on the owner" table and spec.md §6) ---
log "Creating decision issues"
Q2=$(new_issue "Decision: outcome of the first learner round (plan row 1.4)" "$G1" question "Blocked" "**Question.** After the learner sessions (plan rows 1.1–1.3, #21), is the round positive, negative or unclear?

**Options and what each changes.**

- Positive → start G3: set the G3 goal issue to In progress.
- Negative → rescope around what broke.
- Unclear → run a larger round.

**Default if unanswered.** G3 and G4 stay gated. Blocked until rows 1.1–1.3 are done; first learner data expected from 2026-10-23.

Spec: intent S1, S2 · Plan: row 1.4")

new_issue "Decision: what should the CEFR level labels promise?" "$G1" question "Needs human" "**Question.** Each language has about 800 words for A1–C2, while B2+ comprehension needs several thousand (review finding A4, \`docs/research/2026-10-23-sla-evidence-review-and-product-audit.md\`). What should the level labels promise?

**Options and what each changes.**

- Keep the labels and add an honest note on \"Why this works\".
- Label B2–C2 as \"topics\", not levels.
- Hide B2–C2 until C10 (#255) shows the vocabulary supports them.

**Default if unanswered.** Labels stay as they are. Affects copy on Home, Lessons and Progress, and G4 content scope.

Spec: C5, C10 · Plan: row 3.8" >/dev/null

L20=$(new_issue "Decision: what should the checkpoint's \"I can do this\" feel like? (L20)" "$G3" question "Blocked" "**Question.** The first cut of the level checkpoint shipped without learner feedback (#201). What should \"I can do this\" feel like, and should the checkpoint be linked from navigation?

**Options and what each changes.**

- Keep the first cut as it is.
- Redesign it from round-one learner feedback (#21).

**Default if unanswered.** The first cut stays, not linked from navigation. Lessons studied before it shipped have no study date and aren't offered a checkpoint. Blocked until round-one feedback lands.

Spec: L20, intent S8 · Plan: row 2.7")

# --- 6. Design questions move onto their requirement's issue (spec.md §6) ----
comment_once 126 "moved from spec.md §6" "Open question moved from spec.md §6 (L8): does grammar share the vocabulary SRS queue (interleaved) or get its own? Decide during brainstorming for this issue."
comment_once 146 "moved from spec.md §6" "Open question moved from spec.md §6 (L13): does the picture-prompt mode raise the calibration-flag rate (L5) for image cards? Needs S6 data; this issue's split answers it."
comment_once 205 "moved from spec.md §6" "Open questions moved from spec.md §6:
- L16/L17: should contrastive grammar and metalinguistic tasks run inside the same review queue as L8 items, or be a linked practice surface from lessons?
- L18: should L1 diagnostics stay self-report plus lightweight quizzes, or include adaptive follow-up checks before recommending modules?
- L19: how opinionated should rule-of-thumb guidance be per language pair before it becomes overgeneralised advice?" >/dev/null

# --- 7. Goal issues (label plan; Status = gate) ------------------------------
log "Creating goal issues"
new_issue "Goal G1: Prove learners succeed (Phase 1)" "$G1" plan "In progress" "**Outcome.** Real learners get through the en-GB→pt-PT loop, return on day 2, and we find where they get lost (intent §3, S1, S2, S7).

**Gate.** Open now.

**Exit.** Plan row 1.4 recorded: $Q2

Work: milestone \"$G1\". Order: \`plans/README.md\`. Board rules: AGENTS.md §12." >/dev/null

new_issue "Goal G2: Correct content (concept-keyed)" "$G2" plan "In progress" "**Outcome.** Every pair shows the right word with the right gloss (Epic #148).

**Gate.** Open now: owner exception, 2026-10-18, confirmed 2026-10-22. Re-authors existing content; adds no new levels.

**Exit.** Plan rows D.1 (#185) and D.2 (#143) closed.

Work: milestone \"$G2\". Order: \`plans/README.md\`. Board rules: AGENTS.md §12." >/dev/null

new_issue "Goal G3: Strengthen the loop for returners (Phase 2)" "$G3" plan "Blocked" "**Outcome.** The loop gets stronger for learners who come back (intent §3, \"comes back\").

**Gate.** Blocked until plan row 1.4 is recorded positive (plans/README.md Rule 1): $Q2. Then set this issue to In progress and move its items to Ready for agent.

**Exit.** All G3 rows in \`plans/README.md\` closed.

Work: milestone \"$G3\". Board rules: AGENTS.md §12." >/dev/null

new_issue "Goal G4: Breadth: more languages and levels (Phase 3)" "$G4" plan "Blocked" "**Outcome.** More languages, levels and input types, once retention is proven.

**Gate.** Blocked until retention measurement (S6) produces data (plans/README.md Rule 1). Owner exception, 2026-10-22: Italian (row 3.1, #160, #166) continues now.

**Exit.** All G4 rows in \`plans/README.md\` closed.

Work: milestone \"$G4\". Board rules: AGENTS.md §12." >/dev/null

new_issue "Goal G5: Delivery and quality" "$G5" plan "In progress" "**Outcome.** Small delivery and quality work that helps every goal.

**Gate.** Open any time, small changes only.

**Exit.** None: a standing goal.

Work: milestone \"$G5\". Board rules: AGENTS.md §12." >/dev/null

TRACK=$(new_issue "[DOCS] Workflow: project board, goal issues, DESIGN.md, REVIEW.md (plan row 5.2)" "$G5" documentation "In progress" "**Why.** Anyone (owner, Claude Code, OpenCode, Copilot) should answer \"what's next for an agent?\" and \"what waits on a human?\" from the board, without asking.

**Proposal.** Acquira project board with one Status field, goal issues per milestone, decisions as \`question\` issues, \`DESIGN.md\` for UI decisions, \`REVIEW.md\` for code review, issue and PR templates, Copilot setup steps.

**Exit criterion.** This script has run; both AGENTS.md §12.3 commands return the board's items.

Spec: n/a: process · Plan: row 5.2 · Design: n/a")

# --- 8. Manual steps -----------------------------------------------------------
cat >&2 <<EOF

Done. Project: https://github.com/users/$OWNER/projects/$P

Manual steps (built-in workflows can only be set in the web UI):
  Project → ⋯ → Workflows
  1. "Auto-add to project": repository $REPO, filter  is:issue is:open
  2. "Item added to project": set Status to Backlog
  3. "Item closed": turn it on, set Status to Done (it starts off on a new project)

Fill the "new" issue numbers into plans/README.md:
  row 1.4 → $Q2
  row 2.7 → $L20
  row 5.2 → $TRACK
EOF
