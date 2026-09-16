---
title: The save succeeded. Pressing it again returned a 500.
summary: Making a project-linking operation safe to retry, without creating duplicate records or extra events.
date: '2026-09-17'
category: build
tags:
  - Backend
  - Testing
  - Idempotency
draft: false
---

In August 2026, I fixed an operation in an internal tool that links records to a project. The first save worked, but sending the same request again returned a 500 error.

The database already contained the relationship the user wanted. The error message still left them wondering whether anything had been saved. Clicking again during a slow response could be enough to reach that state.

## Treat an existing relationship as success

The goal of this operation is for a particular relationship to exist. There is no need to create it twice.

I changed the operation to return success when that exact relationship already exists, separating first-time creation from a retry that confirms the existing state. The property of producing the same result when an operation is repeated is called idempotency.

This does not mean catching every error and calling it success. It applies only when the intended relationship is already there. Suppressing unrelated failures would hide cases where the save really did not work.

## Duplicate events matter too

Creating the relationship also produced an event. Preventing duplicate database relationships alone would not be sufficient if retries still added extra events.

The fix made retries of an existing relationship create neither another relationship nor another event. I checked what the operation added, not just whether its return value said it succeeded.

Disabling a save button temporarily can help, but it is not a complete answer. Retries can arrive for reasons other than another click, including a repeated network request.

## Include the second request in the tests

I added tests covering repeated requests and checked lint and the production build. Testing only the first successful save would have missed the bug.

A relationship is a useful example because its intended end state is clear. Email delivery or payments need a separate decision about which requests count as the same action. I would not copy this fix into those operations without working through that question.

It was a small bug, but it added a question to the way I review save operations: what happens when the same request arrives again?
