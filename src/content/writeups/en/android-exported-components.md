---
title: A procedure for reviewing exported components in Android apps
summary: From reading the manifest to invoking components with adb and checking permission boundaries. The first things I check when reviewing an Android app, written as a procedure.
date: '2026-07-12'
category: security
tags:
  - Android
  - IPC
  - Methodology
draft: false
---

The first thing I look at in an Android app is its **exported components**. Knowing which Activities, Services, BroadcastReceivers, and ContentProviders can be reached from other apps, and what input they accept, gives you the shape of the app's permission boundary.

> These notes assume research within an authorized scope. Always read the target program's policy first.

## 1. Extract the manifest

Once you have the APK, get `AndroidManifest.xml` into a readable form.

```bash
apktool d target.apk -o target/
```

Open `target/AndroidManifest.xml` and look for:

- Components with an explicit `android:exported="true"`
- Components that declare an `<intent-filter>` but omit `android:exported` (implicitly exported on targetSdk 30 and below)
- Whether the component is protected by `android:permission`

## 2. Build a table

List every component you found in four columns: type, name, protection, and the data it receives.

| Type | Name | Protection | Receives |
| --- | --- | --- | --- |
| Activity | `.deeplink.RouterActivity` | none | `https://` scheme data |
| Service | `.sync.SyncService` | signature permission | Intent extras |
| Provider | `.files.ShareProvider` | `grantUriPermissions` | content URI |

Once it is in a table, the "unprotected and accepts external input" combinations stand out on their own.

## 3. Invoke them with adb

Take the unprotected ones and actually call them.

```bash
# Launch an Activity through a deep link
adb shell am start -a android.intent.action.VIEW \
  -d "https://example.com/open?next=/settings" \
  com.example.app

# Send an Intent to a BroadcastReceiver
adb shell am broadcast -a com.example.app.ACTION_REFRESH \
  -n com.example.app/.RefreshReceiver
```

What matters here is not whether it launches, but **how the app handles the input you passed**. Keep `logcat` open and watch whether the input flows straight into a WebView or gets used as a file path.

## 4. Check the permission boundary

Being able to invoke a component is not a vulnerability on its own. I check the boundary with three questions:

1. Which caller is this component designed to be invoked by?
2. When called from outside, does it run in an unexpected state, such as the context of a logged-in user?
3. Does that reach data or actions that another app should not be able to reach?

Only when the answer to the third question is yes does it become something worth reporting.

## 5. Record as you go

Keep a timeline of the commands you ran and what you observed. When it is time to write the report, trimming the reproduction steps becomes far easier.

---

Reviewing exported components is unglamorous, but I think it is the most efficient entry point for understanding an Android app's permission boundary.
