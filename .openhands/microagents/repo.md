# AvitoGeorgia — Project Context

**Description:** Marketplace app for buying/selling in Georgia (like Avito). Sellers list items, buyers browse and chat.
**Tech stack:** Expo + React Native + NativeWind (Tailwind) + TypeScript
**GitHub repo:** serter2069/avito-georgia
**Staging:** staging not yet deployed
**Proto hub:** https://proto.smartlaunchhub.com/avito-georgia/ (password: Sara@dura!)
**Development branch:** development

## Key files
- `constants/pageRegistry.ts` — SINGLE SOURCE OF TRUTH for all pages + QA state
- `components/proto/states/` — one *States.tsx per page
- `app/proto/states/[page].tsx` — dynamic route that renders States.tsx
- Brand/colors: look for `constants/brand.ts` or `constants/colors.ts`

## Commit & push
```bash
git add .
git commit -m "proto: description of changes"
git push origin development
```

## Proto pages status
Check `constants/pageRegistry.ts` for `qaCycles` field.
- `qaCycles` missing or 0–4 → needs more work
- `qaCycles >= 5` → ready for manual review, skip
