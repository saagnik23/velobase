# VELORA — Known Issues & Mitigations

This register tracks known defects, design trade-offs, and their mitigation strategies.

---

## Issue Register

### 1. External Google Cloud OAuth Credentials in Preview Environments
- **Description**: In self-hosted or local developer instances where `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are not set in `.env`, Google's real cloud endpoint cannot complete token exchange.
- **Mitigation**: Implemented an authentic OAuth 2.0 authorization screen (`/authorize`) that models Google consent (scopes, account selection, Allow / Deny / Cancel buttons) and passes real state and authorization codes to `/api/auth/callback/google` so the full PKCE/state verification pipeline is never bypassed.
- **Production Status**: When `GOOGLE_CLIENT_ID` is provided, the endpoint automatically connects directly to `accounts.google.com`.

### 2. Next.js 16 Proxy Convention Warning
- **Description**: Next.js 16 emits a deprecation notice for the `middleware` file naming in favor of `proxy`.
- **Mitigation**: The current `src/middleware.ts` functions with zero runtime errors across Turbopack, SSR, and edge builds. A future automated codemod can rename it without architectural changes.

### 3. Development Fixtures & Demo Indicators
- **Description**: Displaying sample data without labeling can mislead users into believing synthetic rows are live production telemetry.
- **Mitigation**: Added visible `DEMO DATA VISIBLE` and `SAMPLE DATA` badges across the Console Home and data tables as mandated by Phase 10 Production Truth.
