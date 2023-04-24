---
sidebar_position: 2
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
hosting works correctly.

The following constraints must hold for the file:

- It must be publicly available, and not behind a VPN.
- It must be served with Content-type: application/json.
- It must be accessible over HTTPS.
- It must be served directly with an HTTP 200 response (no HTTP 300’s redirect).
- Ensure no robots TXT prevents it:
    - User-agent: *
    - Allow: /.well-known/

You can verify the file and hosting manually by
following [this guide](https://developer.android.com/training/app-links/verify-android-applinks#manual-verification).

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

## Native app linking

It seems that asset links.json does not
need to be updated if you intent to create native apps
only [(implementation advice)](https://developer.android.com/training/sign-in/passkeys).

To link native Android Apps to web apps and allow intercepting links or accessing password stored in Webview Android
uses
`assetlinks.json`. For example `www.facebook.com/.well-known/assetlinks.json` provides the links for Facebook. It is
deployed
identically on all relevant domains that are used for app linking (opening email or web links directly in the native
app):
`kundenbereich.check24.de/.well-known/assetlinks.json`. For example other subdomains can include also the main
specification using `https://urlaub.check24.de/.well-known/assetlinks.json`.

When the Android app starts, it uses the information in the `AndroidManifest.xml` to find out which domains might be
linked to the app. More than one domain is possible. They need to be specified like
that: [{"include":"https:\/\/www.check24.de\/.well-known\/assetlinks.json"}] like it is done
here: `https://urlaub.check24.de/.well-known/assetlinks.json`.

[Android developer source](https://developer.android.com/training/app-links/verify-android-applinks)

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

In this case the Android app would access `https://www.example.com/.well-known/assetlinks.json`
and `https://www.example.net/.well-known/assetlinks.json` to check whether the right specification has been laid out in
the `assetlinks.json`. For intercepting links in mobile browsers the `delegate_permission/common.handle_all_urls` would
be
needed for namespace `web` (when clicking in the browser open the web) for intercepting links on any other app (GMail,
other third party apps) `android_app`.

In general there are two namespaces `web` and `android_app` to be able to access password credentials and/or passkeys
between the web (system browser on Android) and a native app also `assetlinks.json` is used. This can be found
[here](https://developers.google.com/identity/smartlock-passwords/android/associate-apps-and-sites?hl=en). The grant for
this is `delegate_permission/common.get_login_creds`.

Current recommendation for FIDO is to [use both](https://developers.google.com/identity/fido/android/native-apps?hl=de):
*“The relation will eventually only require `delegate_permission/common.get_login_creds` in order to share credentials
between websites and apps, however, until we complete migrating our logic to accept it, please include
both `delegate_permission/common.handle_all_urls` and `delegate_permission/common.get_login_creds`.”*

This will lead also to the links being intercepted and opened in the app. We are talking about Android app links (not
deep links which would be something like `corbado://` or historic web links, where native aps could just arbitrary
register to listen to URLs):

![Type of links](../../../static/img/type-of-links.png)