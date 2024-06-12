---
sidebar_position: 1
---

# Overview

The following table gives an overview of the different names and settings of native Android (Kotlin), native iOS (Swift)
or Flutter (Dart) for iOS / Android apps.

|                                                                               | Android (Kotlin)                                                                                                                                                                                                                                                                            | iOS (Swift)                                                                                                                                                                                                                                                                                                          | Flutter (Dart)                                                                                                                                                                                                                                                                                                |
|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Official passkeys implementation advice                                       | [Android Developer](https://developer.android.com/training/sign-in/passkeys)                                                                                                                                                                                                                | [Apple Developer](https://developer.apple.com/documentation/authenticationservices/public-private_key_authentication/supporting_passkeys)                                                                                                                                                                            | None yet, use the platform-specific solution                                                                                                                                                                                                                                                                  |
| Requires whitelisting of passkey API endpoint                                 | No                                                                                                                                                                                                                                                                                          | Yes - via [AASA](./ios#apple-app-site-association-aasa)                                                                                                                                                                                                                                                              | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Allows sharing of passkeys with web app                                       | Yes - via [DAL](./android#digital-asset-links-dal)                                                                                                                                                                                                                                          | Yes - via [AASA](./ios#apple-app-site-association-aasa)                                                                                                                                                                                                                                                              | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Allows interception of link from email magic link                             | Yes - via [DAL](./android#digital-asset-links-dal)                                                                                                                                                                                                                                          | Yes - via [AASA](./ios#apple-app-site-association-aasa)                                                                                                                                                                                                                                                              | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Name of link interception ("Open link directly in native app")                | [Android App Links](./android#android-app-links)                                                                                                                                                                                                                                            | [Universal Linking](./ios#universal-links)                                                                                                                                                                                                                                                                           | [Deep Linking](#deep-linking)                                                                                                                                                                                                                                                                                 |
| Location of association file                                                  | `your-domain.com/.well-known/assetlinks.json`                                                                                                                                                                                                                                               | `your-domain.com/.well-known/apple-app-site-association`                                                                                                                                                                                                                                                              | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| File cached                                                                   | Yes (by Play Services)                                                                                                                                                                                                                                                                      | Yes (since iOS 14), initial sync may take up to 24 hours                                                                                                                                                                                                                                                             | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| By-pass possible                                                              |                                                                                                                                                                                                                                                                                             | Yes, with [alternate mode section](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains)                                                                                                                                                                    | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Testable with                                                                 | [Google API](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://www.facebook.com&relation=delegate_permission/common.handle_all_urls) (you need to change the value for `source` parameter)                                                                | [Branch.io](https://branch.io/resources/aasa-validator/)                                                                                                                                                                                                                                                             | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| App identifier example                                                        | SHA-256 fingerprint `E3:F9:E1:E0:CF:99:D0:E5: 6A:05:5B:A6:5E:24:1B:33: 99:F7:CE:A5:24:32:6B:0C: DD:6E:C1:32:7E:D0:FD:C1`                                                                                                                                                                    | TeamID.BundleID `T84QZS65DQ.com.facebook.Messenger`                                                                                                                                                                                                                                                                  | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Where to find identifier                                                      | <ul><li>When already uploaded: Google Play Console -> Release management -> App signing</li><li>Local: `keytool -list -v -keystore <keystore path> -alias <key alias> -storepass <store password> -keypass <key password>`</li></ul>                                                        | The TeamID can be found in the developer account on [https://developer.apple.com](https://developer.apple.com) and the BundleID is the exact name from within the Xcode project.                                                                                                                                     | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Name of section that links native app to web app                              | `delegate_permission/ common.handle_all_urls`                                                                                                                                                                                                                                               | `applinks`                                                                                                                                                                                                                                                                                                           | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Name of section that allows credential sharing between native app and web app | `delegate_permission/ common.get_login_creds`                                                                                                                                                                                                                                               | `webcredentials`                                                                                                                                                                                                                                                                                                     | Platform-specific solution                                                                                                                                                                                                                                                                                    |
| Registry of association files                                                 | List hostnames with `<data>`-entry in `AndroidManifest.xml` in the specific activity (part of Android app source code). The `<intent-filter android:autoVerify="true">` needs to be `autoVerify=true`. [(Source)](https://developer.android.com/training/app-links/verify-android-applinks) | Enable and add associated domain in Xcode development environment (setting of property to generate entitlements file)[(Source)](https://developer.apple.com/documentation/authenticationservices/connecting_to_a_service_with_passkeys)                                                                              | <ul><li>Android: Add `flutter_deeplinking_enabled` to AndroidManifest.xml [(Source)](https://docs.flutter.dev/cookbook/navigation/set-up-app-links)</li><li>iOS: Add `FlutterDeepLinkingEnabled=true` to Info.plist. [(Source)](https://docs.flutter.dev/cookbook/navigation/set-up-universal-links)</li></ul> |
| Helpful tutorials on native passkey implementation                            |                                                                                                                                                                                                                                                                                             | <ul><li>[Quick guide on associated domains in iOS](https://tanaschita.com/20220725-quick-guide-on-associated-domains-in-ios/)</li><li>[Passkeys iOS Developer Guide](https://tanaschita.com/20230227-passkeys-ios-developer-guide)</li><li>[iOS Passkeys](https://quickbirdstudios.com/blog/ios-passkeys/)</li></ul> |                                                                                                                                                                                                                                                                                                               |
| Ongoing development within platform                                           | Android 14 introduces [third party access to passkeys](https://www.dashlane.com/blog/dashlane-passkey-support-android) with [example application](https://github.com/Dashlane/android-passkey-example) that stores public keys only offline and uses new Credential API.                    |                                                                                                                                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                                                               |

## Handle links in native apps

The minimum setup for a passwordless native app would be:

- Register passkeys on the correct `rpID` (e.g. `acme.com`), so that both the respective web app (e.g. running
  at `app.acme.com` or `acme.com`) and also the native ACME app on iOS / Android can access the passkeys.
- Email magic links should be directly opened in the native app: when an email magic link from Corbado is clicked, the
  native app is opened directly (the native app needs to handle the incoming email magic link and talk to Corbado's
  frontend API at `https://auth.corbado.com`):
    - Problem 1: The email magic link is Corbado's `Application URL`. So it is the URL where the web components are
      embedded (usually the browser URL). If no `Application URL` is specified, the Corbado hosted
      page (`https://pro-xxx.auth.corbado.com`) is used. As soon
      as the user enters an `Application URL`, the email magic links will update. Therefore, the associated links (
      e.g. `pro-xxx.auth.corbado.com`) in [DAL](./android.md#digital-asset-links--dal-)
      or [AASA](./ios.md#apple-app-site-association--aasa-) will not work and nothing triggered, unless the files are
      updated.
    - Problem 2: If we use exactly the same link in an email magic link for desktop and mobile devices, the native app
      on a mobile device will always be opened (and never the mobile browser). Therefore, the email magic link for a
      mobile browser will always be intercepted if the native app is installed. The following options exist:
        - Ignore
        - Generate a different path if email magic link is triggered from a native app, for example with
          path `/nativelinking/`. Register the links only on the specified path and only then trigger the native
          app.
        - In any case: if no app is installed, the default browser will be opened automatically.

### Open TODOs

- Deep linking of information (e.g. via URL Parameters) for handling in native app
    - Finding: Flutter is able to retrieve queryParams as a regular web app
- Check to see if magic link can be partially matched or it makes sense to (finalize examples)
    - Finding:
        - Generate email magic links on server:
```javascript
// This is an example using Node.js and Express.js

const express = require('express');
const app = express();

app.get('/magic-link', (req, res) => {
  const source = req.query.source;
  let magicLinkUrl;

  if (source === 'native') {
    // Magic link triggered from native app
    magicLinkUrl = 'https://example.com/magic-link/native';
  } else {
    // Magic link triggered from browser
    magicLinkUrl = 'https://example.com/magic-link/browser';
  }

  // Construct magic link URL with appropriate query parameters and path
  const magicLink = `${magicLinkUrl}?source=${source}`;

  // Send email or other means to the user containing the magic link URL
  sendMagicLinkEmail(magicLink);

  res.send('Magic link sent!');
});

function sendMagicLinkEmail(magicLink) {
  // Implement logic to send email with magic link URL
  console.log(`Sending magic link email: ${magicLink}`);
}

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

```javascript
const express = require('express');
const app = express();

app.get('/magic-link', (req, res) => {
  // Store path of magic link in local storage (alternatively with shared preferences or database)
  localStorage.setItem('magic-link-path', req.path);

  // Construct magic link URL with appropriate path and query parameters
  const magicLink = 'myapp://magic-link' + req.url;

  // Redirect magic link from browser to native app
  if (req.headers['user-agent'].includes('Mozilla')) {
    // Magic link triggered from browser
    const path = req.path;

    if (path === '/native/') {
      res.redirect(magicLink);
    } else {
      const webUrl = 'https://myapp.com' + path.replace('/native/', '/web/');
      res.redirect(webUrl);
    }
  } else {
    // Magic link triggered from native app
    res.send('Magic link triggered from native app');
  }
});

app.listen(3000,

```
- Send email magic link to users. The user opens the email link in Gmail or another third party app on his phone.
- Handle incoming email magic links in flutter
```Dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String? _magicLink;

  @override
  void initState() {
    super.initState();
    _initMagicLink();
  }

  void _initMagicLink() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _magicLink = prefs.getString('magic_link');
    });
  }

  Future<void> _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  Future<void> _launchMagicLink() async {
    final prefs = await SharedPreferences.getInstance();
    final magicLink = prefs.getString('magic_link');
    if (magicLink != null) {
      await _launchURL(magicLink);
    } else {
      // No magic link available, handle error
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_magicLink != null)
              ElevatedButton(
                onPressed: _launchMagicLink,
                child: Text('Launch Magic Link'),
              ),
            ElevatedButton(
              onPressed: () async {
                // Make request to server to generate magic link
                final response = await http.get('https://example.com/magic-link');
                final magicLink = response.body;

                // Store magic link in local storage
                final prefs = await SharedPreferences.getInstance();
                await prefs.setString('magic_link', magicLink);

                // Launch magic link
                await _launchURL(magicLink);
              },
              child: Text('Generate Magic Link'),
            ),
          ],
        ),
      ),
    );
  }
}


```
- Store path of magic link in local storage (alternatively with shared preferences or database)
- Redirect magic link from browser to native app
- The custom scheme will be `corbado://`
- AASA file:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.example.corbado",
        "paths": [ "/native/*" ]
      },
      {
        "appID": "TEAMID.com.example.corbado",
        "components": [
          {
            "/": "/web/*",
            "comment": "Open links in browser"
          }
        ]
      }
    ]
  }
}


