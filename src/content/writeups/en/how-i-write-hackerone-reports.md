---
title: How I write HackerOne reports
summary: Reading the scope, trimming reproduction steps, and communicating impact. The rules I follow so that triagers can read a report in minutes.
date: '2026-08-24'
category: bugbounty
tags:
  - HackerOne
  - Responsible disclosure
  - Reporting
draft: false
---

The part of bug bounty that takes me the most time is not finding the vulnerability. It is writing the report. I want a triager to understand what happened and how far it reaches within the first few minutes. These are the rules I hold myself to.

## 1. Read the policy and scope before you research

Obvious, and still the step most often skipped. A program policy lists more than the target domains and apps. It tells you **what you must not do**: automated scanning, affecting other users, social engineering, and so on.

Once I have read the policy, I keep three notes:

- What is in scope and what is out of scope
- Which testing techniques are forbidden
- What the report needs to include (a PoC video, a designated test account, and so on)

I re-read those notes constantly. They are the line that tells me to stop the moment I wonder whether something is in scope.

## 2. Trim reproduction steps by removing assumptions

Right after a find, my reproduction steps are usually full of details that depend on my own setup. Before they go into a report I ask:

- Does it still reproduce without this step?
- Is a specific account state (paid plan, special role) really required?
- Can it reproduce without browser extensions or my own tooling?

Fewer assumptions means easier reproduction on the triage side and a more accurate impact estimate. When an assumption is genuinely required, I write down **why** it is required.

## 3. Separate confirmed facts from guesses

This is the part I am most careful about.

> Confirmed: calling endpoint X with user A's token and user B's resource ID returns 200 and includes B's data.
>
> Guess: the same pattern may exist on the related endpoint Y. Not verified.

Writing down a guess is fine. Writing a guess as if it were a fact costs the triager time and lowers the credibility of the whole report. I separate the two with headings or bold text.

## 4. Push impact exactly one step from the attacker's view

When describing what the vulnerability enables, I try not to leap. If an IDOR exposes another user's email address, I state that fact and how serious it is **in the context of that program**. If I want to claim it leads to account takeover, I verify that path with the same rigor before writing it.

## 5. Evidence: minimal, but sufficient

- Strip unrelated parts from requests and responses before pasting them
- If a video is required, keep it short but complete enough to follow
- Mask personal data and say that it was masked

## 6. Build tools for yourself

Doing all of the above by hand every time is exhausting, so I am building an internal platform that evaluates scope before I start and keeps decisions and evidence in an audit log. It is a safety mechanism against accidentally touching something out of scope, and it collects the material I need when writing.

---

I believe the quality of the report matters as much as the severity of the finding. Saving the reader's time ends up reflected in how the report is received.
