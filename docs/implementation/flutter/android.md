---
sidebar_position: 2
---

# Android

The implementation for Flutter Android is still very similar to native Android with Kotlin Flutter, as there is no
good Flutter SDK for passkeys / WebAuthn yet.

## Origin

The origin needs to bet set to the following scheme `android:apk-key-hash:xxx` if a passkey / WebAuthn request is sent
to a WebAuthn server from an Android app. The origin in this case is
called [FacetID](https://fidoalliance.org/specs/uaf-v1.0-id-20141122/fido-appid-and-facets-v1.0-id-20141122.html#the-appid-and-facetid-assertions
).

Creating the required `android:apk-key-hash:xxx` can be quite complicated. The Android `package_name` and debug signing
key of a developer account (it needs to be the SHA-256 hash of it) are required.

Use the following command to generate it:

```bash 
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Digital Asset Links (DAL)

To associate a native app with a web app, Android requires an Digital Asset Link
file `assetlinks.json`. Use the following JSON
template and store it under `acme.com/.well-known/assetlinks.json` if your domain is `acme.com`:

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
hosting works correctly.

The following constraints must hold for the file:

- It must be publicly available, and not behind a VPN.
- It must be served with Content-type: application/json.
- It must be accessible over HTTPS.
- It must be served directly with an HTTP 200 response (no HTTP 300’s redirect).
- Ensure no robots TXT prevents it:
    - User-agent: *
    - Allow: /.well-known/

For example `www.facebook.com/.well-known/assetlinks.json` is the file for Facebook.

## Binding passkeys to your own domain

If you want to bind the passkeys to your own domain (e.g. `acme.com`), you need to manually change
the [WebAuthn relying party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) and host the `assetlinks.json`
file on this domain (so on `acme.com/.well-known/assetlinks.json`).

Moreover, you need to associate your native app in the `assetlinks.json` file. Use the following JSON template and host
it under `acme.com/.well-known/assetlinks.json`:

## Android native implementation

It requires a client library, e.g. `Fido2ApiClient` and a WebAuthn server. A code lab to play around is
available [here](https://codelabs.developers.google.com/codelabs/fido2-for-android/#2). The current Corbado Flutter
implementation also uses Android native implementation with the `Fido2ApiClient` library.

## Android WebView implementation

Android WebView doesn’t support passkeys (due to security reasons).

### Workaround 1: Third party solution

Only hardware security keys seem to work. There's a [third party solution](https://hwsecurity.dev/guide/fido-webview/)
that builds a workaround by injecting a JavaScript bridge that redirects the `navigator.credentials` calls to their
FIDO2 implementation.

### Workaround 2: Android Custom Tabs

You can Redirect the browser directly to a prepared website or via [Android Custom
Tab](https://www.rfc-editor.org/rfc/rfc8252#appendix-B) (
see [SFSafariViewController](./ios.md#workaround-1--sfsafariviewcontroller) for iOS).

Useful sources:

- [Stackoverflow: Android WeView Support WebAuthn](https://stackoverflow.com/questions/56258147/android-webview-support-webauthn)
- [Stackoverflow: Describes in understandable manner how to use passkeys in native Android apps and how WebAuthn /
  passkeys can be used in conjunction with OAuth](https://stackoverflow.com/questions/57674215/how-to-implement-webauthn-in-an-android-app)

## Native app linking

It seems that `assetlinks.json` does not need to be updated if you intent to create native apps
only [(implementation advice)](https://developer.android.com/training/sign-in/passkeys).

To link native Android apps to web apps and allow intercepting links or accessing passwords stored in WebView, Android
uses [DAL](#digital-asset-links--dal-). It is deployed identically on all relevant domains that are used for app
linking (opening email magic links or web links directly in the native app):
`subdomain1.acme.com/.well-known/assetlinks.json`. For example other subdomains can include also the main
specification using `subdomain2.acme.com/.well-known/assetlinks.json`.

When the Android app starts, it uses the information in the `AndroidManifest.xml` to find out which domains might be
linked to the app. More than one domain is possible. They need to be specified like
that: `[{"include":"https:\/\/www.acme.com\/.well-known\/assetlinks.json"}]`

### Example

The [Android developer source](https://developer.android.com/training/app-links/verify-android-applinks) provides an
example:

```xml

<application>

    <activity android:name=”MainActivity”>
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="http"/>
        <data android:scheme="https"/>
        <data android:host="www.example.com"/>
    </intent-filter>
</activity>
<activity android:name=”SecondActivity”>
<intent-filter>
<action android:name="android.intent.action.VIEW"/>
<category android:name="android.intent.category.DEFAULT"/>
<category android:name="android.intent.category.BROWSABLE"/>
<data android:scheme="https"/>
<data android:host="www.example.net"/>
</intent-filter>
        </activity>

        </application>
```

In this case, the Android app would access `https://www.example.com/.well-known/assetlinks.json`
and `https://www.example.net/.well-known/assetlinks.json` to check whether the right specification has been laid out in
the `assetlinks.json`. For intercepting links in mobile browsers the `delegate_permission/common.handle_all_urls` would
be needed for namespace `web`. For intercepting links on any other native app (e.g. Gmail or other third party
apps) `android_app` is needed.

In general, there are two namespaces `web` and `android_app` to access password credentials and/or passkeys
in the web (default browser on Android) and in a native
app [(source)](https://developers.google.com/identity/smartlock-passwords/android/associate-apps-and-sites?hl=en). The
grant for this is `delegate_permission/common.get_login_creds`.

Current recommendation for FIDO is to [use both](https://developers.google.com/identity/fido/android/native-apps?hl=de):
*“The relation will eventually only require `delegate_permission/common.get_login_creds` in order to share credentials
between websites and apps, however, until we complete migrating our logic to accept it, please include
both `delegate_permission/common.handle_all_urls` and `delegate_permission/common.get_login_creds`.”*

This will lead  to [Android App Links](#android-app-links) being intercepted and opened in the native app (not
[Deep Links](#deep-links) or historic web links, where native apps could just arbitrary register to listen to URLs.

See the overview of different link types:

![Type of links](../../../static/img/type-of-links.png)

### Deep Links

They allow to work with any scheme without host specification. The only thing is that the scheme must be
unique: `your_scheme://any_host` or `corbado://any_host` (comparable
to [Custom URL schemes](./ios.md#custom-url-schemes) in iOS).

### Android App Links

They only work with an https scheme and specified host and
hosted [Digital Asset Links](#digital-asset-links--dal-) file: `https://your_host` (comparable
to [Universal Links](./ios.md#universal-links) in iOS).