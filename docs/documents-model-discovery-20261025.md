# Documents model discovery — 2026-10-25

Documents runs the bundled browser in the background, without showing the CoS main
window. That window's `show` handler used to be the only first-use discovery trigger.
After a successful browser sign-in the bridge could therefore be paired and present
while `GET /v1/models` still reported `unknown` with an empty catalog.

Added the authenticated action `POST /v1/models/refresh`, which delegates to the
existing `startChatModelDiscovery` owner. `allowOpen` is a strict optional boolean,
default false. Passive startup can inspect an already open page; an explicit user
refresh can grant opening authority. The response is admission (202) with the
current catalog state, not proof of a successful observation. GET remains read-only.
The existing owner retains nonce, deadline, browser election and account validation.

Regression tests exercise real loopback routing, dispatch arguments, malformed
input and the disabled-action gate without sending a ChatGPT message.

Validation: 78 focused control/API/model tests passed, as did TypeScript, privacy,
notice and native-source checks. The broad run reported 9,096 passed, 16 failed
and 49 skipped tests across 367 suites; failures included Windows PowerShell
script execution, native UI and timing-sensitive browser/renderer checks. It is
not a clean full-suite result. Packaged native-runtime smoke passed.

Installed verification: the user's signed-in Documents browser discovered GPT-6
and GPT-5.6 in four seconds through the new action. The desktop then connected
and completed a fresh `Reply exactly COS OK.` request in 6.1 seconds, with no
reported error. This verified a text reply, not tablet Documents tool delivery.
