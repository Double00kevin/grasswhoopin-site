# Architecture

## Purpose
Admin/control system for GrassWhoopin operations.

## Stack
- Astro SSR
- Cloudflare Workers
- Cloudflare D1
- Google OAuth via Arctic
- Cookie-based admin session

## Main Runtime Flow
Browser
→ Cloudflare Worker
→ Astro SSR routes/pages
→ D1 database
