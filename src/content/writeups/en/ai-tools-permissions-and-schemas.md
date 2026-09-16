---
title: Building a calendar and email assistant, then getting stuck on permissions and schemas
summary: Lessons from connecting Google services to a personal AI assistant, including renewed OAuth consent and a missing items field in an array schema.
date: '2026-09-17'
category: build
tags:
  - AI
  - OAuth
  - Google APIs
draft: false
---

Check my calendar, find an email, and turn it into a task if needed. I wanted to handle some of the things I normally do across several screens through a conversation, so I started building a personal AI assistant.

In July 2026, I integrated tools for Google Calendar, Tasks, Drive, Gmail, Contacts, Docs, and Sheets into a setup using n8n and Discord. The difficult parts were often outside the conversation itself: permissions and the API calls behind it.

## Adding a scope did not update existing consent

An OAuth scope describes the operations an application is allowed to request. I added scopes to the application configuration, but credentials obtained under an earlier grant did not automatically gain those permissions.

The code listed the permission I needed. The API still refused the operation. Looking only at the configuration made this easy to miss.

I needed to obtain consent for the expanded scope. Since then, I have treated the permissions an implementation requests and the permissions actually granted as separate things to check. Being able to sign in is not proof that a particular API operation will work.

## One incomplete array schema stopped the request

Another failure came from a tool definition sent to Gemini. I had declared an `ARRAY` but omitted `items`, which describes the type of its elements.

The request containing the tool definitions failed with a 400 before the tool could run. Because several tools were bundled into that request, it looked as though the whole conversation had stopped working.

Changing the prompt would not repair a malformed schema. I inspected the definitions and supplied the element type. As the number of tools grows, testing only through conversation makes this kind of failure harder to isolate.

## Test the connection separately from the conversation

I moved the Google API integration from direct `fetch` calls to `googleapis` and added a connection-check script. Testing authentication and API calls on their own helps distinguish a connection problem from a problem in the conversational layer.

Reading an email and sending one also have different consequences when something goes wrong. For actions that affect another person, I want to keep a human decision about what will be sent.

This article looks back at the July implementation. In September, I moved the development environment from Windows to a Mac; reconnecting services and verifying startup after that move remained separate work. Having written the tools is not the same as having them reliably available in my everyday environment.

Related: [Building with AI](/en/hobbies/aiagents/)