```
- DAL file
```json
{
  "package_name": "com.example.corbado",
  "sha256_cert_fingerprints": [
    "B7:6A:5C:7E:AD:15:AC:31:84:70:28:E7:0E:22:8B:13:DE:EF:5E:06:43:1D:CB:2A:0F:5E:6E:E8:5D:F6:1D:71"
  ],
  "app_links": [
    {
      "package_name": "com.example.corbado",
      "sha256_cert_fingerprints": [
        "B7:6A:5C:7E:AD:15:AC:31:84:70:28:E7:0E:22:8B:13:DE:EF:5E:06:43:1D:CB:2A:0F:5E:6E:E8:5D:F6:1D:71"
      ],
      "intent": null,
      "include_fallback": true,
      "app_name": "Corbado",
      "link": "https://corbado.com/web/"
    },
    {
      "package_name": "com.example.corbado",
      "sha256_cert_fingerprints": [
        "B7:6A:5C:7E:AD:15:AC:31:84:70:28:E7:0E:22:8B:13:DE:EF:5E:06:43:1D:CB:2A:0F:5E:6E:E8:5D:F6:1D:71"
      ],
      "intent": null,
      "include_fallback": true,
      "app_name": "Corbado",
      "link": "corbado://magic-link/native/"
    }
  ]
}

```

### Things not considered yet

- Callbacks? https://auth0.com/blog/get-started-with-flutter-authentication/
- Social logins in this context, as OAuth2 flows are strongly recommended to be executed in a browser / WebView instead
  of
  directly in the native app (see [RFC 8252](https://datatracker.ietf.org/doc/html/rfc8252))
- Handling of uninstalled apps (e.g. store link)
- Migration and password autofill in native app

### Deep Linking

Deep linking allows to link into a native app instead of opening the link in the browser on mobile devices.

Source:

- Related to [deep linking](https://docs.flutter.dev/development/ui/navigation/deep-linking)
- [Prior approach](https://medium.com/flutter-community/deep-links-and-flutter-applications-how-to-handle-them-properly-8c9865af9283)