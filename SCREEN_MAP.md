# SCREEN_MAP.md — AvitoGeorgia

> System Analysis: https://diagrams.love/canvas?schema=cmnw53bop000ezmerdh298uvt
> All Tailwind classes use actual hex values from brand.

---

## Section 0: Global Layout Rules

### Responsive
- Mobile (<640px): content full width, `px-4` (16px padding)
- Desktop (>=640px): content `style={{ maxWidth: 520, width: "100%", alignSelf: "center" }}`
- FORBIDDEN: fixed px widths that break on any viewport

### Auth screens (email, otp, onboarding)
- Header: back button left + title center (if there's a screen to go back to)
- Content position: upper third (paddingTop: 12–15%), NOT vertical center
- Logo/brand mark above the form
- Single column

### Tab screens (homepage, map — main navigation)
- Header: Home header (logo + icons: search, notifications, profile)
- Content: full width, ScrollView or FlatList
- Footer: TabBar on mobile (<640px), hidden on desktop
- Desktop: content area expands, grid columns increase (2→3→4)

### Detail screens (listing-detail, chat, profile-detail, reviews, payment, contact, expired, edit)
- Header: Back header (chevron-left + title)
- Content: full width, ScrollView
- No TabBar

### Dashboard screens (profile, my-listings, favorites, messages-list, payment-history, sessions, settings)
- Header: title only (no back button — accessed via tab)
- Content: full width, ScrollView or FlatList
- TabBar visible on mobile

### Admin screens
- Header: Back header on mobile, sidebar on desktop
- Content: full width with table/list layouts
- No TabBar

### Legal screens (about, help, privacy, terms)
- Header: Back header + title
- Content: ScrollView with rich text
- No TabBar

### Definition of Done — EVERY screen, NO exceptions

| # | Criterion | How to verify |
|---|-----------|---------------|
| 1 | tsc --noEmit = 0 errors | Run from project root |
| 2 | Desktop screenshot (>640px) | maxWidth respected, layout per category above |
| 3 | Mobile screenshot (375px) | Nothing overflows, touch targets >= 44px |
| 4 | Header matches Layout spec | Back button if spec says so, title correct |
| 5 | ALL UI Elements from spec implemented | Cross-check against screen's UI Elements table |
| 6 | Interactive elements work | Input/delete/submit via comet |
| 7 | States implemented | Loading, Error, Empty where spec requires |
| 8 | Colors ONLY from theme.ts / tailwind.config.js | grep hex in file — all match palette |
| 9 | TextInput = inline style only | Zero className on any TextInput (NativeWind web bug) |
| 10 | Russian text, no typos | Read all visible strings on screenshot |
| 11 | UI components from components/ui/ | Button, Card, Input, Avatar, Badge, States — from ui/ library |
| 12 | No hardcoded colors | All colors imported from lib/theme.ts or tw mapping |

Agent CANNOT self-verify. Orchestrator checks via comet screenshots + UX test.

---

## Section 1: Design System

### Theme Tokens (lib/theme.ts + tailwind.config.js)

#### Colors
| Token | Hex | Tailwind class | Usage |
|-------|-----|----------------|-------|
| primary | #00AA6C | text-primary / bg-primary | Buttons, links, active states, Avito green |
| accent | #008F5D | text-accent / bg-accent | Hover states, dark green variant |
| background | #FFFFFF | bg-white | Page background |
| surface | #F3F4F6 | bg-bg-muted | Cards, inputs background |
| text | #0A2840 | text-text-primary | Primary text |
| textSecondary | #1A4A6E | text-text-secondary | Subtitles, labels |
| textMuted | #6A8898 | text-text-muted | Captions, hints, timestamps |
| error | #C0392B | text-error / bg-error | Validation errors, destructive |
| success | #2E7D30 | text-success / bg-success | Success states |
| warning | #f59e0b | text-warning / bg-warning | Warnings, pending |
| info | #3b82f6 | text-info | Informational |
| border | #C8E0E8 | border-border | Default borders |
| borderLight | #E2E8F0 | border-border-light | Subtle dividers |

#### Typography
| Token | Tailwind | Usage |
|-------|----------|-------|
| h1 | text-3xl font-extrabold | Page titles |
| h2 | text-2xl font-bold | Section titles |
| h3 | text-lg font-semibold | Card titles, labels |
| body | text-base | Body text |
| caption | text-sm text-text-secondary | Hints, timestamps |
| small | text-xs text-text-disabled | Fine print |

#### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Small gaps |
| md | 16px | Standard padding |
| lg | 24px | Section spacing |
| xl | 32px | Large spacing |

### Component Library (components/ui/)

| Component | Variants | Key Props |
|-----------|----------|-----------|
| `<Button>` | primary, secondary, destructive | label, onPress, loading, disabled, fullWidth, icon |
| `<Card>` | default, outlined | children, onPress, padding (sm/md/lg) |
| `<Input>` | — | label, placeholder, value, onChangeText, error, icon, multiline |
| `<Avatar>` | — | size (sm/md/lg), name, imageUrl |
| `<Badge>` | error, success, warning, info | label, size (sm/md) |
| `<EmptyState>` | — | icon, title, subtitle, actionLabel, onAction |
| `<ErrorState>` | — | message, onRetry |
| `<LoadingState>` | spinner, skeleton | lines (for skeleton) |

**RULE:** If a UI element matches a component — USE THE COMPONENT. FORBIDDEN: raw Tailwind for Button/Card/Input/Avatar/Badge/States.

---

## Section 2: Screens

---
**Screen: Homepage**
Status: DONE
Route: /
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Tab
Type: list

Description: Главная лента объявлений с категориями, поиском и картой.

Header: HeaderHome (логотип Avito Georgia слева, иконки поиск + уведомления справа)
Body: ScrollView — category chips + listing cards grid
Footer: TabBar (Главная | Поиск | + | Сообщения | Профиль)

Content:
  search_placeholder: "Поиск по объявлениям..."
  category_all: "Все"
  categories_section: "Категории"
  listings_section: "Свежие объявления"
  sort_options: ["Новые", "Дешевле", "Дороже"]
  card_template:
    title: "{listing.title}"
    price: "{listing.price} ₾"
    meta: "{listing.city.name} · {timeAgo(listing.createdAt)}"
    badge: если premium → <Badge variant="info" label="Premium" />
  empty_title: "Объявлений пока нет"
  empty_subtitle: "Станьте первым — разместите объявление"
  empty_cta: "Разместить"
  error_title: "Не удалось загрузить объявления"
  error_description: "Проверьте подключение и попробуйте снова"
  error_button: "Повторить"

UI Elements:
  - Горизонтальный скролл категорий (chips)
  - FlatList / grid (2 col mobile, 3 col desktop) listing cards с фото
  - <Button variant="primary" label="Разместить объявление" /> (для GUEST — приглашение)
  - <LoadingState variant="skeleton" lines={6} />
  - <EmptyState icon="tag" title="Объявлений пока нет" />

States:
  - Loading: skeleton grid
  - Error: <ErrorState message="Не удалось загрузить объявления" onRetry={refetch} />
  - Empty: <EmptyState />

Data:
  - GET /api/listings?page=1&limit=20&sort=new
  - GET /api/categories
  - GET /api/cities

Dependencies:
  - To: /listings/[id] (tap card), /listings/create (fab/button), /map (map tab), /auth/email (if guest taps "Разместить")

Acceptance Criteria:
  - [ ] Лента загружается, показывает карточки с фото
  - [ ] Фильтр по категории работает — лента обновляется
  - [ ] Тап на карточку → /listings/[id]
  - [ ] Desktop: 3 колонки

---
**Screen: AuthEmail**
Status: DONE
Route: /auth/email
Access: public (redirect if authed)
Roles: [GUEST]
Layout: Auth
Type: form

Description: Первый шаг входа — ввод email для получения OTP кода.

Header: none (первый экран)
Body: centered, upper third
Footer: none

Content:
  page_title: "Войти в Avito Georgia"
  page_subtitle: "Введите email — пришлём код подтверждения"
  field_label_email: "Email"
  field_placeholder_email: "name@example.com"
  field_error_invalid: "Введите корректный email"
  field_error_empty: "Email обязателен"
  button_primary: "Получить код"
  button_loading: "Отправляем..."
  footer_text: "Входя, вы соглашаетесь с"
  footer_link_terms: "Условиями использования"
  footer_link_privacy: "Политикой конфиденциальности"

UI Elements:
  - Логотип / иконка приложения вверху
  - <Input label="Email" placeholder="name@example.com" keyboardType="email-address" />
  - <Button variant="primary" label="Получить код" fullWidth loading={isLoading} />

States:
  - Loading: кнопка в состоянии loading, input disabled
  - Error: inline error под Input ("Введите корректный email")
  - Success: автопереход на /auth/otp

Data:
  - POST /api/auth/request-otp { email }

Dependencies:
  - To: /auth/otp (success)

Acceptance Criteria:
  - [ ] Email с ошибкой (test@) → inline error, кнопка не кликается
  - [ ] Валидный email → запрос к API → переход на /auth/otp
  - [ ] Loading state во время запроса

---
**Screen: AuthOtp**
Status: DONE
Route: /auth/otp
Access: public
Roles: [GUEST]
Layout: Auth
Type: form

Description: Ввод 6-значного OTP кода, полученного на email.

Header: Back header "Подтверждение"
Body: centered, upper third
Footer: none

Content:
  page_title: "Код подтверждения"
  page_subtitle: "Отправили код на {email}"
  field_label: "Код из письма"
  field_placeholder: "000000"
  field_error_invalid: "Неверный код"
  field_error_expired: "Код истёк. Запросите новый"
  button_primary: "Войти"
  button_resend: "Отправить снова"
  resend_countdown: "Повторная отправка через {N}с"
  dev_hint: "Dev: код всегда 000000"

UI Elements:
  - <Input label="Код" placeholder="000000" keyboardType="number-pad" maxLength={6} />
  - <Button variant="primary" label="Войти" fullWidth loading={isLoading} />
  - Ссылка "Отправить снова" (активна через 60с)

States:
  - Loading: кнопка loading
  - Error: inline "Неверный код"
  - Success: переход на / или /auth/onboarding (если новый user)

Data:
  - POST /api/auth/verify-otp { email, code }

Dependencies:
  - From: /auth/email
  - To: / (existing user) | /auth/onboarding (new user, !isOnboarded)

Acceptance Criteria:
  - [ ] Ввод 000000 → успешный вход
  - [ ] Неверный код → "Неверный код"
  - [ ] Новый пользователь → /auth/onboarding
  - [ ] Существующий → /

---
**Screen: AuthOnboarding**
Status: DONE
Route: /auth/onboarding
Access: auth required (isOnboarded=false)
Roles: [USER]
Layout: Auth
Type: form

Description: Заполнение профиля при первом входе — имя и город.

Header: none (нельзя пропустить)
Body: centered, upper third
Footer: none

Content:
  page_title: "Добро пожаловать!"
  page_subtitle: "Расскажите немного о себе"
  field_label_name: "Ваше имя"
  field_placeholder_name: "Имя"
  field_label_city: "Город"
  city_picker_placeholder: "Выберите город"
  cities: ["Тбилиси", "Батуми", "Кутаиси", "Рустави", "Гори", "Зугдиди"]
  button_primary: "Начать"
  field_error_name: "Введите имя"
  field_error_city: "Выберите город"

UI Elements:
  - <Input label="Имя" placeholder="Имя" />
  - City picker (select/dropdown или modal)
  - <Button variant="primary" label="Начать" fullWidth />

States:
  - Loading: кнопка loading
  - Error: inline errors под полями

Data:
  - PATCH /api/users/me { name, city }
  - GET /api/cities (для пикера)

Dependencies:
  - From: /auth/otp (новый user)
  - To: / (после сохранения)

Acceptance Criteria:
  - [ ] Пустое имя → ошибка "Введите имя"
  - [ ] Без города → ошибка "Выберите город"
  - [ ] Заполнено → PATCH → isOnboarded=true → /

---
**Screen: ListingDetail**
Status: DONE
Route: /listings/[id]
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Detail
Type: detail

Description: Страница объявления — фото, описание, продавец, контакт.

Header: Back header "Объявление"
Body: ScrollView
Footer: sticky кнопка "Написать продавцу" (если не свой)

Content:
  section_photos: карусель фото (свайп)
  section_price: "{price} ₾"
  section_premium_badge: "Premium" (если активный промоушн)
  section_title: "{listing.title}"
  section_meta: "{category.name} · {city.name} · {timeAgo(createdAt)}"
  section_description_label: "Описание"
  section_seller_label: "Продавец"
  seller_card: аватар + имя + рейтинг + "Смотреть профиль"
  button_contact: "Написать продавцу"
  button_call: "Показать номер" (если phone не null)
  button_favorite: иконка ♡ в хедере
  button_share: иконка в хедере
  button_edit: "Редактировать" (если owner)
  button_promote: "Продвинуть" (если owner, статус active)
  report_link: "Пожаловаться на объявление"
  views_count: "{views} просмотров"
  section_map_label: "На карте"
  error_title: "Объявление не найдено"
  error_description: "Оно могло быть удалено или перемещено"
  error_button: "На главную"

UI Elements:
  - Фото карусель (горизонтальный скролл)
  - <Badge variant="info" label="Premium" /> (conditional)
  - <Avatar size="md" name={seller.name} imageUrl={seller.avatarUrl} />
  - <Button variant="primary" label="Написать продавцу" fullWidth />
  - <Button variant="secondary" label="Показать номер" />
  - Иконка ♡ (Favorite) в хедере
  - Карта (статичная WebView или image)

States:
  - Loading: <LoadingState variant="skeleton" lines={5} />
  - Error: <ErrorState message="Не удалось загрузить объявление" onRetry={refetch} />
  - Not found: <EmptyState title="Объявление не найдено" />
  - Owner view: кнопки Редактировать + Продвинуть вместо Написать

Data:
  - GET /api/listings/:id
  - GET /api/favorites/check/:listingId (is favorited)
  - POST /api/favorites/:listingId (toggle)

Dependencies:
  - From: /, /map, /dashboard/favorites, /users/[id]
  - To: /listings/[id]/contact, /listings/[id]/edit, /users/[id], /payment

Acceptance Criteria:
  - [ ] Фото-карусель листается
  - [ ] "Написать продавцу" → /listings/[id]/contact
  - [ ] ♡ добавляет в избранное (только авториз.)
  - [ ] Кнопка Редактировать видна только owner

---
**Screen: ListingContact**
Status: DONE
Route: /listings/[id]/contact
Access: auth required
Roles: [USER, ADMIN]
Layout: Detail
Type: chat

Description: Отправка первого сообщения продавцу или переход в существующий чат.

Header: Back header "Написать продавцу"
Body: centered
Footer: sticky input

Content:
  page_title: "Написать продавцу"
  input_placeholder: "Ваше сообщение..."
  listing_preview: миниатюра объявления (фото + название + цена)
  button_send: "Отправить"
  button_loading: "Отправляем..."
  success_text: "Сообщение отправлено"

UI Elements:
  - Карточка-превью объявления
  - <Input multiline placeholder="Ваше сообщение..." />
  - <Button variant="primary" label="Отправить" fullWidth />

States:
  - Loading: кнопка loading
  - Success: переход в /dashboard/messages/[threadId]

Data:
  - POST /api/threads { listingId, text } → { threadId }

Dependencies:
  - From: /listings/[id]
  - To: /dashboard/messages/[id] (после отправки)

Acceptance Criteria:
  - [ ] Пустое сообщение → кнопка неактивна
  - [ ] Отправка → POST → переход в тред
  - [ ] Повторный вход → редирект на существующий тред

---
**Screen: ListingEdit**
Status: DONE
Route: /listings/[id]/edit
Access: auth required (owner or admin)
Roles: [USER, ADMIN]
Layout: Detail
Type: form

Description: Редактирование существующего объявления.

Header: Back header "Редактировать"
Body: ScrollView form
Footer: sticky кнопка "Сохранить"

Content:
  page_title: "Редактировать объявление"
  field_label_title: "Заголовок"
  field_placeholder_title: "Что продаёте?"
  field_label_price: "Цена (₾)"
  field_placeholder_price: "0"
  field_label_description: "Описание"
  field_placeholder_description: "Подробное описание товара..."
  field_label_category: "Категория"
  field_label_city: "Город"
  field_label_photos: "Фотографии"
  button_save: "Сохранить изменения"
  button_delete: "Удалить объявление"
  confirm_delete_title: "Удалить объявление?"
  confirm_delete_description: "Объявление будет удалено без возможности восстановления"
  confirm_delete_button: "Удалить"
  success_toast: "Объявление обновлено"

UI Elements:
  - <Input label="Заголовок" />
  - <Input label="Цена (₾)" keyboardType="numeric" />
  - <Input label="Описание" multiline />
  - Category picker
  - City picker
  - Фото grid с возможностью удаления + добавления
  - <Button variant="primary" label="Сохранить изменения" fullWidth />
  - <Button variant="destructive" label="Удалить объявление" />

States:
  - Loading (init): <LoadingState variant="skeleton" />
  - Saving: кнопка loading
  - Error: <ErrorState />

Data:
  - GET /api/listings/:id (init)
  - PATCH /api/listings/:id (save)
  - DELETE /api/listings/:id (delete)
  - POST /api/listings/:id/photos (upload)
  - DELETE /api/listings/:id/photos/:photoId

Dependencies:
  - From: /listings/[id] (owner)
  - To: /listings/[id] (after save), / (after delete)

Acceptance Criteria:
  - [ ] Форма заполнена текущими данными
  - [ ] Сохранить → PATCH → success toast → /listings/[id]
  - [ ] Удалить → confirm → DELETE → /
  - [ ] Только owner видит этот экран

---
**Screen: ListingExpired**
Status: DONE
Route: /listings/[id]/expired
Access: auth required (owner)
Roles: [USER]
Layout: Detail
Type: detail

Description: Экран истёкшего объявления с опцией продления.

Header: Back header "Объявление истекло"
Body: centered
Footer: none

Content:
  page_title: "Объявление истекло"
  page_subtitle: "Срок действия объявления закончился. Продлите его, чтобы покупатели снова его видели."
  button_renew: "Продлить бесплатно"
  button_promote: "Продвинуть и продлить"
  button_delete: "Удалить объявление"

UI Elements:
  - Иконка-иллюстрация (истекший таймер)
  - <Button variant="primary" label="Продлить бесплатно" fullWidth />
  - <Button variant="secondary" label="Продвинуть и продлить" fullWidth />
  - <Button variant="destructive" label="Удалить" />

States:
  - Loading: кнопка loading
  - Success: toast + redirect

Data:
  - POST /api/listings/:id/renew
  - DELETE /api/listings/:id

Dependencies:
  - From: /listings/[id] (expired listing)
  - To: /listings/[id] (after renew), /payment (if promote)

Acceptance Criteria:
  - [ ] "Продлить" → POST renew → listing статус active
  - [ ] "Продвинуть" → /payment

---
**Screen: CreateListing**
Status: DONE
Route: /listings/create
Access: auth required
Roles: [USER, ADMIN]
Layout: Detail
Type: form

Description: Форма создания нового объявления с фото, категорией, ценой и локацией.

Header: Back header "Новое объявление"
Body: ScrollView form
Footer: sticky кнопка "Опубликовать"

Content:
  page_title: "Новое объявление"
  section_photos: "Фотографии (до 10)"
  field_label_title: "Заголовок"
  field_placeholder_title: "Что продаёте?"
  field_label_category: "Категория"
  field_placeholder_category: "Выберите категорию"
  field_label_price: "Цена (₾)"
  field_placeholder_price: "Укажите цену"
  field_price_free: "Бесплатно"
  field_label_description: "Описание"
  field_placeholder_description: "Подробно опишите состояние и особенности товара"
  field_label_city: "Город"
  field_label_district: "Район (опционально)"
  field_label_address: "Адрес (опционально)"
  button_submit: "Опубликовать"
  button_draft: "Сохранить черновик"
  success_toast: "Объявление опубликовано"
  error_title_required: "Заполните заголовок"
  error_category_required: "Выберите категорию"
  error_city_required: "Выберите город"

UI Elements:
  - Фото picker (grid, до 10 фото, upload via MinIO)
  - <Input label="Заголовок" placeholder="Что продаёте?" />
  - Category picker (modal / select)
  - <Input label="Цена (₾)" keyboardType="numeric" />
  - Toggle "Бесплатно"
  - <Input label="Описание" multiline rows={4} />
  - City picker
  - District picker (depends on city)
  - <Button variant="primary" label="Опубликовать" fullWidth />
  - <Button variant="secondary" label="Сохранить черновик" />

States:
  - Loading (submit): кнопка loading
  - Error: inline validation
  - Success: toast + navigate /listings/[newId]

Data:
  - POST /api/listings { title, price, description, categoryId, cityId, districtId }
  - POST /api/listings/:id/photos (multipart, MinIO)
  - GET /api/categories
  - GET /api/cities

Dependencies:
  - From: / (fab), /dashboard/listings (кнопка)
  - To: /listings/[id] (after publish), / (after draft)

Acceptance Criteria:
  - [ ] Без заголовка → ошибка валидации
  - [ ] Фото загружается в MinIO, URL сохраняется
  - [ ] Опубликовать → POST → /listings/[id]
  - [ ] Черновик → status=draft → /dashboard/listings

---
**Screen: MapView**
Status: DONE
Route: /map
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Tab
Type: list

Description: Карта с пинами объявлений по геолокации.

Header: HeaderHome
Body: full-screen map
Footer: TabBar

Content:
  search_placeholder: "Поиск на карте..."
  filter_label: "Фильтр"
  pin_callout_price: "{price} ₾"
  pin_callout_title: "{listing.title}"
  button_view: "Смотреть"
  empty_area: "В этом районе нет объявлений"

UI Elements:
  - MapView (react-native-maps или web-maps)
  - Пины с ценой
  - Callout при тапе на пин
  - Поисковая строка поверх карты
  - <Button variant="secondary" label="Фильтр" />

States:
  - Loading: spinner на карте
  - Empty area: toast снизу

Data:
  - GET /api/listings?lat=&lng=&radius=&limit=100

Dependencies:
  - From: / (tab)
  - To: /listings/[id] (tap callout)

Acceptance Criteria:
  - [ ] Карта рендерится
  - [ ] Пины показывают объявления
  - [ ] Тап пина → callout → кнопка "Смотреть" → /listings/[id]

---
**Screen: DashboardProfile**
Status: DONE
Route: /dashboard/profile
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: detail

Description: Личный профиль — аватар, имя, рейтинг, статистика, навигация к настройкам.

Header: "Профиль"
Body: ScrollView
Footer: TabBar

Content:
  section_stats_listings: "Объявления"
  section_stats_reviews: "Отзывы"
  section_stats_rating: "Рейтинг"
  menu_my_listings: "Мои объявления"
  menu_favorites: "Избранное"
  menu_payment_history: "История платежей"
  menu_sessions: "Активные сессии"
  menu_settings: "Настройки"
  menu_help: "Помощь"
  menu_about: "О приложении"
  button_logout: "Выйти из аккаунта"
  premium_badge: "Premium"
  admin_badge: "Администратор"

UI Elements:
  - <Avatar size="lg" name={user.name} imageUrl={user.avatarUrl} />
  - Имя + email
  - Stats row (объявления / отзывы / рейтинг)
  - Menu list с иконками
  - <Button variant="destructive" label="Выйти из аккаунта" />

States:
  - Loading: <LoadingState variant="skeleton" lines={4} />
  - Error: <ErrorState />

Data:
  - GET /api/users/me
  - GET /api/users/me/stats (listings count, rating)

Dependencies:
  - From: TabBar
  - To: /dashboard/listings, /dashboard/favorites, /dashboard/payment-history, /dashboard/sessions, /dashboard/settings, /legal/help, /legal/about

Acceptance Criteria:
  - [ ] Профиль загружается с именем и аватаром
  - [ ] Статистика реальная из API
  - [ ] Выйти → /auth/email

---
**Screen: MyListings**
Status: DONE
Route: /dashboard/listings
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: list

Description: Мои объявления — фильтры по статусу, управление каждым.

Header: "Мои объявления"
Body: FlatList
Footer: TabBar

Content:
  tab_all: "Все"
  tab_active: "Активные"
  tab_draft: "Черновики"
  tab_sold: "Проданные"
  tab_expired: "Истекшие"
  button_create: "Разместить объявление"
  card_views: "{views} просмотров"
  card_status_active: "Активно"
  card_status_draft: "Черновик"
  card_status_sold: "Продано"
  card_status_expired: "Истекло"
  card_status_pending: "На модерации"
  card_promote: "Продвинуть"
  card_edit: "Редактировать"
  card_mark_sold: "Отметить проданным"
  empty_title: "У вас нет объявлений"
  empty_subtitle: "Разместите первое объявление бесплатно"
  empty_cta: "Разместить"
  error_title: "Не удалось загрузить объявления"
  error_button: "Повторить"

UI Elements:
  - Табы-фильтры (Все / Активные / Черновики / Проданные / Истекшие)
  - Listing card (горизонтальная): фото + название + статус + просмотры + действия
  - <Badge> по статусу
  - <Button variant="primary" label="Разместить объявление" />
  - <EmptyState />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState icon="tag" title="У вас нет объявлений" actionLabel="Разместить" />

Data:
  - GET /api/listings?userId=me&status=&page=&limit=
  - PATCH /api/listings/:id { status: "sold" }

Dependencies:
  - From: /dashboard/profile, TabBar (создать)
  - To: /listings/[id]/edit, /listings/[id]/expired, /payment (promote)

Acceptance Criteria:
  - [ ] Список загружается, разные статусы видны
  - [ ] Фильтр по табам работает
  - [ ] "Редактировать" → /listings/[id]/edit
  - [ ] "Отметить проданным" → статус sold

---
**Screen: Favorites**
Status: DONE
Route: /dashboard/favorites
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: list

Description: Избранные объявления пользователя.

Header: "Избранное"
Body: FlatList / grid
Footer: TabBar

Content:
  empty_title: "Нет избранных объявлений"
  empty_subtitle: "Тапните ♡ на объявлении, чтобы добавить в избранное"
  empty_cta: "Смотреть объявления"
  error_title: "Не удалось загрузить избранное"
  error_button: "Повторить"
  card_sold_badge: "Продано"
  card_removed_badge: "Снято"

UI Elements:
  - Grid (2 col mobile, 3 col desktop) listing cards
  - <Badge variant="error" label="Продано" /> для sold/removed
  - <EmptyState icon="heart" title="Нет избранных" actionLabel="Смотреть объявления" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/favorites?page=&limit=
  - DELETE /api/favorites/:listingId

Dependencies:
  - From: /dashboard/profile
  - To: /listings/[id]

Acceptance Criteria:
  - [ ] Избранные загружаются
  - [ ] Тап на карточку → /listings/[id]
  - [ ] Удалить из избранного работает

---
**Screen: MessagesList**
Status: DONE
Route: /dashboard/messages
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: list

Description: Список всех чат-тредов с контрагентами.

Header: "Сообщения"
Body: FlatList
Footer: TabBar

Content:
  thread_last_message: "{message.text}"
  thread_time: "{timeAgo(message.createdAt)}"
  thread_listing_title: "{listing.title}"
  unread_badge_label: "{unread}"
  empty_title: "Нет сообщений"
  empty_subtitle: "Напишите продавцу через объявление"
  empty_cta: "Смотреть объявления"
  error_title: "Не удалось загрузить сообщения"
  error_button: "Повторить"

UI Elements:
  - FlatList тредов: аватар + имя + последнее сообщение + время + unread badge
  - <Avatar size="sm" />
  - <Badge variant="error" label="{N}" /> (unread count)
  - <EmptyState icon="message-circle" />

States:
  - Loading: skeleton rows
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/threads?page=&limit=

Dependencies:
  - From: TabBar (Сообщения)
  - To: /dashboard/messages/[id]

Acceptance Criteria:
  - [ ] Треды загружаются с последним сообщением
  - [ ] Непрочитанные помечены badge
  - [ ] Тап → /dashboard/messages/[id]

---
**Screen: ChatThread**
Status: DONE
Route: /dashboard/messages/[id]
Access: auth required (thread participant)
Roles: [USER, ADMIN]
Layout: Detail
Type: chat

Description: Диалог с одним пользователем по объявлению.

Header: Back header + имя собеседника + мини превью объявления
Body: FlatList сообщений (снизу вверх)
Footer: sticky input

Content:
  input_placeholder: "Сообщение..."
  button_send: иконка → (send)
  my_message_bg: colors.primary
  other_message_bg: colors.surface
  time_format: HH:mm
  listing_preview: "{listing.title} · {price} ₾"
  error_title: "Не удалось загрузить чат"
  empty_title: "Начните разговор"

UI Elements:
  - FlatList сообщений (bubble-chat)
  - <Input placeholder="Сообщение..." /> + иконка send
  - Мини-карточка объявления вверху (если есть listingId)
  - Timestamp под каждым сообщением

States:
  - Loading: skeleton bubbles
  - Error: <ErrorState />
  - Empty: <EmptyState title="Начните разговор" />

Data:
  - GET /api/threads/:id/messages?before=&limit=50
  - POST /api/threads/:id/messages { text }
  - WebSocket: ws://…/socket.io (real-time)

Dependencies:
  - From: /dashboard/messages, /listings/[id]/contact
  - To: /listings/[id] (tap listing preview)

Acceptance Criteria:
  - [ ] Сообщения загружаются
  - [ ] Отправить сообщение → появляется в ленте
  - [ ] Real-time через WebSocket (второй вкладкой)

---
**Screen: PaymentHistory**
Status: DONE
Route: /dashboard/payment-history
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: list

Description: История платежей за продвижение и подписки.

Header: "История платежей"
Body: FlatList
Footer: TabBar

Content:
  columns: ["Дата", "Тип", "Сумма", "Статус"]
  promotion_types:
    top_1d: "Поднять на день"
    top_3d: "Поднять на 3 дня"
    top_7d: "Поднять на неделю"
    highlight: "Выделить"
    unlimited_sub: "Безлимит подписка"
    bundle: "Пакет"
  status_completed: "Оплачено"
  status_pending: "Обрабатывается"
  status_failed: "Ошибка"
  status_refunded: "Возврат"
  empty_title: "Нет платежей"
  empty_subtitle: "Платежи появятся после первого продвижения"
  error_title: "Не удалось загрузить историю"
  error_button: "Повторить"

UI Elements:
  - FlatList строк: дата + тип + сумма + <Badge> статуса
  - <Badge variant="success" label="Оплачено" />
  - <Badge variant="error" label="Ошибка" />
  - <Badge variant="warning" label="Обрабатывается" />
  - <EmptyState icon="credit-card" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/payments?page=&limit=

Dependencies:
  - From: /dashboard/profile
  - To: — (detail view опционально)

Acceptance Criteria:
  - [ ] Список загружается
  - [ ] Каждая строка показывает дату, тип, сумму, статус
  - [ ] Empty state если нет платежей

---
**Screen: Sessions**
Status: DONE
Route: /dashboard/sessions
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: list

Description: Управление активными сессиями — просмотр и завершение.

Header: "Активные сессии"
Body: FlatList
Footer: TabBar

Content:
  session_current: "Текущая сессия"
  session_device: "Устройство"
  session_created: "Создана {date}"
  session_expires: "Истекает {date}"
  button_revoke: "Завершить"
  button_revoke_all: "Завершить все остальные"
  confirm_title: "Завершить сессию?"
  confirm_button: "Завершить"
  empty_title: "Нет активных сессий"
  error_title: "Не удалось загрузить сессии"

UI Elements:
  - FlatList сессий: иконка устройства + дата + кнопка Завершить
  - <Badge variant="success" label="Текущая" /> для активной
  - <Button variant="destructive" label="Завершить" />
  - <Button variant="secondary" label="Завершить все остальные" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState title="Нет активных сессий" />

Data:
  - GET /api/auth/sessions
  - DELETE /api/auth/sessions/:id
  - DELETE /api/auth/sessions (all except current)

Dependencies:
  - From: /dashboard/profile

Acceptance Criteria:
  - [ ] Список сессий загружается
  - [ ] Текущая помечена
  - [ ] "Завершить" → confirm → DELETE → сессия исчезает

---
**Screen: Settings**
Status: DONE
Route: /dashboard/settings
Access: auth required
Roles: [USER, ADMIN]
Layout: Dashboard
Type: settings

Description: Настройки профиля — имя, фото, телефон, язык, уведомления.

Header: "Настройки"
Body: ScrollView
Footer: TabBar

Content:
  section_profile: "Профиль"
  field_label_name: "Имя"
  field_label_phone: "Телефон"
  field_label_avatar: "Фото профиля"
  section_notifications: "Уведомления"
  notif_new_message: "Новые сообщения"
  notif_price_drop: "Снижение цены в избранных"
  notif_moderation: "Обновления модерации"
  section_language: "Язык"
  languages: ["Русский", "English", "ქართული"]
  section_danger: "Опасная зона"
  button_save: "Сохранить"
  button_delete_account: "Удалить аккаунт"
  confirm_delete_title: "Удалить аккаунт?"
  confirm_delete_description: "Все данные, объявления и история будут удалены безвозвратно"
  confirm_delete_button: "Удалить аккаунт"
  success_toast: "Настройки сохранены"

UI Elements:
  - Avatar picker (тап → image picker)
  - <Input label="Имя" />
  - <Input label="Телефон" keyboardType="phone-pad" />
  - Toggles для уведомлений (Switch)
  - Language picker
  - <Button variant="primary" label="Сохранить" fullWidth />
  - <Button variant="destructive" label="Удалить аккаунт" />

States:
  - Loading (init): skeleton
  - Saving: кнопка loading
  - Error: inline

Data:
  - GET /api/users/me (init)
  - PATCH /api/users/me { name, phone, avatarUrl, locale }
  - PATCH /api/notifications/preferences { type, enabled }
  - DELETE /api/users/me (delete account)

Dependencies:
  - From: /dashboard/profile
  - To: /auth/email (after delete)

Acceptance Criteria:
  - [ ] Форма заполнена текущими данными
  - [ ] Сохранить → PATCH → success toast
  - [ ] Удалить → confirm → DELETE → /auth/email

---
**Screen: Payment**
Status: DONE
Route: /payment
Access: auth required
Roles: [USER, ADMIN]
Layout: Detail
Type: form

Description: Выбор тарифа продвижения и оплата через Stripe.

Header: Back header "Продвижение"
Body: ScrollView
Footer: sticky "Оплатить"

Content:
  page_title: "Продвинуть объявление"
  plan_top_1d_label: "Поднять на день"
  plan_top_1d_price: "4.99 ₾"
  plan_top_1d_desc: "Объявление будет вверху 24 часа"
  plan_top_3d_label: "Поднять на 3 дня"
  plan_top_3d_price: "9.99 ₾"
  plan_top_3d_desc: "3 дня на первых позициях"
  plan_top_7d_label: "Поднять на неделю"
  plan_top_7d_price: "19.99 ₾"
  plan_top_7d_desc: "Максимальная видимость на 7 дней"
  plan_highlight_label: "Выделить объявление"
  plan_highlight_price: "2.99 ₾"
  plan_highlight_desc: "Цветная рамка и метка Premium"
  plan_unlimited_label: "Безлимит подписка"
  plan_unlimited_price: "29.99 ₾/мес"
  plan_unlimited_desc: "Неограниченные объявления + Premium статус"
  button_pay: "Оплатить {price} ₾"
  payment_secure: "Оплата защищена Stripe"
  success_title: "Оплата прошла!"
  success_subtitle: "Объявление продвинуто"
  error_title: "Ошибка оплаты"
  error_subtitle: "Попробуйте снова или выберите другой способ"

UI Elements:
  - Карточки тарифов (radio selection)
  - <Button variant="primary" label="Оплатить 4.99 ₾" fullWidth />
  - Иконка Stripe + "Оплата защищена"

States:
  - Loading: skeleton
  - Processing: кнопка loading "Обрабатываем..."
  - Success: success screen
  - Error: <ErrorState />

Data:
  - POST /api/payments/create-checkout { promotionType, listingId }
  - GET /api/payments/success?session_id= (Stripe redirect)

Dependencies:
  - From: /listings/[id] (promote), /dashboard/listings (promote)
  - To: /listings/[id] (after success)

Acceptance Criteria:
  - [ ] Тарифы отображаются с ценами
  - [ ] Выбор тарифа → выделен
  - [ ] Оплатить → Stripe Checkout
  - [ ] После оплаты → success screen

---
**Screen: PublicProfile**
Status: DONE
Route: /users/[id]
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Detail
Type: detail

Description: Публичный профиль продавца — объявления и отзывы.

Header: Back header "Продавец"
Body: ScrollView
Footer: none

Content:
  section_listings: "Объявления продавца"
  section_reviews: "Отзывы"
  member_since: "На сайте с {date}"
  rating_label: "{rating} / 5"
  reviews_count: "{N} отзывов"
  empty_listings: "Нет активных объявлений"
  empty_reviews: "Пока нет отзывов"
  button_report: "Пожаловаться"
  error_title: "Профиль не найден"

UI Elements:
  - <Avatar size="lg" />
  - Имя + рейтинг + дата регистрации
  - Grid объявлений (2 col)
  - Список последних отзывов (3 шт + "Все отзывы")
  - <Button variant="secondary" label="Пожаловаться" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Not found: <EmptyState title="Профиль не найден" />

Data:
  - GET /api/users/:id (profile)
  - GET /api/listings?userId=:id&status=active
  - GET /api/reviews?sellerId=:id&limit=3

Dependencies:
  - From: /listings/[id] (seller card)
  - To: /listings/[id], /users/[id]/reviews

Acceptance Criteria:
  - [ ] Профиль загружается
  - [ ] Объявления продавца видны
  - [ ] "Все отзывы" → /users/[id]/reviews

---
**Screen: UserReviews**
Status: DONE
Route: /users/[id]/reviews
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Detail
Type: list

Description: Все отзывы о продавце с рейтингами.

Header: Back header "Отзывы"
Body: FlatList
Footer: none

Content:
  rating_average: "{avg} / 5"
  review_card: автор + рейтинг ★ + текст + дата + объявление
  empty_title: "Нет отзывов"
  empty_subtitle: "Отзывы появляются после продажи"
  error_title: "Не удалось загрузить отзывы"

UI Elements:
  - Rating summary вверху (большая цифра + звёзды + кол-во)
  - FlatList review cards: <Avatar size="sm" /> + имя + ★★★★★ + текст
  - <EmptyState icon="star" title="Нет отзывов" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/reviews?sellerId=:id&page=&limit=

Dependencies:
  - From: /users/[id]
  - To: /listings/[id] (из отзыва)

Acceptance Criteria:
  - [ ] Отзывы загружаются с рейтингом
  - [ ] Summary с средним рейтингом

---
**Screen: AdminDashboard**
Status: DONE
Route: /admin
Access: auth required
Roles: [ADMIN]
Layout: Admin
Type: detail

Description: Панель администратора — ключевые метрики и навигация.

Header: "Панель администратора"
Body: ScrollView
Footer: none

Content:
  card_total_users: "Пользователи"
  card_total_listings: "Объявления"
  card_active_listings: "Активные"
  card_pending_moderation: "На модерации"
  card_revenue: "Выручка (GEL)"
  menu_moderation: "Модерация объявлений"
  menu_users: "Управление пользователями"
  menu_categories: "Категории"
  menu_finance: "Финансы"
  error_title: "Не удалось загрузить данные"

UI Elements:
  - Stats cards (4 метрики)
  - Menu list навигации
  - <Card> для каждой метрики

States:
  - Loading: skeleton
  - Error: <ErrorState />

Data:
  - GET /api/admin/stats

Dependencies:
  - From: /dashboard/profile (admin only link)
  - To: /admin/moderation, /admin/users, /admin/categories, /admin/finance

Acceptance Criteria:
  - [ ] Метрики загружаются
  - [ ] Навигация работает
  - [ ] Доступен только ADMIN

---
**Screen: AdminModeration**
Status: DONE
Route: /admin/moderation
Access: auth required
Roles: [ADMIN]
Layout: Admin
Type: list

Description: Очередь объявлений на модерацию — одобрить или отклонить.

Header: Back header "Модерация"
Body: FlatList
Footer: none

Content:
  tab_pending: "На проверке"
  tab_rejected: "Отклонённые"
  tab_reports: "Жалобы"
  button_approve: "Одобрить"
  button_reject: "Отклонить"
  reject_reason_label: "Причина отклонения"
  reject_reason_placeholder: "Объясните причину..."
  empty_pending: "Нет объявлений на модерации"
  empty_pending_subtitle: "Отлично! Все объявления проверены"
  error_title: "Не удалось загрузить очередь"

UI Elements:
  - Табы (На проверке / Отклонённые / Жалобы)
  - Listing card с фото + заголовок + категория + дата
  - <Button variant="primary" label="Одобрить" />
  - <Button variant="destructive" label="Отклонить" />
  - Modal с полем причины при отклонении

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState title="Нет объявлений на модерации" />

Data:
  - GET /api/admin/listings?status=pending_moderation
  - PATCH /api/admin/listings/:id/approve
  - PATCH /api/admin/listings/:id/reject { reason }
  - GET /api/reports (reports tab)

Dependencies:
  - From: /admin
  - To: /listings/[id] (preview)

Acceptance Criteria:
  - [ ] Очередь загружается
  - [ ] Одобрить → статус active → исчезает из очереди
  - [ ] Отклонить → modal с причиной → статус rejected

---
**Screen: AdminUsers**
Status: DONE
Route: /admin/users
Access: auth required
Roles: [ADMIN]
Layout: Admin
Type: list

Description: Управление пользователями — поиск, бан, смена роли.

Header: Back header "Пользователи"
Body: FlatList + поиск
Footer: none

Content:
  search_placeholder: "Поиск по email или имени..."
  column_name: "Имя"
  column_email: "Email"
  column_role: "Роль"
  column_created: "Зарегистрирован"
  button_ban: "Заблокировать"
  button_unban: "Разблокировать"
  button_make_admin: "Сделать администратором"
  button_remove_admin: "Убрать права"
  confirm_ban_title: "Заблокировать пользователя?"
  confirm_ban_button: "Заблокировать"
  empty_title: "Пользователи не найдены"
  error_title: "Не удалось загрузить пользователей"

UI Elements:
  - <Input placeholder="Поиск..." /> вверху
  - FlatList: <Avatar size="sm" /> + email + имя + роль + действия
  - <Badge variant="error" label="Заблокирован" />
  - <Badge variant="info" label="Admin" />
  - Action dropdown или кнопки

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState title="Пользователи не найдены" />

Data:
  - GET /api/admin/users?search=&page=&limit=
  - PATCH /api/admin/users/:id/role { role }
  - PATCH /api/admin/users/:id/ban | /unban

Dependencies:
  - From: /admin
  - To: /users/[id]

Acceptance Criteria:
  - [ ] Список загружается
  - [ ] Поиск фильтрует
  - [ ] Смена роли работает
  - [ ] Бан работает

---
**Screen: AdminCategories**
Status: DONE
Route: /admin/categories
Access: auth required
Roles: [ADMIN]
Layout: Admin
Type: list

Description: Управление категориями объявлений — добавление, редактирование.

Header: Back header "Категории"
Body: FlatList
Footer: none

Content:
  button_add: "Добавить категорию"
  field_name_ru: "Название (RU)"
  field_name_ka: "Название (KA)"
  field_name_en: "Название (EN)"
  field_quota: "Лимит бесплатных объявлений"
  field_paid_price: "Цена платного объявления (₾)"
  button_save: "Сохранить"
  button_delete: "Удалить"
  confirm_delete_title: "Удалить категорию?"
  confirm_delete_description: "Все объявления в этой категории станут некатегоризированными"
  empty_title: "Нет категорий"
  error_title: "Не удалось загрузить категории"

UI Elements:
  - FlatList категорий с indent для subcategories
  - Modal / inline форма редактирования
  - <Button variant="primary" label="Добавить категорию" />
  - <Button variant="destructive" label="Удалить" />

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/categories (tree)
  - POST /api/admin/categories
  - PATCH /api/admin/categories/:id
  - DELETE /api/admin/categories/:id

Dependencies:
  - From: /admin

Acceptance Criteria:
  - [ ] Дерево категорий загружается
  - [ ] Добавить / редактировать / удалить работает

---
**Screen: AdminFinance**
Status: DONE
Route: /admin/finance
Access: auth required
Roles: [ADMIN]
Layout: Admin
Type: list

Description: Финансовая статистика и история всех платежей.

Header: Back header "Финансы"
Body: ScrollView
Footer: none

Content:
  section_summary: "Сводка"
  card_total_revenue: "Общая выручка"
  card_month_revenue: "За этот месяц"
  card_total_payments: "Всего платежей"
  section_payments: "История платежей"
  filter_status: "Статус"
  filter_type: "Тип"
  empty_title: "Нет платежей"
  error_title: "Не удалось загрузить данные"

UI Elements:
  - Stats summary row
  - FlatList платежей: email пользователя + тип + сумма + статус + дата
  - <Badge> по статусу платежа
  - Фильтры по статусу/типу

States:
  - Loading: skeleton
  - Error: <ErrorState />
  - Empty: <EmptyState />

Data:
  - GET /api/admin/payments?page=&limit=&status=&type=
  - GET /api/admin/stats/revenue

Dependencies:
  - From: /admin

Acceptance Criteria:
  - [ ] Сводка с суммами загружается
  - [ ] Список платежей с фильтрами

---
**Screen: LegalAbout**
Status: DONE
Route: /legal/about
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Detail
Type: showcase

Description: О приложении — миссия, команда, контакты.

Header: Back header "О приложении"
Body: ScrollView
Footer: none

Content:
  page_title: "Avito Georgia"
  tagline: "Доска объявлений для Грузии"
  section_mission: "Наша миссия"
  mission_text: "Мы создаём удобную платформу для покупки и продажи товаров в Грузии. Безопасно, быстро, на трёх языках."
  section_contacts: "Контакты"
  contact_email: "support@avito-georgia.ge"
  section_version: "Версия"
  version_number: "1.0.0"

UI Elements:
  - Логотип
  - Текстовые блоки
  - Ссылка на email

States:
  - Static content

Dependencies:
  - From: /dashboard/profile → "О приложении"

Acceptance Criteria:
  - [ ] Страница загружается
  - [ ] Контентные блоки видны

---
**Screen: LegalHelp**
Status: DONE
Route: /legal/help
Access: public
Roles: [GUEST, USER, ADMIN]
Layout: Detail
Type: showcase

Description: Часто задаваемые вопросы и справка.

Header: Back header "Помощь"
Body: ScrollView accordion FAQ
Footer: none

Content:
  search_placeholder: "Поиск по вопросам..."
  section_faq: "Частые вопросы"
  faq_items:
    - q: "Как разместить объявление?"
      a: "Нажмите + в нижнем меню, заполните форму и нажмите Опубликовать."
    - q: "Как продвинуть объявление?"
      a: "Откройте объявление и нажмите Продвинуть. Выберите тариф и оплатите."
    - q: "Как связаться с продавцом?"
      a: "Откройте объявление и нажмите Написать продавцу."
    - q: "Как удалить объявление?"
      a: "Перейдите в Мои объявления, откройте объявление и нажмите Редактировать → Удалить."
    - q: "Безопасна ли оплата?"
      a: "Да, все платежи обрабатываются через Stripe — международный платёжный сервис."
  contact_support: "Написать в поддержку"
  contact_email: "support@avito-georgia.ge"

UI Elements:
  - <Input placeholder="Поиск по вопросам..." /> (опционально)
  - Accordion FAQ items
  - Email ссылка

States:
  - Static content

Dependencies:
  - From: /dashboard/profile

Acceptance Criteria:
  - [ ] FAQ аккордеон раскрывается/закрывается
  - [ ] Все вопросы видны

---
**Screen: LegalPrivacy**
Status: DONE
Route: /legal/privacy
Access: public
Layout: Detail
Type: showcase

Description: Политика конфиденциальности.

Header: Back header "Конфиденциальность"
Body: ScrollView rich text
Content: Полный текст политики конфиденциальности на русском языке.

Dependencies:
  - From: /auth/email (ссылка)

---
**Screen: LegalTerms**
Status: DONE
Route: /legal/terms
Access: public
Layout: Detail
Type: showcase

Description: Условия использования.

Header: Back header "Условия использования"
Body: ScrollView rich text
Content: Полный текст условий использования на русском языке.

Dependencies:
  - From: /auth/email (ссылка)

---

## Section 3: Navigation Map

```
Auth Flow:
  /auth/email → /auth/otp → / (existing user)
                          → /auth/onboarding → / (new user)

TabBar (mobile):
  / | /map | /listings/create | /dashboard/messages | /dashboard/profile

Main flows:
  / → /listings/[id] → /listings/[id]/contact → /dashboard/messages/[id]
                     → /listings/[id]/edit
                     → /listings/[id]/expired → /payment
                     → /users/[id] → /users/[id]/reviews
                     → /payment (promote)

Dashboard:
  /dashboard/profile → /dashboard/listings → /listings/[id]/edit
                     → /dashboard/favorites → /listings/[id]
                     → /dashboard/messages → /dashboard/messages/[id]
                     → /dashboard/payment-history
                     → /dashboard/sessions
                     → /dashboard/settings
                     → /legal/about
                     → /legal/help

Admin:
  /admin → /admin/moderation
         → /admin/users → /users/[id]
         → /admin/categories
         → /admin/finance

Legal:
  /legal/about | /legal/help | /legal/privacy | /legal/terms
```

---

## Section 4: Access Matrix

| Screen | GUEST | USER | ADMIN |
|--------|-------|------|-------|
| / (Homepage) | yes | yes | yes |
| /map | yes | yes | yes |
| /listings/[id] | yes | yes | yes |
| /users/[id] | yes | yes | yes |
| /users/[id]/reviews | yes | yes | yes |
| /legal/* | yes | yes | yes |
| /auth/email | yes | redirect→/ | redirect→/ |
| /auth/otp | yes | redirect→/ | redirect→/ |
| /auth/onboarding | no | yes (if !onboarded) | no |
| /listings/create | redirect→/auth/email | yes | yes |
| /listings/[id]/contact | redirect→/auth/email | yes | yes |
| /listings/[id]/edit | no | owner only | yes |
| /listings/[id]/expired | no | owner only | yes |
| /payment | no | yes | yes |
| /dashboard/* | no | yes | yes |
| /admin | no | no | yes |
| /admin/* | no | no | yes |

---

## Section 5: DB Schema

### Table: users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| email | varchar(255) | unique, not null | Login identifier |
| name | varchar(100) | nullable | Display name |
| phone | varchar(20) | nullable | Phone number |
| avatarUrl | text | nullable | Profile photo (MinIO URL) |
| role | varchar(20) | default 'user' | 'user' / 'admin' |
| locale | varchar(5) | default 'ru' | 'ru' / 'en' / 'ka' |
| city | varchar(100) | nullable | Selected city |
| isOnboarded | boolean | default false | Onboarding complete? |
| deletedAt | timestamptz | nullable | Soft delete |
| createdAt | timestamptz | default now() | |
| updatedAt | timestamptz | updatedAt | |

### Table: otp_codes
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| email | varchar(255) | not null, index | |
| code | varchar(6) | not null, index | 6-digit code |
| expiresAt | timestamptz | not null | |
| used | boolean | default false | |
| attempts | int | default 0 | Brute-force guard |
| userId | varchar | FK → users.id, nullable | |
| createdAt | timestamptz | default now() | |

### Table: sessions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id, index | |
| refreshToken | varchar | unique | JWT refresh token |
| expiresAt | timestamptz | not null | 30 days sliding |
| createdAt | timestamptz | default now() | |

### Table: categories
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| name | varchar(100) | not null | Default display name |
| nameRu | varchar(100) | not null | Russian |
| nameKa | varchar(100) | not null | Georgian |
| nameEn | varchar(100) | not null | English |
| slug | varchar(100) | unique | URL-safe identifier |
| customFields | jsonb | nullable | Dynamic fields schema |
| freeListingQuota | int | default 10 | Free listings per user |
| paidListingPrice | float | default 0.0 | Price in GEL |
| parentId | varchar | FK → categories.id, nullable | Subcategory parent |

### Table: cities
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| name | varchar(100) | not null | |
| nameRu | varchar(100) | not null | |
| nameEn | varchar(100) | not null | |
| nameKa | varchar(100) | not null | |
| lat | float | nullable | Coordinates |
| lng | float | nullable | |

### Table: districts
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| name | varchar(100) | not null | |
| cityId | varchar | FK → cities.id | |

### Table: listings
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id, index | Seller |
| categoryId | varchar | FK → categories.id, index | |
| cityId | varchar | FK → cities.id, index | |
| districtId | varchar | FK → districts.id, nullable | |
| title | varchar(200) | not null | |
| description | text | nullable | |
| price | float | nullable | In GEL |
| currency | varchar(5) | default 'GEL' | |
| status | enum | not null | draft/pending_moderation/active/sold/removed/rejected/expired |
| views | int | default 0 | |
| lat | float | nullable | For map |
| lng | float | nullable | |
| address | varchar(255) | nullable | |
| activatedAt | timestamptz | nullable | |
| expiresAt | timestamptz | nullable, index | |
| lastRenewedAt | timestamptz | nullable | |
| rejectionReason | text | nullable | |
| createdAt | timestamptz | default now() | |
| updatedAt | timestamptz | updatedAt | |

### Table: listing_photos
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| listingId | varchar | FK → listings.id (cascade) | |
| url | text | not null | MinIO URL |
| key | varchar | nullable | MinIO object key |
| order | int | default 0 | Display order |

### Table: threads
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| listingId | varchar | FK → listings.id, nullable | |
| participant1Id | varchar | nullable | For direct threads (sorted) |
| participant2Id | varchar | nullable | |
| createdAt | timestamptz | default now() | |
| updatedAt | timestamptz | updatedAt | |

Unique: (participant1Id, participant2Id)

### Table: thread_participants
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| threadId | varchar | FK → threads.id | |
| userId | varchar | FK → users.id | |
| lastSeenAt | timestamptz | nullable | For unread count |

Unique: (threadId, userId)

### Table: messages
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| threadId | varchar | FK → threads.id, index | |
| senderId | varchar | FK → users.id | |
| text | text | not null | |
| createdAt | timestamptz | default now() | |

### Table: favorites
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id | |
| listingId | varchar | FK → listings.id | |
| createdAt | timestamptz | default now() | |

Unique: (userId, listingId)

### Table: promotions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id | |
| listingId | varchar | FK → listings.id, nullable | |
| promotionType | enum | not null | top_1d/top_3d/top_7d/highlight/unlimited_sub/bundle |
| isActive | boolean | default true | index |
| expiresAt | timestamptz | nullable, index | |
| createdAt | timestamptz | default now() | |

### Table: notifications
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id | |
| listingId | varchar | FK → listings.id, nullable | |
| type | varchar(50) | not null | new_message/price_drop/moderation_update/etc |
| payload | jsonb | not null | Type-specific data |
| read | boolean | default false | |
| createdAt | timestamptz | default now() | |

Unique: (userId, listingId, type) — dedup guard

### Table: notification_prefs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id (cascade) | |
| type | enum | not null | new_message/price_drop/moderation_update |
| enabled | boolean | default true | |
| createdAt | timestamptz | default now() | |

Unique: (userId, type)

### Table: payments
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| userId | varchar | FK → users.id | |
| listingId | varchar | nullable | For listing promotion |
| amount | float | not null | In GEL |
| currency | varchar(5) | default 'GEL' | |
| status | enum | default 'pending' | pending/completed/failed/refunded |
| provider | varchar(50) | nullable | 'stripe' |
| externalId | varchar | nullable, index | Stripe session ID |
| promotionType | enum | nullable | |
| createdAt | timestamptz | default now() | |

### Table: reports
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| reporterId | varchar | FK → users.id, index | |
| listingId | varchar | FK → listings.id, nullable | |
| targetUserId | varchar | FK → users.id, nullable | |
| reason | varchar(100) | not null | |
| description | text | nullable | |
| status | varchar(20) | default 'pending' | pending/resolved/dismissed |
| createdAt | timestamptz | default now() | |

Unique: (reporterId, listingId), (reporterId, targetUserId)

### Table: reviews
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| listingId | varchar | FK → listings.id (cascade) | |
| authorId | varchar | FK → users.id (cascade) | Buyer |
| sellerId | varchar | FK → users.id (cascade), index | |
| rating | int | not null | 1–5 |
| text | text | nullable | |
| createdAt | timestamptz | default now() | |

Unique: (authorId, listingId)

### Table: audit_logs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| adminId | varchar | plain string (no FK), index | |
| adminEmail | varchar | plain string | |
| action | varchar(100) | not null | e.g. "listing.status_change" |
| targetType | varchar(50) | not null | "listing" / "user" / "report" / "category" |
| targetId | varchar | not null | |
| details | jsonb | nullable | |
| createdAt | timestamptz | default now(), index | |

### Table: app_settings
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar (cuid) | PK | |
| key | varchar(100) | unique | Setting key |
| value | text | not null | Setting value |
| updatedAt | timestamptz | updatedAt | |

### Relations Summary
- users 1→N listings, favorites, notifications, sessions, payments, promotions, reports, reviews
- listings 1→N listing_photos, favorites, threads, promotions, notifications, reports, reviews
- threads 1→N messages, thread_participants
- categories 1→N listings, self-reference (parentId)
- cities 1→N districts, listings

### Indexes
- users: unique(email), index(deletedAt)
- listings: index(status), index(expiresAt), index(userId), index(categoryId), index(cityId)
- messages: index(threadId, createdAt)
- sessions: unique(refreshToken), index(userId)
- notifications: unique(userId, listingId, type), index(userId, read)
- payments: index(externalId), index(userId)
- reports: index(reporterId), index(status)
- reviews: unique(authorId, listingId), index(sellerId)

---

## Section 6: API Spec

### Auth
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| POST | /api/auth/request-otp | { email } | { success } | no | Rate: 5/min per email |
| POST | /api/auth/verify-otp | { email, code } | { accessToken, refreshToken, user } | no | Dev: code=000000 |
| POST | /api/auth/refresh | { refreshToken } | { accessToken, refreshToken } | no | Token rotation |
| GET | /api/auth/sessions | — | Session[] | yes | All active sessions |
| DELETE | /api/auth/sessions/:id | — | { success } | yes | Revoke one session |
| DELETE | /api/auth/sessions | — | { success } | yes | Revoke all except current |

### Users
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/users/me | — | User | yes | Current user |
| PATCH | /api/users/me | { name?, phone?, avatarUrl?, locale?, city? } | User | yes | Update profile |
| DELETE | /api/users/me | — | { success } | yes | Soft delete account |
| GET | /api/users/:id | — | PublicUser | no | Public profile |
| PATCH | /api/admin/users/:id/role | { role } | User | admin | Change role |
| PATCH | /api/admin/users/:id/ban | — | User | admin | Ban user |
| PATCH | /api/admin/users/:id/unban | — | User | admin | Unban user |
| GET | /api/admin/users | ?search&page&limit | { items: User[], total } | admin | |

### Listings
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/listings | ?page&limit&categoryId&cityId&sort&userId&status&lat&lng&radius | { items: Listing[], total } | optional | |
| GET | /api/listings/:id | — | Listing (with seller, photos, promotions) | optional | |
| POST | /api/listings | { title, description?, price?, categoryId, cityId, districtId? } | Listing | yes | |
| PATCH | /api/listings/:id | partial Listing | Listing | yes | Owner or admin |
| DELETE | /api/listings/:id | — | { success } | yes | Owner or admin |
| POST | /api/listings/:id/photos | multipart/form-data | { url, key } | yes | MinIO upload |
| DELETE | /api/listings/:id/photos/:photoId | — | { success } | yes | |
| POST | /api/listings/:id/renew | — | Listing | yes | Renew expired |
| PATCH | /api/admin/listings/:id/approve | — | Listing | admin | |
| PATCH | /api/admin/listings/:id/reject | { reason } | Listing | admin | |
| GET | /api/admin/listings | ?status&page&limit | { items, total } | admin | Moderation queue |

### Categories
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/categories | — | Category[] (tree) | no | |
| POST | /api/admin/categories | { name, nameRu, nameKa, nameEn, slug, parentId? } | Category | admin | |
| PATCH | /api/admin/categories/:id | partial Category | Category | admin | |
| DELETE | /api/admin/categories/:id | — | { success } | admin | |

### Cities
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/cities | — | City[] (with districts) | no | |

### Favorites
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/favorites | ?page&limit | { items: Listing[], total } | yes | |
| POST | /api/favorites/:listingId | — | { success } | yes | Add to favorites |
| DELETE | /api/favorites/:listingId | — | { success } | yes | Remove |
| GET | /api/favorites/check/:listingId | — | { isFavorited: bool } | yes | |

### Chat (Threads)
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/threads | ?page&limit | { items: Thread[] } | yes | All user threads |
| POST | /api/threads | { listingId, text } | { threadId } | yes | Start conversation |
| GET | /api/threads/:id/messages | ?before&limit | { items: Message[] } | yes | Cursor pagination |
| POST | /api/threads/:id/messages | { text } | Message | yes | WebSocket preferred |
| WebSocket | /socket.io | — | real-time events | yes | new_message event |

### Notifications
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/notifications | ?page&limit&unread | { items: Notification[], unreadCount } | yes | |
| PATCH | /api/notifications/:id/read | — | { success } | yes | |
| POST | /api/notifications/read-all | — | { success } | yes | |
| GET | /api/notifications/preferences | — | NotificationPref[] | yes | |
| PATCH | /api/notifications/preferences | { type, enabled } | NotificationPref | yes | |

### Payments
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/payments | ?page&limit | { items: Payment[], total } | yes | User payment history |
| POST | /api/payments/create-checkout | { promotionType, listingId? } | { url: stripeCheckoutUrl } | yes | Stripe redirect |
| GET | /api/payments/success | ?session_id | { success, payment } | yes | After Stripe return |
| POST | /api/stripe-webhook | raw body | 200 | no | Stripe webhook |
| GET | /api/admin/payments | ?page&limit&status&type | { items, total } | admin | |
| GET | /api/admin/stats/revenue | — | { total, month } | admin | |

### Promotions
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/promotions | ?listingId | Promotion[] | yes | Active promotions |
| POST | /api/promotions | { promotionType, listingId? } | Promotion | yes | Create after payment |

### Reports
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| POST | /api/reports | { listingId?, targetUserId?, reason, description? } | Report | yes | |
| GET | /api/reports | ?page&limit&status | { items: Report[] } | admin | |
| PATCH | /api/reports/:id | { status } | Report | admin | resolve/dismiss |

### Reviews
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/reviews | ?sellerId&page&limit | { items: Review[], avgRating, total } | no | |
| POST | /api/reviews | { listingId, rating, text? } | Review | yes | Buyer after sold |

### Admin Stats
| Method | Endpoint | Body/Query | Response | Auth | Notes |
|--------|----------|-----------|----------|------|-------|
| GET | /api/admin/stats | — | { users, listings, activeListings, pendingModeration, revenue } | admin | |

---

## Section 7: Seed Data

### Developer Test Account (ALWAYS first)
| Field | Value |
|-------|-------|
| email | serter2069@gmail.com |
| name | Sergei |
| role | admin |
| city | Тбилиси |
| locale | ru |
| isOnboarded | true |
| avatarUrl | https://picsum.photos/seed/user-sergei/200/200 |

This account gets: 15 own listings, 5 active conversations with 100+ messages, 10 favorites, 20 notifications (mix of types, 30% unread), all payment types.

### Test Accounts (OTP: 000000)
| email | name | role | city |
|-------|------|------|------|
| serter2069@gmail.com | Sergei | admin | Тбилиси |
| bob@test.ge | Боб Джонсон | user | Тбилиси |
| carol@test.ge | Кэрол Смит | user | Батуми |
| alice@test.ge | Алиса Иванова | user | Кутаиси |
| david@test.ge | Давид Бокучава | user | Тбилиси |
| mari@test.ge | Мари Гелашвили | user | Рустави |

### Examples per table (seed generates many more)

#### listings (examples: 5, seed generates: 200)
| title | price (GEL) | seller | category | city | status |
|-------|-------------|--------|----------|------|--------|
| iPhone 14 Pro, 256GB, чёрный | 2800 | bob@test.ge | Электроника | Тбилиси | active |
| Диван угловой, хорошее состояние | 650 | carol@test.ge | Мебель | Батуми | active |
| Аренда авто Toyota Prius 2020 | 120/день | david@test.ge | Транспорт | Тбилиси | active |
| Квартира 2BR в Вере | 1200/мес | mari@test.ge | Недвижимость | Тбилиси | active |
| Велосипед горный Trek | 380 | serter2069@gmail.com | Спорт | Тбилиси | draft |

#### categories (seed creates)
| slug | nameRu | parent |
|------|--------|--------|
| electronics | Электроника | — |
| phones | Телефоны | electronics |
| computers | Компьютеры | electronics |
| furniture | Мебель | — |
| transport | Транспорт | — |
| cars | Автомобили | transport |
| real-estate | Недвижимость | — |
| sports | Спорт и отдых | — |
| clothes | Одежда | — |
| services | Услуги | — |

#### cities (seed creates)
Тбилиси, Батуми, Кутаиси, Рустави, Гори, Зугдиди — с районами для Тбилиси (Вера, Сабуртало, Дидубе, Надзаладеви, Глдани, Исани, Самгори, Чугурети).

#### conversations & messages (seed generates: 30 threads, 500 messages)
- serter2069@gmail.com имеет активные диалоги с bob, carol, alice, david, mari
- Каждый диалог: 10–50 сообщений, timestamps за 90 дней
- 30% непрочитанных у serter2069

#### listing_photos (seed generates: 400)
```ts
// Per listing, 2–5 photos
url: `https://picsum.photos/seed/listing-${listingId}-${n}/800/600`
```

#### favorites (seed generates: 40)
- serter2069@gmail.com: 10 избранных из разных категорий
- Другие пользователи: 1–5 избранных

#### notifications (seed generates: 100)
- Все типы: new_message, price_drop, moderation_update
- 70% прочитаны, 30% непрочитаны
- За 30 дней

#### payments (seed generates: 20)
- 5 completed (для serter2069: top_1d × 2, highlight, top_7d, unlimited_sub)
- 2 failed, 1 refunded, 2 pending

### Seed Script Rules
1. `faker.seed(42)` — детерминированный запуск
2. faker locale = 'ru' для имён и описаний
3. `npm run seed` — запуск из корня проекта (`scripts/seed.ts`)
4. TRUNCATE + re-insert (idempotent)
5. serter2069@gmail.com ПЕРВЫЙ, все relational data ссылаются на него
6. Timestamps распределены за 90 дней (не все "now()")
7. FORBIDDEN: null/empty images — каждое listing ОБЯЗАНО иметь фото (picsum.photos)
8. Volume targets:

| Table | Records |
|-------|---------|
| users | 50 |
| categories | 15 (с subcategories) |
| cities | 6 (+ 8 районов Тбилиси) |
| listings | 200 (mix статусов) |
| listing_photos | 400 (2–5 на listing) |
| threads | 30 |
| messages | 500 |
| favorites | 40 |
| notifications | 100 |
| payments | 20 |
| reviews | 50 |
| promotions | 25 |
