# VELORA — Decision Log

Append one line per non-obvious decision: `decision | reason`

---

| Decision | Reason |
|----------|--------|
| Monorepo in `/velobase`, not `/velorav1` | v1 was a static HTML prototype; v2 uses proper Next.js + Turborepo as specified in section 3 |
| Tailwind v4 with `@theme inline` for tokens | Tailwind v4 ships with `create-next-app@latest`; `@theme` replaces `tailwind.config` and keeps tokens in CSS |
| Google Fonts link tag for Bricolage Grotesque | `next/font/google` doesn't support the `opsz` (optical size) and width variable axes Bricolage needs for expressive headlines |
| Dark theme as default (`data-theme="dark"`) | v1 was dark-first and the VELORA palette (Basalt, Graphite, Slate) reads as a dark identity; light mode is equal but dark is the hero |
| Signal Saffron `#F2A900` as the sole accent | Section 6 of the master skill locks this; v1 used `#f59e0b` (Tailwind amber-500) which is close but not canonical |
| gap-px border pattern for features grid | Section 6 forbids "identical rounded cards in a grid"; gap-px with bg-border-subtle creates natural separators |
