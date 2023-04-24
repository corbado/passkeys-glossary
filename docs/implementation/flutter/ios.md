---
sidebar_position: 3
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

The following constraints must hold for the file:

- It must be publicly available, and not behind a VPN.
- It must be served with Content-type: application/json.
- It must be accessible over HTTPS.
- It must be served directly with an HTTP 200 response (no HTTP 300’s redirect).
- Ensure no robots TXT prevents it:
    - User-agent: *
    - Allow: /.well-known/

## iOS native implementation

TODO

## iOS WebKit implementation

TODO

### Workaround 1: SFSafariViewController

You can Redirect the browser directly to a prepared website or
via [SFSafariViewController](https://www.rfc-editor.org/rfc/rfc8252#appendix-B) (see Android Custom Tabs for Android).

## Native app linking

To link iOS Apps to Websites Apple uses Apple App Site Association (AASA) files like for
example: https://www.facebook.com/.well-known/apple-app-site-association. To inform the iOS operating system and the app
on which domains to look for AASA files you need to:

- Enable ‘Associated Domains’ on your app identifier
- Enable ‘Associated Domains under Signing and Capabilities (Xcode) and add your domain there (without https prefix,
  just the hostname)

![AASA 1](../../../static/img/tanaschita-aasa-1.png)
![AASA 2](../../../static/img/tanaschita-aasa-2.png)

[Source: Tanaschita](https://tanaschita.com/20220725-quick-guide-on-associated-domains-in-ios/)

- Beware: Starting from iOS14 AASA files are served from Apple CDN and caches and refreshes unregularly – it can be
  bypassed in developer mode (see link above)
- In our case we need
    - applinks:
    - webcredentials:

The AASA file itself has multiple sections. For us only the `webcredentials` (formerly access to keychain for
user/password stored in browser, now also expanded to passkeys) and the `applinks` (=Universal Links) section is
important [(see docs)](https://developer.apple.com/documentation/authenticationservices/connecting_to_a_service_with_passkeys).

Technically only the `webcredentials` are needed to be able to exchange password and/or passkeys, but `applinks` need to
be specified to intercept email magic links called Universal Links on Apple. The apps that are allowed to open them are
identified with a string like: `Y7L2DPA5Y5.com.corbado.passkeys` (teamID.bundleID)
The ID starts with the Team ID `Y7L2DPA5Y5` which can be found in Apple's developer portal (within the URL in the
browser or under Membership area in the App Developer Section on developer.apple.com “Team ID”) and is then followed by
the `bundle identifier` (=bundleID) of the app as specified in
Xcode [(Help for the SDK)](https://tanaschita.com/20230227-passkeys-ios-developer-guide )

