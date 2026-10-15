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

## Continued implementation, 2026-10-15

Merged canonical upstream through `96619a7a` (2.1.38), desktop through `60af1cf`, and
Android through `0740dcd`, preserving existing local feature work and original authorship.
The Documents profile keeps upstream automatic turn rotation off because the helper owns
its request lifecycle. Stop now uses upstream's exact-turn handler and typed live response.

Settings recovery downloads and default plugin OAuth previously could call the system
browser directly. `profile-web-link.ts` applies the Documents browser policy to these paths;
ordinary upstream installations retain their existing system-browser behavior. Unit and IPC
regressions cover recovery links, explicit external requests, authorization URLs, unsupported
protocols, and the unchanged ordinary profile.

The earlier history finding cleared when canonical upstream refs were fetched. No history
was rewritten and no guard was weakened. The updater failure was a test-order race: the
preceding retry test waited for a release lookup but left its download running before moving
fake timers and replacing fetch mocks. Joining that pass fixes the full updater suite.

The Windows terminal fixture typed its command but keys could be suppressed by foreground
ownership despite retained DOM focus. It now pins focus only in its own renderer, sends text
and Return through one ordered Chromium input connection, and waits for the command's full
echo and PTY result before releasing that connection. Actual xterm, IPC and ConPTY remain in
the path; persistent state, hidden panels, Ctrl+C and exit-code assertions remain intact.
The corrected fixture passed consecutive runs without retries.

The latest desktop note renderer compiled but failed at startup because its page `layer`
property overrode a final Qt property. Renaming it `pictureLayer` restores startup. A new
Windows CTest loads the actual application and renders a frame, so runtime QML load errors
are checked in addition to compilation.

## Current Windows validation

- Full `npm run verify` passed: 9,067 tests plus 28 Windows desktop/shutdown tests, with
  49 optional/platform tests skipped. Privacy, notices, native source checks and typecheck
  pass within that command. The previously failing updater suite passes all 51 tests.
- All 54 Electron UI checks have passing coverage across the full run and targeted reruns.
  The initial full run passed 52/54: a settings-focus visual timing assertion passed its
  separate rerun, and the terminal fixture passed two consecutive runs after the focus fix.
  Initial failures remain recorded; this is not a claim that the first full run was green.
- Electron Windows x64 2.1.38 packaging and native-module smoke checks passed. A real
  private-profile runtime started, opened HTTPS in its embedded browser, and exited after
  its owning helper ended. The synthetic sign-in fixture includes Documents mode returning
  a Google redirect to email login without an external launch or transfer offer.
- Desktop release compilation and all three Qt CTest cases pass. The staged application
  starts and its settings screenshot was visually inspected after the QML fix. The updated
  Windows installer compiled successfully. The existing 140 Python tests passed; these
  sources were unchanged by the latest merges.
- Android debug APK builds with all 263 unit tests passing. Both current WebView
  instrumentation tests pass on an Android 15 emulator, including a real ephemeral callback.
  The test-owned emulator was stopped afterward; the production APK was not installed.

Signed-in ChatGPT answer delivery and the user's physical Android device still require
acceptance with the user's account. A build or synthetic sign-in fixture is not evidence of
those flows. The desktop app changes remain on its local feature branch, as do Android's;
the CoS integration branch is published in the PromenMan fork.
