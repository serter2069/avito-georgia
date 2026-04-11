# AvitoGeorgia — Project Overview

## Tagline
Доска объявлений для Грузии — аналог Авито

## Description
Классифайд-платформа для размещения объявлений в Грузии. Пользователи могут продавать и покупать товары, размещать объявления, переписываться в чате. Поддерживает языки KA/RU/EN, города: Тбилиси, Батуми, Кутаиси, Рустави, Гори, Зугдиди.

## Roles
- **GUEST** — Неавторизованный пользователь. Может просматривать объявления, поиск, профили продавцов.
- **USER** — Вошёл через email OTP. Может размещать объявления, писать в чат, добавлять в избранное.
- **PREMIUM** — Подписка 29.99 GEL/мес. Безлимитные объявления, значок Premium, приоритет в поиске.
- **ADMIN** — Полный доступ: модерация объявлений, управление пользователями, категориями, настройками.

## Scenarios
### S-001: Просмотр объявлений (GUEST, USER)
1. homepage → listings-feed → listing-detail

### S-002: Поиск (GUEST, USER)
1. search → listings-feed или map-view → listing-detail

### S-003: Авторизация (GUEST)
1. auth-email → auth-otp → onboarding (первый вход) → homepage

### S-004: Размещение объявления (USER, PREMIUM)
1. create-listing → my-listings (черновик/активное)

### S-005: Переписка (USER, PREMIUM)
1. listing-detail → chat-thread → messages-list

### S-006: Продвижение объявления (USER, PREMIUM)
1. my-listings → promote-listing → (Stripe) → promotion-success

### S-007: Premium подписка (USER)
1. profile → subscription → (Stripe) → dashboard

### S-008: Модерация (ADMIN)
1. admin-dashboard → admin-moderation → (одобрить/отклонить)
