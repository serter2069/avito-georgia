# Avito Georgia

Ресурс как Авито для Грузии -- доска объявлений.

## Stack
- Frontend: Expo (React Native web-first) with expo-router
- Backend: Express.js API in /api/
- ORM: Prisma
- DB: PostgreSQL (REMOTE ONLY on 91.98.205.156)

## URLs
- Staging: https://avito-georgia.smartlaunchhub.com
- API: https://avito-georgia.smartlaunchhub.com/api
- Local ports → see `~/.claude/guides/projects.md`

## Local Development

Secrets: **Doppler** (workspace: Sergei MSP, project: `avito-georgia`, config: `dev`)

```bash
doppler login      # один раз на машину
doppler setup --project avito-georgia --config dev --no-interactive
cd api && doppler run -- npm run dev
npx expo start --web
```

Управление секретами:
```bash
doppler secrets --project avito-georgia --config dev
doppler secrets set KEY=value --project avito-georgia --config dev
```

## Development
```bash
npx expo start --web
cd api && npm run dev
```

## Database
No local DB. Remote PostgreSQL on 95.217.84.161.
