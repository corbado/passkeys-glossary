---
sidebar_position: 1
---

# iOS

The implementation for Flutter iOS is still very similiar to native iOS with Swift, as there is no good Flutter SDK for
Passkeys / WebAuthn yet.

## Origin

TODO

## Binding passkeys to your own domain

If you want to bind the passkeys to your own domain (e.g. `acme.com`), you need to manually change
the [WebAuthn relying party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) and host
the `apple-app-site-association.json` file on this domain (so on `acme.com/.well-known/apple-app-site-association`).

Moreover, you need to associate your native app in the `apple-app-site-association.json` file. Use the following JSON
template and store it under `acme.com/.well-known/apple-app-site-association.json`:

```json
{
  "appclips": {
    "apps": []
  },
  "applinks": {
    "apps": []
  },
  "webcredentials": {
    "apps": [
      "{ APP_IDENTIFIER_PREFIX }.{ BUNDLE_IDENTIFIER }"
    ]
  }
}
```

Variables:

- `APP_IDENTIFIER_PREFIX`: The iOS app identifier prefix associated with your development team in your Apple Developer
  account.
- `BUNDLE_IDENTIFIER`: The bundle identifier associated with your iOS application. Can be found in Xcode development
  environment.

## iOS native implementation

TODO

## iOS WebKit implementation

TODO

### Workaround 1: SFSafariViewController

You can Redirect the browser directly to a prepared website or
via [SFSafariViewController](https://www.rfc-editor.org/rfc/rfc8252#appendix-B) (see Android Custom Tabs for Android).