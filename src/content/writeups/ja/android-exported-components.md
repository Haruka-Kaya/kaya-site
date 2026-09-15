---
title: Androidアプリのexported componentsを調べる手順
summary: Manifestの読み方から、adbでの呼び出し、権限境界の確認まで。Androidアプリの調査で最初に確認している項目を、手順として整理しました。
date: '2026-07-12'
category: security
tags:
  - Android
  - IPC
  - Methodology
draft: false
---

Androidアプリを調査するとき、最初に確認しているのが **exported components** です。Activity、Service、BroadcastReceiver、ContentProvider のうち、他アプリから呼び出せるものがどれで、そこにどんな入力が渡せるのかを把握すると、権限境界の全体像が見えてきます。

> この記事は、許可された範囲での調査を前提とした手順のメモです。対象のプログラムのポリシーを必ず先に確認してください。

## 1. Manifestを取り出す

APKを取得したら、まずは `AndroidManifest.xml` を読める形にします。

```bash
apktool d target.apk -o target/
```

`target/AndroidManifest.xml` を開き、次の要素を探します。

- `android:exported="true"` が明示されているコンポーネント
- `<intent-filter>` を持ち、`android:exported` が省略されているコンポーネント（targetSdk 30以前では暗黙的にexportedになる）
- `android:permission` で保護されているかどうか

## 2. 一覧を作る

見つけたコンポーネントを、種類・名前・保護の有無・受け取るデータの4列で表にします。

| 種類 | 名前 | 保護 | 受け取るもの |
| --- | --- | --- | --- |
| Activity | `.deeplink.RouterActivity` | なし | `https://` スキームのdata |
| Service | `.sync.SyncService` | signature permission | Intent extras |
| Provider | `.files.ShareProvider` | `grantUriPermissions` | content URI |

表にしておくと、「保護なし × 外部入力あり」の組み合わせが自然と浮かび上がります。

## 3. adbで実際に呼び出す

一覧の中から、保護されていないものを実際に呼び出してみます。

```bash
# Activity を deep link 経由で起動する
adb shell am start -a android.intent.action.VIEW \
  -d "https://example.com/open?next=/settings" \
  com.example.app

# BroadcastReceiver に Intent を送る
adb shell am broadcast -a com.example.app.ACTION_REFRESH \
  -n com.example.app/.RefreshReceiver
```

ここで見たいのは「起動できるか」ではなく、**渡した入力がアプリの中でどう扱われるか**です。`logcat` を並行して眺め、入力がそのまま WebView に渡っていないか、ファイルパスとして使われていないか、を追います。

## 4. 権限境界を確認する

呼び出せたとしても、それだけでは脆弱性とは言えません。次の問いで境界を確認します。

1. そのコンポーネントは、本来どの主体から呼ばれる想定か
2. 外部から呼んだときに、想定と違う状態（ログイン済みユーザーのコンテキストなど）で動くか
3. 結果として、他アプリから読めないはずのデータや操作に届くか

3つ目まで到達して初めて、報告に値する問題になります。

## 5. 記録しながら進める

調査中は、実行したコマンドと観察した結果を時系列で残します。あとで報告を書くときに、再現手順を「削る」作業が格段に楽になります。

---

exported components の確認は地味ですが、Androidアプリの権限境界を理解するうえでいちばん効率のよい入口だと思っています。
