---
title: My dashboard was fetching the same data three times
summary: Consolidating the data behind overview, insights, and progress, while keeping measured results separate from expected performance improvements.
date: '2026-09-17'
category: build
tags:
  - Database
  - Performance
  - Testing
draft: false
---

While investigating a dashboard in an internal tool, I found that its overview, insights, and progress sections were each fetching the same kinds of data: purchasing, email, tasks, accounting, and projects. Each function needed the data, but combining them on one page meant repeated reads.

In August 2026, I reworked that path. Before adding a cache, I traced what one page load was requesting and how often.

## Separate display functions each owned their data access

Having one function for the overview, another for insights, and another for progress made their individual responsibilities easy to read. The problem was that each function also fetched its source data.

Calling them together from the dashboard repeated database round trips. Separate display components had quietly become separate data-fetching paths, even when they depended on the same information.

## Fetch shared data once, then derive the display values

I introduced an overview path for the dashboard as a whole. It retrieves shared data and derives the insights, progress, and approval counts from it.

The existing individual APIs remained available for mobile compatibility. Replacing them purely for the browser's benefit could have broken another consumer. The internal consolidation and the externally used interfaces needed separate treatment.

I also reduced repeated user and access-information lookups used for authentication display, removing initialization work that was unnecessary on the read path. Permission checks, synchronization, and auditing needed by administrative operations remained in place. Fewer queries must not mean fewer required checks.

## Removing duplication is not a measured speedup

After the changes, lint, tests, the production build, and browser tests in an isolated environment passed. Those checks supported the structural change and the preservation of existing behavior.

At the time of this record, I had not repeated before-and-after timing on the authenticated production page. I do not have a percentage improvement to report.

What interested me was that looking for one slow query would not have explained the whole problem. Next time I investigate a page that makes me wait, I want to start by counting how often it asks for the same information.
