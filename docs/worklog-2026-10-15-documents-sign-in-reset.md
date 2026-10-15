# Documents sign-in navigation

The Documents browser reset every Google identity-provider redirect to the ChatGPT login
page. Email discovery can also reach an identity provider, so the reset could discard an
email submission without displaying any provider error. On the installed PC, an email
submission was observed returning to an empty login page; the intervening provider URL
was not captured, so that specific routing remains an inference until a live retest.

Documents now preserves identity-provider navigation and opens sign-in popups as its own
tabs. A provider may still reject an embedded browser; its rejection must remain visible.
There is no added browser impersonation, cookie import, certificate exception or external
browser launch. Ordinary CoS installations retain their existing explicit browser handoff.

The two redirect/popup regressions failed against the previous implementation, then passed
with the fix. All 21 targeted sign-in/profile tests passed. Full verification passed 9,111
broad tests and 28 native/shutdown tests, with 49 optional checks skipped. Native Windows
packaging smoke passed. The real-Electron fixture passed direct Google redirects and email
discovery redirects to a local synthetic provider refusal, which stayed visible without a
reset or external-browser launch. Existing synthetic email acceptance, rejection, cookie
persistence and logout checks also passed. These checks do not prove that OpenAI or Google
accepts a real account in the embedded browser; live user retry remains required.

## Live PC acceptance

The user completed sign-in manually. The built-in browser then showed the signed-in ChatGPT
account and the paired companion. Opening this Documents-owned runtime's main window triggered
passive discovery of the account's actual GPT-6 and GPT-5.6 choices. A fresh request through the
CoS local control API returned exactly `COS OK`; the native ChatGPT plan client was not used,
and no note content or tool calls were part of that test. Documents observed the CoS catalog
and selected its GPT-6 model in a new conversation, preserving earlier chat history.

Plain CoS chat transport is therefore verified on the PC. The document-tools connector is a
separate remaining setup step: its local plugin is loaded, but the tunnel is unconfigured and
MCP surfaces remain disconnected. The OpenAI Platform login was opened in the built-in browser
for the user to complete; no credential was created or account permission granted by the agent.
The Android port limitation below still applies.

The separate native ChatGPT connection on the PC and physical Android tablet returned real
answers. Android remains a native Documents client using the account's plan; this is not a
completed Android port of the CoS runtime. Physical stylus testing confirmed immediate note
haptics and changing strength down from 10 and back to 10.
