---
title: Rebuilding this site with Astro and Keystatic
summary: A full rebuild that added Japanese / English switching, writeups, and dark and light themes. Notes on the structure and the decisions along the way.
date: '2026-09-15'
category: build
tags:
  - Astro
  - Keystatic
  - Vercel
draft: false
---

I rebuilt my profile site from scratch. The previous version was a single page with some content hardcoded into components, and English fields that existed in the CMS but were never displayed. It had become hard to grow.

## Structure

- **Astro**: every page is prerendered as static HTML
- **Keystatic**: a CMS that edits YAML and Markdown directly in the GitHub repository
- **Vercel**: hosting and security headers

I chose Keystatic because the content stays in the repository as plain files. Editing through the admin UI still produces an ordinary commit.

## Japanese / English switching

Languages are separated by URL: Japanese at `/`, English at `/en/`. On the content side, each entry carries both languages in fields like `description` and `description_en`. When the English field is empty, the page falls back to Japanese.

Writeups are the exception because their body is Markdown, so they live in `writeups/ja/` and `writeups/en/`, and posts that share a slug are linked through the language switch.

## Motion

I added a few pieces of motion, keeping them restrained.

- A slowly drifting network of points and lines behind the hero (static under `prefers-reduced-motion`)
- Scroll-triggered reveals
- A spotlight that follows the cursor over cards
- Fades between page transitions

All of it is small vanilla JS and CSS, no libraries.

## Theme

Dark is the default, to match the OG image. There is a light theme too, toggled from the header. Theme detection runs in an inline script inside `<head>` to avoid a flash on first paint.

---

The change that mattered most was letting the CMS decide what appears on the page. The less is hardcoded, the easier the site is to grow.
