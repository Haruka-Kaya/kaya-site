---
title: Running tests and a build in parallel saved time, until it needed a rerun
summary: A small parallelism failure while updating this site. Two commands were touching the same generated files.
date: '2026-09-17'
category: notes
tags:
  - Build outtakes
  - Astro
  - Development environment
draft: false
---

While adding articles to this site, I was using Codex to check the tests and production build.

The two commands ran at the same time. A reasonable-looking opportunity to cut the wait.

The result: 50 tests passed. The build failed.

The time-saving check now included an extra failure to investigate.

## Two commands, one drawer

The build reported `ENOENT`: a file was missing. Astro had failed while renaming a generated temporary file to its final name.

I had added articles. Why was a generated file disappearing?

This project's pretest step runs `astro sync`. The build also synchronizes content and prepares generated files. Both commands were running in the same working directory, touching the same `.astro` output.

Two commands did not mean two separate workspaces.

## Running them in sequence worked

After the tests finished, I ran the build on its own. It passed. No changes to the articles were needed.

I had wanted to reduce the waiting time, not observe two processes competing over generated files. Still, that was the experiment I got.

This site also has an [article about a save operation that failed when repeated](/en/writeups/saving-twice-without-failing/). While preparing to publish a fix for one kind of repeated-operation problem, the workflow found another kind of collision. Material for the blog continues to arrive.

Tests and builds that share this working directory now run in sequence. Including the build for this article.
