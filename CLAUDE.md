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
- Local frontend: http://localhost:8081
- Local API: http://localhost:3813

## Development
```bash
npx expo start --web
cd api && npm run dev
```

## Database
No local DB. Remote PostgreSQL on 91.98.205.156.
