# Versioning and patch-debt policy

## SemVer

Before `1.0`, schema iteration is allowed. Every document still declares a schema version and migrations are explicit.

After `1.0`:
- patch: implementation bug fix, no contract change;
- minor: backwards-compatible capability;
- major: incompatible DesignIR/API contract.

## Stop patching when

A major redesign should be proposed when several of these appear together:
1. repeated special cases or vendor-specific exceptions in core;
2. frequent version conditionals in normal code paths;
3. a simple feature requires changes across unrelated packages;
4. important new formats do not fit DesignIR naturally;
5. one field has contradictory meanings in different contexts;
6. a correct solution requires breaking compatibility;
7. migrating stored documents is simpler than preserving old hacks;
8. documentation is dominated by exceptions;
9. tests preserve historical accidents rather than desired behavior;
10. security or performance requires changing fundamentals.

## Patch Debt Score

Each change gets one point for each of these introduced:
- schema exception;
- version conditional;
- duplicated logic;
- format-specific workaround in core;
- compatibility shim.

A sustained score >= 3 across two consecutive features triggers an architecture review. A score >= 5 in one feature blocks merge until a migration/major-version alternative is evaluated.

This is a decision aid, not an automatic release algorithm.
