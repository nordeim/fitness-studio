### Executive Summary

I have meticulously analyzed the IRONFORGE project documentation and the provided CI/CD application logs. I identified two primary issues requiring surgical intervention:

1.  **Critical DevOps Misconfiguration**: `pnpm.overrides` is being silently ignored due to pnpm v9/v10+ deprecation rules, potentially compromising dependency security patches (specifically for `postcss` and `esbuild` mentioned in your docs).
2.  **Testing Anti-Pattern (Stderr Pollution)**: While all 153 unit tests pass, the documented DB mock pattern triggers Vitest's module resolution error wrapper, flooding the logs with misleading "hoisting" warnings during graceful degradation tests.

I have formulated a structured execution roadmap to resolve these issues without disrupting the 5-layer architecture or the anti-generic design system.

---

### Detailed Analysis & Root Cause Identification

#### Issue 1: Silent Failure of Dependency Overrides (High Priority)

- **Log Evidence**: `[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.overrides".`
- **Root Cause**: In newer versions of pnpm, the `pnpm` object in `package.json` is restricted to specific workspace settings. Dependency `overrides` must now be declared at the **root** of `package.json` (standard npm/yarn/pnpm behavior) or within `pnpm-workspace.yaml`.
- **Impact**: The project documentation explicitly mentions using overrides to fix vulnerabilities. Because this field is ignored, those overrides are not being applied, leaving the project potentially vulnerable or prone to build warnings.

#### Issue 2: Vitest Stderr Pollution & Misleading Error Wrappers (Medium Priority)

- **Log Evidence**: `stderr | [submitTrialRequest] DB insert failed ... Error: [vitest] There was an error when mocking a module... cause: Error: DB unavailable in test`
- **Root Cause**: The project's documented DB mock pattern (`vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable'); })`) throws an error _inside the mock factory_ during module resolution. When a factory throws, Vitest catches it and wraps it with a generic "hoisting/scope" warning to help debug uninitialized variables. The application code then catches this wrapped error and logs it via `console.error`, resulting in noisy, misleading CI output.
- **Impact**: Functionally, the graceful degradation works perfectly (tests pass). However, the polluted stderr obscures real issues, violates clean test output principles, and creates false positives for "test configuration bugs" during code reviews.

---

### Structured Execution Roadmap (Phase 2: PLAN)

#### Phase A: Rectify pnpm Override Configuration

1.  **Action**: Move the `overrides` object from `package.json` → `pnpm.overrides` to the **root level** of `package.json`.
2.  **Rationale**: Aligns with pnpm v9+ specifications and ensures security patches are actually applied during `pnpm install`.
3.  **Validation**: Run `pnpm install` and verify the warning disappears. Run `pnpm audit` to confirm overrides are active.

#### Phase B: Refactor DB Mock Pattern for Clean Test Output

1.  **Action**: Update `src/features/booking/actions.test.ts` to mock the DB client's _methods_ rather than breaking the module import entirely.
    - _Before_: `vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable'); })`
    - _After_: Mock the exported `db` object to reject/throw upon invocation, bypassing Vitest's factory error wrapper.
2.  **Action**: Implement `vi.spyOn(console, 'error').mockImplementation(() => {})` within the specific test cases that intentionally trigger the fallback, ensuring the test runner output remains pristine.
3.  **Rationale**: Preserves the exact same runtime behavior (testing the graceful fallback) but eliminates the misleading Vitest wrapper message and suppresses expected error logs from polluting stderr.

#### Phase C: Update Project Documentation (Knowledge Transfer)

1.  **Action**: Update `AGENTS.md` and `fitness-studio_SKILL.md` to reflect the corrected DB mock pattern.
2.  **Rationale**: Ensures future AI agents and human developers do not reintroduce the noisy pattern. The "Lessons Learnt" and "Testing Lessons" sections will be updated.

#### Phase D: Verification & Quality Gate

1.  **Action**: Execute the full quality gate: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
2.  **Rationale**: Ensures surgical changes have not introduced regressions in the 5-layer architecture or broken the build.

---

### Phase 3: VALIDATE - Explicit Confirmation Checkpoint

Before I proceed to Phase 4 (Implementation) and generate the exact code modifications for `package.json`, the test files, and the documentation, please confirm:

1.  Do you approve of moving `overrides` to the root of `package.json` (rather than `pnpm-workspace.yaml`)?
2.  Do you approve of refactoring the DB mock pattern to throw on method invocation rather than module resolution, combined with `console.error` suppression for expected fallback tests?
3.  Shall I proceed with updating `AGENTS.md` and `fitness-studio_SKILL.md` to reflect these corrections?

---

https://chat.qwen.ai/s/432ae477-7287-4e52-8651-58cee936228b?fev=0.2.68
