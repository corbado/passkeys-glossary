---
sidebar_position: 1
---

# Android

The implementation for Flutter Android is still very similiar to native Android with Kotlin Flutter, as there is no
good Flutter SDK for Passkeys / WebAuthn yet.

## Origin

The origin needs to bet set to the following scheme `android:apk-key-hash:xxx` if a Passkey / WebAuthn request is sent
to a WebAuthn server from an Android app. The origin in this case is
called [FacetID](https://fidoalliance.org/specs/uaf-v1.0-id-20141122/fido-appid-and-facets-v1.0-id-20141122.html#the-appid-and-facetid-assertions
).

Creating the required `android:apk-key-hash:xxx` can be quite complicated. The Android `package_name` name debug signing
key of a developer account (it needs to be the SHA-256 hash of it) are required.

Use the following command to generate it:

```bash 
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Binding passkeys to your own domain

If you want to bind the passkeys to your own domain (e.g. `acme.com`), you need to manually change
the [WebAuthn relying party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) and host the `assetlinks.json`
file on this domain (so on `acme.com/.well-known/assetlinks.json`).

Moreover, you need to associate your native app in the `assetlinks.json` file. Use the following JSON template and host
it under `acme.com/.well-known/assetlinks.json`:

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "{PACKAGE-NAME}",
      "sha256_cert_fingerprints": [
        "{FINGERPRINT-OF-YOUR-SIGNING-KEY}"
      ]
    }
  }
]
```

Variables:

- `PACKAGE-NAME`: The Android package name.
- `FINGERPRINT-OF-YOUR-SIGNING-KEY`: The SHA-256 fingerprint obtained before (eg. 7H:AC:4C:...).

Google offers a [free tool](https://developers.google.com/digital-asset-links/tools/generator) to test if the setup and
hosting works
correctly.

## Android native implementation

It requires a client libary, e.g. `Fido2ApiClient` and an WebAuthn server. A code lab to play around is
available [here](https://codelabs.developers.google.com/codelabs/fido2-for-android/#2).

## Android WebView implementation

Android WebView doesn’t support passkeys (due to security reasons).

### Workaround 1: Third party solution

Only hardware security keys seem to work. There's a [third party solution](https://hwsecurity.dev/guide/fido-webview/)
that builds a workaround by injecting a JavaScript bridge that redirects the `navigator.credentials` calls to their
FIDO2 implementation.

### Workaround 2: Android Custom Tabs

You can Redirect the browser directly to a prepared website or via [Android Custom
Tab](https://www.rfc-editor.org/rfc/rfc8252#appendix-B) (see SFSafariViewController for iOS).

Useful sources:

- [Stackoverflow: Android WeView Support WebAuthn](https://stackoverflow.com/questions/56258147/android-webview-support-webauthn)
- [Stackoverflow: Describes in understandable manner how to use passkeys in native Android apps and how WebAuthn /
  passkeys can be used in conjunction with OAuth](https://stackoverflow.com/questions/57674215/how-to-implement-webauthn-in-an-android-app)
