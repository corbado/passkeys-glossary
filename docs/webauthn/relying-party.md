---
sidebar_position: 1
---

# Relying Party

The relying party is the SaaS or e-commerce product / service that offers it users to login with passkeys, e.g.
ACME.

## rpID (Relying Party ID)

- rpID is the domain (no protocol, no port, no path) where passkeys can be used for, e.g. `acme.com`.
- During every login process, it is checked if the provided passkey matches the rpID. This prevents any phishing
  attacks, since only the domain where the passkey was created can be used for authentication.
- The private key of the passkey key-pair holds this information as well as the WebAuthn server.
- Subdomains also match the rpID:
    - A login from domain `login.acme.com` works for a passkeys with rpID `acme.com`.
    - The other way around does not work: a login from domain `acme.com` would not work for passkey created on
      rpID `login.acme.com`.
- Changing the rpID of a created passkey is not possible.
- In the `PublicKeyCredentialRequestOptions` that are returned when starting WebAuthn login API call, the rpID is
  returned
  together with allowed credentials (rpID is the same as the one used in registration).
- When the JavaScript client calls `navigator.credentials.get()`, the browser validates the received rpID from the
  WebAuthn server against the origin in the browser.
- After signing the response, the clients sends the following data to the server back:
    - `rpIdHash` in `authenticatorData` (it's the SHA-256 hash of the rpID)
    - `origin`: the domain observed by the client ("the browser URL" - see [Origin](#origin))

## Origin

Depending on the implementation of the WebAuthn Server, origins (where passkey login requests come from) need to be
explicitly whitelisted in the WebAuthn server. 