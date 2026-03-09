# Auth

## Method
Google OAuth 2.0 with PKCE

## Key Routes
- /auth/login
- /auth/callback
- /admin

## Session
- Cookie name: gw_admin
- Value used: authorized

## Notes
- Admin access is restricted by allowed Google email
- Callback URL must match current origin exactly
