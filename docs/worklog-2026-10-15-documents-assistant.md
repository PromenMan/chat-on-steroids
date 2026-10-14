# Feldman Documents built-in study assistant

The Documents desktop companion owns a separate CoS runtime and browser profile. Set
`FELDMAN_DOCUMENTS_RUNTIME_DIR` before startup and `FELDMAN_DOCUMENTS_PARENT_PID`
to the helper PID. This profile forces the embedded browser, disables general computer,
shell and filesystem capabilities, and keeps upstream self-updates from replacing the
bundled runtime. Ordinary CoS installations retain their existing behavior.

Documents registers its own study MCP plugin before startup. First setup still requires
email sign-in, connecting that plugin in ChatGPT, and refreshing the observed model list.
There is no external browser fallback in this profile.

The local bearer-authenticated control API now exposes observed models, immutable
attachment staging, model/effort selection, an exact-turn stop operation, and publication
cursors. Input ownership comes from the stored native question UUID. Completed answers
require the store's exact completed-final proof; interim messages and early lifecycle
ends cannot complete a Documents request. Expanded answer reads remain bounded.

Android uses the native Documents client for on-device inference and optional local
read-only library tools. It does not run Electron or require this desktop runtime. Its
app-owned WebView handles sign-in with the existing native PKCE/loopback exchange.

## Validation on Windows, 2026-10-15

- TypeScript checking and 123 focused profile/control API tests passed after the final
  answer-ownership change. Adjacent browser tests passed earlier.
- Broad suite: 8,958 passed, 49 skipped, 11 failed. Rechecking the nine failed suites with
  the child PowerShell process execution policy corrected gave 205 passed and two failures.
  The unavailable npm shim and updater stalled-stream test also fail against unchanged
  upstream code in this environment. No native control implementation was changed.
- The normal verify command stops at pre-existing public-history privacy findings.
  History was preserved. Third-party notice/native-source checks passed; notices were
  regenerated to match the installed lockfile versions.
- Electron Windows x64 packaging and its packaged native-module smoke checks passed.
  A live private-profile check started the packaged runtime, opened an HTTPS page using
  its embedded browser, and verified exit after its owning helper ended.
- Companion checks: 140 Python tests, two Qt CTest cases, 252 Android unit tests, and
  two Android emulator browser instrumentation tests passed. Both application builds
  succeeded. The desktop settings page was rendered and visually inspected.

Signed-in ChatGPT answer delivery and the user's physical Android device still require
acceptance with the user's account. A package build is not evidence of those flows.
