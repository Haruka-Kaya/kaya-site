---
title: Binding email approval to a version of its recipients, body, and attachments
summary: Invalidating old approval and pending delivery when content changes. Implementation notes on defining exactly what was authorized.
date: '2026-09-17'
category: security
tags:
  - Authorization
  - State management
  - AI tools
draft: false
---

An approved flag alone cannot describe which email is authorized for delivery. Changing the recipient, CC, body, or attachments changes what the reviewer was asked to approve.

In August 2026, I bound these fields to an email version in an operational tool I develop. This article examines that implementation record. It is not a vulnerability report about an external service.

## Recipients belong to the approval target

The implementation includes the recipient and CC in the email version's content hash. An identical body addressed to different people is not treated as the same approval target. Attachment changes matter too.

The intended invariant is that the approved version matches the version about to be sent. A content hash helps establish that match; it does not replace a decision by someone authorized to approve the action.

## Editing also invalidates pending delivery

Changes to the recipient, CC, body, or attachments invalidate old approval. Leaving pending delivery intact could let a previously scheduled action proceed while the interface showed that another review was needed. I therefore invalidated both the old approval and the unsent queue entry.

| Operation | Implemented behavior |
| --- | --- |
| Change recipient, CC, body, or attachments | Invalidate old approval and pending delivery |
| Resubmit after rejection or a revision request | Submit a new review version containing the changes |
| Reuse the previous CC | Use only an approved email with the same recipient |

This is not a mechanism for recalling a delivered email. It governs approval and queued work when content changes before delivery.

## Natural-language input still needs server-side rules

For requests containing several email addresses, the first becomes the recipient and the others become CC. Requests to reuse the previous CC have a restricted source, rather than drawing recipients from unrelated emails.

The tool permits up to ten CC entries and rejects duplicates and invalid header input on the server. These are this application's rules, not universal email limits or requirements for every AI tool.

A natural-language interface does not require leaving delivery constraints to a prompt. Recipient validation, the version under review, and invalidation after edits are application state.

## Verified scope and further review questions

The recorded change passed CI, 76 tests, ESLint, and the production build, followed by a Ready deployment. That record does not establish coverage of every concurrency or failure case.

Further review should examine editing during delivery processing, retries, and version changes immediately before queued work executes. These are review questions, not results from live retesting for this article.

The change made two things explicit: the content an approval refers to, and how long that approval remains valid as the content changes.
