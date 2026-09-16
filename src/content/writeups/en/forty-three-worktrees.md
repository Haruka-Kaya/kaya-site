---
title: Before AI could organize my life, I had 43 worktrees to clean up
summary: My personal assistant was meant to help with calendars and email. Its development folders needed attention first.
date: '2026-09-17'
category: notes
tags:
  - Build outtakes
  - Git
  - AI
draft: false
---

I am building a personal AI assistant to handle things such as calendars and email. The idea is to make the small chores of daily life a little easier.

Then there is this entry in the development notes.

September 3, 2026: removed 43 development worktrees on Windows. None had uncommitted changes.

Forty-three.

Before the life-organizing system could organize much of anything, its own development environment needed tidying up. Apparently my working directories had a fuller calendar than I did.

## Individually, a very useful feature

A Git worktree lets you work on another branch of the same repository in a separate folder. You can leave one piece of work in place while trying a different change elsewhere.

That really is useful. It just sounds more defensive when followed by the number 43.

I do not have a heroic story for every single folder. What the record establishes is that there were 43 of them at cleanup time, and none had uncommitted changes. It does not mean I finished 43 projects. I will resist converting directories into achievements.

## Keeping the contents safe was the serious part

The same day's notes record moving a production environment configuration out of a working folder and into the main repository's working directory, then checking that it remained excluded from Git.

Having no uncommitted changes is not a substitute for checking ignored configuration files. A cluttered directory is not automatically disposable.

The settings and their storage details are not included here. Publishing secrets in a story about tidying up would turn it into a very different story.

I also built the assistant's Google calendar and email tools. That part appears in my [article about permissions and input schemas](/en/writeups/ai-tools-permissions-and-schemas/).

That one is about OAuth and APIs. This one is about the person building a convenient tool having 43 working directories.
