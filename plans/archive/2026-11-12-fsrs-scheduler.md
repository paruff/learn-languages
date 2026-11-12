# FSRS scheduler and SM-2 migration (#247, plan row 2.13)

Spec: L22 (replaces L2), S11, L33, M2. Started on the owner's instruction while G3 is gated (plans Rule 1).

## Decisions

| Question (from #247)           | Decision                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ts-fsrs` or a local scheduler | Local, in `src/utils/srs.ts`. `ts-fsrs` 6.0.0 is a dev dependency used only as the reference the tests compare against, so nothing new ships to the browser                     |
| Which FSRS                     | FSRS-6 with the default weights from `ts-fsrs` 6.0.0. That package also contains an FSRS-7 model; it was not evaluated                                                          |
| Target retention               | 0.9, a constant. Not a learner setting                                                                                                                                          |
| SM-2 → FSRS conversion         | Stability = SM-2 interval; difficulty from the ease factor (the `fsrs` Rust crate's conversion); lapses 0. Additive only: no field removed, due dates unchanged                 |
| When migration runs            | On every read (pure), plus one in-place rewrite (`migrateStorage`) before the first progress write and after a backup restore. Schema version 1 → 2                             |
| Metrics across the change      | The grade log is not rewritten. A delayed review counts under the scheduler that chose its gap. The Progress panel shows one figure; the session report splits it per scheduler |
| Fuzz, on-device fitting        | Not built. Fitting needs more reviews per learner than anyone has yet (P-6)                                                                                                     |

## Order of work

1. Property-based tests for the scheduler and the state migration (`src/utils/srs.property.test.ts`), written and seen failing before the scheduler.
2. Scheduler, then example tests and the comparison against `ts-fsrs` (`src/utils/srs.test.ts`).
3. Property-based tests for the storage migration (`src/lib/storage.migration.test.ts`), then `migrateStorage`, schema version 2 and the backup-restore rules.
4. Grade log: scheduler id `fsrs6`, retention per scheduler.
5. E2E: new first intervals; an SM-2 learner's storage migrated in a real browser.
6. Spec §2.1, CHANGELOG, README.

## Result against the exit criterion

- `src/utils/srs.ts` is at 100% lines, branches, functions and statements, enforced per file in `vitest.config.ts`.
- Migration tests from SM-2 state: unit, property-based, and one in the browser.
- M2 still computes from a log that spans the migration (`src/lib/grade.test.ts`).
- Review counts were compared, as #247 asked. FSRS at a 90% target did not need fewer reviews than this app's SM-2 in simulation (7.35 against 7.08 per card over a year); the saving appears only at a lower target. Numbers and caveats: spec §2.1.

## Not done here

- E2E was run on the two Chromium projects only; Firefox and WebKit run in CI.
- No learner has used FSRS yet. Whether it predicts recall better than SM-2 for our learners is unknown until the per-scheduler retention figures exist.
