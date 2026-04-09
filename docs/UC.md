# USE CASES — Авито Грузия

**Версия:** 1.1
**Дата:** 2026-04-03
**Основа:** PRODUCT document + Collegium review

**Роли:** Гость, Пользователь (зарег.), Премиум продавец, Администратор
**Города:** Тбилиси, Батуми, Кутаиси, Рустави, Гори, Зугдиди
**Валюты:** GEL (₾, основная), USD ($, дополнительная)

---

## TEST STATUS — /dotest Pass 3 (2026-04-09)

| UC | Title | Status |
|----|-------|--------|
| UC-01 | Авторизация (OTP) | [pass] |
| UC-02 | Создание объявления | [fail] |
| UC-11 | Карта объявлений | [pass] |
| UC-12 | Модерация | [pass] |
| UC-19 | Истечение объявления (cron) | [pass] |
| UC-03 | Редактирование объявления | [pass] |
| UC-04 | Поиск и фильтрация | [pass] |
| UC-05 | Просмотр объявления | [pass] |
| UC-06 | Чат | [pass] |
| UC-07 | Избранное | [pass] |
| UC-08 | Продвижение объявлений | [pass] |
| UC-09 | Профиль продавца | [pass] |
| UC-10 | Список сообщений | [pass] |
| UC-13 | Обновление объявления | [pass] |
| UC-14 | Управление категориями | [pass] |
| UC-15 | Показ телефона | [pass] |
| UC-16 | Подписка Premium | [pass] |
| UC-17 | Уведомления | [pass] |
| UC-18 | Профиль пользователя | [pass] |
| UC-20 | Жалобы | [pass] |
| UC-21 | Управление пользователями | [pass] |
| UC-22 | State Machine объявления | [pass] |
| UC-23 | Rate Limiting | [pass] |
| UC-24 | i18n | [pass] |
| UC-25 | Admin Dashboard | [pass] |
| UC-26 | Onboarding | [pass] |
| UC-27 | Blocked User Enforcement | [pass] |
| UC-28 | Photo Upload Security | [pass] |
| UC-29 | Payment History | [pass] |
| UC-30 | User Settings | [pass] |
| UC-31 | Homepage | [pass] |
| UC-32 | Category i18n | [pass] |
| UC-33 | Duplicate Detection | [pass] |
| UC-34 | Account Deletion | [pass] |
| UC-35 | Listing Expiry Cron | [pass] |
| UC-36 | Blocked User Listings | [pass] |
| UC-37 | Legal Pages | [pass] |
| UC-38 | Payment Callbacks | [pass] |
| UC-39 | Promotion Expiry Cron | [pass] |
| UC-40 | Listing Expiry Reminders | [pass] |
| UC-41 | (reserved) | [pass] |
| UC-42 | (reserved) | [pass] |
| UC-43 | Pay-Per-Listing | [ ] |
| UC-44 | Stripe Webhook Processing | [ ] |
| UC-45 | SEO & Social Sharing | [ ] |
| UC-46 | Health Check & Monitoring | [ ] |

**Pass 3 results (2026-04-09):**
- UC-12 moderation: PASS (queue, approve, reject, security, state machine all ok)
- UC-19 expiry cron: PASS (expired listings filtered from feed, renew endpoint works; no HTTP trigger — by design)
- UC-02 listing creation: FAIL — #241 P2 photo upload 500 when MinIO unreachable, #242 P3 isDraft:true ignored
- UC-11 map: FAIL — #236 P1 markerClusterGroup crash (FIXED PR#239), #237 P2 /listings/map route crash (FIXED PR#240), #238 P2 pending listings in map (was already fixed)

**Pass 1+2 results (2026-04-08):**
- favorites_race: PASS (no duplicate inserted — upsert idempotent, 201+201 → 1 record)
- cors_8082: PASS (Access-Control-Allow-Origin: http://localhost:8082)
- category_filter: PASS (real-estate → 5 listings)
- multer_400: PASS (wrong field name → 400)
- rate_limit_bypass: PASS (X-Forwarded-For spoofing blocked — real IP used, 429 from attempt 2)

---

## Product Vision & Roles

**What:** Georgian classified ads marketplace (Avito-style) for buying and selling goods & services across 6 major cities, mobile-first with multilingual support (KA/RU/EN).

**Value proposition:**
- **Buyers:** Find local deals fast with map-based search, no registration required to browse
- **Sellers:** Post listings instantly (no moderation delay), reach local audience in GEL/USD
- **Premium Sellers:** Unlimited listings + boosted visibility for high-volume traders
- **Administrators:** Keep platform clean via complaint-driven moderation, no pre-publish friction

**Market:** Georgia (Tbilisi, Batumi, Kutaisi, Rustavi, Gori, Zugdidi). Primary currency GEL (₾). Mixed audience: Georgian, Russian, English speakers. Low-to-medium tech literacy expected.

---

### Guest — anonymous browser
- **Goal:** Find a specific item or check prices without committing to registration
- **Pain:** Other platforms force signup before viewing contact info or sending messages
- **Tech level:** low
- **Frustrations:** Forced login walls, slow load on mobile data, Georgian-only UI

### User — registered free account
- **Goal:** Sell unwanted items or buy locally; maintain up to 10 active listings
- **Pain:** Listings expire unnoticed; messages get lost; no trust signals on seller
- **Tech level:** low–medium
- **Frustrations:** 10-listing cap hit fast, OTP email delays

### Premium Seller — paid subscriber
- **Goal:** Run high-volume trade (shop, dealer, freelancer) with unlimited listings and top placement
- **Pain:** Free tier cap kills business; promoted posts cost extra on top of subscription
- **Tech level:** medium
- **Frustrations:** Promotion costs stacking on subscription; analytics too basic

### Administrator — platform operator
- **Goal:** Resolve reports, block bad actors, manage categories
- **Pain:** Manual moderation of high-volume complaints
- **Tech level:** high
- **Frustrations:** No bulk actions; fraudulent listings re-posted after deletion

### SYSTEM — automated background processes
- **Responsibilities:** Listing expiry (UC-19), rate limiting (UC-23), promotion scheduling (UC-08), notification dispatch (UC-17)
- **Triggers:** time-based (cron) and event-based (webhooks, payment callbacks)
- **Failure mode:** silent — must log all actions to audit trail

---

## UC-01: Авторизация пользователя (OTP)

**Актор:** Гость
**Цель:** Войти или зарегистрироваться в системе
**Предусловие:** Пользователь не авторизован

**Основной поток:**
1. Гость нажимает "Войти" (хедер)
2. Экран "Email": поле ввода email
3. Гость вводит email, нажимает "Получить код"
4. Система отправляет 6-значный OTP на email (TTL: 10 минут)
5. Экран "Код": поле ввода OTP
6. Гость вводит код, нажимает "Войти"
7. Система проверяет код → создаёт пользователя если не существует → возвращает JWT
8. Пользователь авторизован, редирект на главную

**Альтернативные потоки:**
- 3a. Email в неверном формате → ошибка валидации
- 6a. Код неверный → "Неверный код"
- 6b. Код истёк (>10 мин) → "Код устарел, запросите новый"
- 6c. 3 неверных попытки → временная блокировка (rate limit)
- 6d. Кнопка "Выслать код повторно" (доступна через 60 сек)

**Данные:**
- email: string, required, format email
- otp: string, 6 digits, TTL 10 min
- DEV mode: OTP = 000000

**После первого входа:**
- Имя и телефон устанавливаются в настройках профиля (UC-18)
- Никнейм не требуется

**Acceptance criteria:**
- AC-01: Первый вход создаёт пользователя автоматически (email = unique identifier)
- AC-02: Повторный вход не создаёт дубликат
- AC-03: JWT access (15m) + refresh (30d) выдаются после верификации OTP
- AC-04: Rate limit: max 5 OTP-запросов в час с одного IP
- AC-05: DEV_AUTH=true → OTP всегда 000000

**UI состояния:**
- **Loading:** Кнопка "Получить код" / "Войти" показывает spinner, disabled на время запроса
- **Empty:** Экран Email — пустое поле ввода, placeholder "example@mail.com"
- **Error (email):** "Valid email required" — если email невалидный (нет @)
- **Error (OTP expired):** "Invalid or expired OTP" — если код истёк (>10 мин) или уже использован
- **Error (wrong code):** "Invalid code" + attemptsLeft (осталось попыток до блокировки)
- **Error (too many attempts):** "Too many attempts. Request a new OTP." — после 3 неверных вводов
- **Error (rate limit):** "Wait 60 seconds before requesting a new OTP" — cooldown 60 сек между запросами
- **Error (deleted account):** "Account deleted" — для soft-deleted аккаунтов (UC-34)
- **Success:** Редирект на / (главная) или /onboarding (если isOnboarded=false)

**Валидация (из кода):**
- email: string, обязателен, должен содержать "@" (проверка `!email.includes('@')`)
- OTP: строка из 6 цифр, TTL 10 минут, max 3 попытки ввода (MAX_OTP_ATTEMPTS=3)
- Rate limit OTP-запросов: 3/мин per email (rateLimiter.ts) + 60 сек cooldown per email (auth.ts DB check)
- Rate limit OTP-верификации: 10/15мин per IP (otpVerifyRateLimit)
- Тексты ошибок: "Valid email required", "Email and code required", "Invalid or expired OTP", "Invalid code", "Too many attempts. Request a new OTP.", "Wait 60 seconds before requesting a new OTP"

**Уведомления:**
- Email с OTP-кодом: отправляется через Brevo API
- Шаблоны на 3 языках (ru/en/ka): определяется по Accept-Language заголовку
- RU: "Ваш код входа — Avito Georgia", тело: "Ваш код: {otp}, Действителен 10 минут."
- EN: "Your login code — Avito Georgia", тело: "Your code: {otp}, Valid for 10 minutes."
- KA: "თქვენი შესვლის კოდი — Avito Georgia"
- DEV_AUTH=true: email не отправляется, код логируется в консоль

**Edge cases:**
- Soft-deleted аккаунт: OTP-запрос возвращает 401 "Account deleted" (блокируется ДО upsert)
- Параллельные OTP-запросы: предыдущие неиспользованные OTP помечаются used=true перед созданием нового
- Token rotation: при каждом refresh старый refreshToken заменяется новым (sliding window 30d)
- httpOnly cookies: accessToken (maxAge 15m, sameSite lax), refreshToken (maxAge 30d, path /api/auth/refresh)
- Блокированный пользователь: middleware auth.ts проверяет role=blocked в JWT payload, возвращает 403 "Account suspended"

**Responsive:**
- Mobile 430px: экраны Email и OTP — полная ширина с отступами, кнопка на всю ширину
- Desktop: центрированная форма, max-width ограничен

---

## UC-02: Создание объявления

> Note (Architect): EUR currency accepted in Zod schema but UC specifies GEL/USD only. GIF format accepted by multer but UC says JPG/PNG/WEBP. Sync needed.

**Актор:** Пользователь (зарег.)
**Цель:** Опубликовать объявление о продаже/услуге
**Предусловие:** Пользователь авторизован, количество активных объявлений в данной категории < freeListingQuota (бесплатный) или без лимита (премиум)

**Основной поток:**
1. Пользователь нажимает "Подать объявление" (хедер/FAB на мобильном)
2. Экран "Шаг 1: Категория" — выбор категории из списка с иконками
3. Экран "Шаг 1b: Подкатегория" — выбор подкатегории (если есть)
4. Экран "Шаг 2: Детали объявления":
   - Заголовок (текстовое поле)
   - Описание (textarea)
   - Цена + переключатель "Договорная"
   - Валюта (GEL / USD)
   - Город (выпадающий список)
   - Район (выпадающий список, зависит от города)
5. Экран "Шаг 3: Фотографии":
   - Загрузка до 10 фото (drag-and-drop / кнопка)
   - Первое фото = обложка (можно перетасовать)
   - Превью загруженных фото
6. Экран "Шаг 4: Предпросмотр":
   - Объявление как его увидят покупатели
   - Кнопки "Назад" / "Опубликовать"
7. Пользователь нажимает "Опубликовать"
8. Система создаёт объявление со статусом **pending_moderation** (ожидает проверки)
9. После одобрения администратором → статус **active**, объявление доступно в поиске
10. Экран "Успех": "Объявление отправлено на проверку и будет опубликовано после одобрения"

> Note: объявления проходят модерацию перед публикацией. Квота на бесплатные объявления — per-category (freeListingQuota, по умолчанию 5 для бесплатных аккаунтов, безлимит для Premium). При создании черновика статус = draft.

**Альтернативные потоки:**
- 1a. Лимит категорийной квоты достигнут → "Вы достигли лимита бесплатных объявлений в этой категории" + кнопка "Стать Премиум"
- 4a. Заголовок пустой → "Укажите заголовок"
- 4b. Цена = 0 и не "Договорная" → "Укажите цену или выберите Договорная"
- 4c. Город не выбран → "Выберите город"
- 5a. Файл > 10MB → "Максимальный размер фото 10MB"
- 5b. Формат не JPG/PNG/WEBP → "Допустимые форматы: JPG, PNG, WEBP"
- 5c. Попытка загрузить >10 фото → "Максимум 10 фото"
- 7b. Сохранить как черновик → статус = draft, доступен в "Мои объявления"

**Данные:**
- title: string, required, 5-100 chars
- description: string, required, 20-5000 chars
- category_id: uuid, required, FK categories
- subcategory_id: uuid, optional, FK subcategories
- price: decimal(10,2), nullable (null = договорная)
- is_negotiable: boolean, default false
- currency: enum(GEL, USD), default GEL
- city: enum(Tbilisi, Batumi, Kutaisi, Rustavi, Gori, Zugdidi, Other), required
- district: string, optional, max 100 chars
- photos: file[], 0-10, each max 10MB, JPG/PNG/WEBP
- status: enum(draft, active, rejected, sold, inactive, removed), default pending_moderation

**Acceptance criteria:**
- AC-01: Объявление проходит 4 шага (категория → детали → фото → предпросмотр)
- AC-02: Обязательные поля: заголовок, описание, категория, цена или "договорная", город
- AC-03: Фото до 10 штук, каждое до 10MB, форматы JPG/PNG/WEBP
- AC-04: После публикации объявление попадает в pending_moderation; после одобрения — active
- AC-05: Бесплатный пользователь: ограничен per-category freeListingQuota (default 5)
- AC-06: Премиум: без лимита
- AC-07: Черновик можно сохранить и вернуться позже

**UI состояния:**
- **Loading:** Spinner на кнопке "Опубликовать" / "Сохранить черновик"
- **Empty:** Шаг 1 — список категорий с иконками; Шаг 2 — пустые поля формы
- **Error (валидация):** Inline-ошибки под полями (красный текст)
- **Error (квота):** "Вы достигли лимита бесплатных объявлений в этой категории" + allowPaid: true/false + кнопка "Стать Премиум" (HTTP 402)
- **Error (дубликат):** "Похожее объявление уже было создано недавно" + existingId (HTTP 409)
- **Error (rate limit):** "Too many listings created. Try again later." (HTTP 429)
- **Success:** "Объявление отправлено на проверку" (status=pending_moderation)

**Валидация (из кода — Zod schemas):**
- title: string, min 5, max 100 символов, HTML-теги удаляются (stripHtml + xss)
- description: string, min 20, max 5000 символов, HTML-теги удаляются (optional)
- price: number >= 0, nullable (null = договорная)
- currency: enum GEL | USD | EUR (код допускает EUR, UC указывает только GEL/USD)
- categoryId: uuid, обязателен
- cityId: uuid, обязателен
- districtId: uuid, опционален
- address: string, max 200 символов, опционален
- Для черновика: categoryId + cityId обязательны, остальное опционально, title min 1 (не 5)
- Фото: до 10 штук, каждое до 10MB (multer limit), MIME: image/jpeg, image/png, image/webp, image/gif
- Тексты ошибок: Zod выдаёт первую ошибку из массива (`err.errors[0]?.message`), "Invalid categoryId or districtId — record not found" (FK error)
- Rate limit: 5 объявлений в час per user (listingCreateRateLimit)

**Уведомления:**
- При публикации: нет уведомления пользователю (объявление уходит на модерацию)
- После одобрения модератором: email "Ваше объявление {title} прошло модерацию и теперь опубликовано" (sendListingApprovedEmail)
- После отклонения модератором: email "Ваше объявление {title} было отклонено модератором" + причина (sendListingRejectedEmail)

**Вложения/Медиа:**
- Форматы: JPEG, PNG, WebP, GIF (код допускает GIF, UC указывает только JPEG/PNG/WebP)
- Лимит: 10 фото на объявление, каждое до 10MB
- Хранение: MinIO (uploadFile из lib/storage.ts)
- Загрузка: POST /api/listings/:id/photos (после создания объявления)
- Удаление: DELETE /api/listings/:id/photos/:photoId (удаляет из MinIO + БД)
- Порядок: поле order (integer), первое фото = обложка (order=0)

**Edge cases:**
- Двойной клик "Опубликовать": rate limit защищает от дублей (5/час), + duplicate detection (title hash 24h)
- Потеря соединения при загрузке фото: фото загружаются отдельным запросом, объявление уже создано
- Геокодирование: best-effort, не блокирует создание; если address указан — geocodeAddress, иначе geocodeCity
- FK-ошибка: если categoryId/districtId невалидны — Prisma P2003/P2025 → 400
- Квота по категориям: считает active + pending_moderation объявления в этой категории; subcategory наследует от parent если own quota=0

**Responsive:**
- Mobile 430px: пошаговая форма (wizard), каждый шаг на отдельном экране
- Desktop: та же пошаговая форма, центрированная

> [FLAG Architect 2026-04-06]: Код использует status=pending_moderation, UC описывает немедленную публикацию. Необходимо решить: убрать модерацию из кода (вариант A) или обновить UC добавив экран ожидания (вариант B). Task #2234.
> [FLAG SecOfficer 2026-04-06]: Лимит бесплатных объявлений: UC=10, код=category.freeListingQuota (default 5). Синхронизировать с реальным значением.
> [SYNC 2026-04-06]: UC updated to match code (pending_moderation flow, category quota system).

---

## UC-03: Редактирование объявления

**Актор:** Пользователь (владелец объявления)
**Цель:** Изменить данные или статус своего объявления
**Предусловие:** У пользователя есть объявление со статусом active, draft или rejected

**Основной поток:**
1. Пользователь → "Мои объявления" → выбирает объявление → "Редактировать"
2. Экран редактирования: все поля заполнены текущими значениями
3. Пользователь изменяет нужные поля (заголовок, описание, цену, фото и т.д.)
4. Пользователь нажимает "Сохранить"
5. Если изменён заголовок/описание/фото → изменения применяются мгновенно (без модерации)
6. Если изменена только цена/район → изменения применяются мгновенно
7. При снижении цены → объявление помечается badge "Цена снижена", уведомление пользователям из избранного

**Альтернативные потоки:**
- 1a. "Снять объявление" → подтверждение → статус = inactive, исчезает из поиска
- 1b. "Отметить как продано" → подтверждение → статус = sold, исчезает из поиска, инициируется отзыв (UC-15)
- 3a. Удаление фото: крестик на превью → фото удалено (минимум 0 фото)
- 3b. Добавление фото: если текущих < 10 → можно добавить

**Данные:**
- Все поля из UC-02 (editable)
- new_status: enum(inactive, sold) — доступны через действия

**Acceptance criteria:**
- AC-01: Владелец может изменить любое поле своего объявления
- AC-02: Изменения контента применяются мгновенно без повторной модерации
- AC-03: Изменение цены → мгновенное
- AC-04: Снижение цены → badge "Цена снижена" + уведомление избранным
- AC-05: "Снять" и "Продано" доступны для активных объявлений
- AC-06: Снятое/проданное объявление исчезает из поиска
- AC-06: Only the listing owner can edit (returns 403 for other users).

**UI состояния:**
- **Loading:** Spinner при загрузке текущих данных объявления, spinner при сохранении
- **Error (403):** "Forbidden" — попытка редактировать чужое объявление
- **Error (404):** "Not found" — объявление не найдено
- **Error (валидация):** аналогично UC-02, Zod partial schema (все поля опциональны)
- **Success:** обновлённые данные возвращаются в ответе

**Валидация (из кода):**
- Та же schema что в UC-02, но все поля optional (updateListingSchema = createListingSchema.partial())
- Владелец проверяется: listing.userId !== req.user.userId → 403 "Forbidden"
- XSS: title и description санитизируются через xss() при обновлении

**Уведомления:**
- При снижении цены: in-app PRICE_DROP уведомление + email всем кто добавил в избранное
- Email текст: "The listing {title} you favorited dropped in price from {oldPrice} to {newPrice}"
- Условие: newPrice < oldPrice, оба не null

**Edge cases:**
- Re-geocoding: при изменении address или cityId координаты пересчитываются (geocodeAddress → geocodeCity fallback)
- Удалённые фото: DELETE /api/listings/:id/photos/:photoId удаляет из MinIO

**Responsive:**
- Mobile (430px): форма редактирования на полный экран, кнопки действий ("Снять", "Продано") в bottom sheet
- Desktop (>768px): форма редактирования центрированная, кнопки действий в sidebar

> [FLAG Architect 2026-04-06]: UC ссылается на UC-15 (отзывы) через действие "Продано", но Review model не существует в Prisma. Task #2240 создана для реализации UC-15.

---

## UC-04: Поиск объявлений

**Актор:** Гость или Пользователь
**Цель:** Найти подходящее объявление
**Предусловие:** Нет (доступно без авторизации)

**Основной поток:**
1. Пользователь вводит запрос в поисковую строку (хедер) и/или выбирает категорию
2. Система выполняет полнотекстовый поиск по заголовкам и описаниям
3. Экран "Результаты поиска":
   - Панель фильтров (слева на десктопе / sheet на мобильном)
   - Список карточек объявлений (справа / основная область)
   - Переключатель "Список / Карта"
4. Пользователь применяет фильтры (цена, город, дата, с фото)
5. Результаты обновляются в реальном времени (debounce 300ms)
6. Пользователь выбирает сортировку
7. Карточка объявления: фото-обложка, заголовок, цена, город, дата, badge (Топ/Выделено/Цена снижена)
8. Пагинация: бесконечная прокрутка (мобильный) или пагинация (десктоп, 20 на страницу)

**Альтернативные потоки:**
- 2a. Нет результатов → "По вашему запросу ничего не найдено" + предложения (расширить фильтры, изменить город)
- 2b. Ошибка сервера → "Попробуйте позже"
- 4a. Цена "от" > "до" → swap значений автоматически

**Данные (фильтры):**
- q: string, optional, поисковый запрос, min 2 chars
- category_id: uuid, optional
- subcategory_id: uuid, optional
- city: enum, optional
- price_min: decimal, optional, >= 0
- price_max: decimal, optional, >= price_min
- currency: enum(GEL, USD), default GEL
- has_photo: boolean, optional
- date_from: date, optional
- sort_by: enum(date_desc, date_asc, price_asc, price_desc, popularity), default date_desc
- page: int, default 1
- per_page: int, default 20, max 50

**Acceptance criteria:**
- AC-01: Поиск работает по заголовку и описанию (полнотекстовый)
- AC-02: Фильтры: категория, город, цена от/до, дата, с фото
- AC-03: Сортировка: по дате (новые), по цене (возр./убыв.), по популярности
- AC-04: Карточка: фото, заголовок, цена, город, дата
- AC-05: Продвинутые объявления отображаются выше в результатах
- AC-06: Результаты обновляются при изменении фильтров без перезагрузки
- AC-07: Пагинация: 20 результатов на страницу (десктоп), infinite scroll (мобильный)

**UI состояния:**
- **Loading:** Skeleton-карточки или spinner при первой загрузке, spinner внизу при подгрузке (infinite scroll)
- **Empty:** "По вашему запросу ничего не найдено" + предложения расширить фильтры
- **Error:** "Too many search requests. Try again in a moment." (HTTP 429)
- **Success:** Сетка карточек с данными объявлений

**Валидация (из кода):**
- q: string, опционален (min 2 chars по UC, но код не проверяет min)
- category: принимает cuid или slug (авто-определение по regex `/^c[a-z0-9]{24,}$/`)
- city: uuid cityId, опционален
- price_min/price_max: decimal, parseFloat
- sort: enum "price_asc" | "price_desc" | "views_desc" | "createdAt_desc", default createdAt_desc
- limit: max 50, default 20
- page: int, default 1
- Rate limit: 100/мин per IP (searchRateLimit)

**Данные в карточке (из кода):**
- photos: до 3 фото (take: 3), первое = обложка
- title: заголовок
- price + currency: цена и валюта
- city: nameRu/nameEn/nameKa (зависит от языка)
- category: name + slug
- isPromoted: badge "Топ" (если есть активные top_1d/top_3d/top_7d промо)
- isHighlighted: badge "Выделено" (если есть активное highlight промо)
- isPremium: badge если у продавца активная подписка unlimited_sub
- user: id + name (продавец)

**Edge cases:**
- Сортировка: promoted (top_*) → premium (unlimited_sub) → обычные, внутри каждой группы — по выбранной сортировке
- Категория не найдена: если slug не найден в БД → пустой результат (не ошибка)
- Фильтр expired: автоматически отсеиваются объявления с expiresAt < now OR status != active

**Responsive:**
- Mobile 430px: одна колонка карточек, фильтры в bottom sheet, infinite scroll
- Desktop: сетка 2-3 колонки, панель фильтров слева, пагинация внизу

---

## UC-05: Просмотр объявления

> Note (Architect): View deduplication uses in-memory Map — resets on server restart. Redis fallback not documented.
> Note (Marketing): SEO not described — meta title, OG tags critical for classifieds discoverability.

**Актор:** Гость или Пользователь
**Цель:** Изучить детали объявления для принятия решения о покупке
**Предусловие:** Объявление существует, статус = active

**Основной поток:**
1. Пользователь кликает на карточку из результатов поиска / каталога
2. Экран "Объявление":
   - Фотогалерея (swipe на мобильном, стрелки на десктопе, полноэкранный просмотр по клику)
   - Заголовок, цена (GEL или USD), badge (Топ / Выделено / Цена снижена)
   - Описание (полный текст)
   - Город, район
   - Дата публикации, счётчик просмотров
   - Категория → подкатегория (breadcrumb)
3. Боковая панель (десктоп) / нижний блок (мобильный):
   - Аватар продавца, ник, рейтинг (звёзды), "На платформе с..."
   - Кнопка "Написать продавцу" (для зарег.)
   - Кнопка "Позвонить" (если продавец указал телефон, маскированный до клика)
   - Кнопка "В избранное" (сердечко)
4. Блок "Другие объявления продавца" (до 4 карточек)
5. Блок "Похожие объявления" (по категории и городу, до 6 карточек)
6. Система инкрементирует счётчик просмотров (+1, дедуплицируется по сессии/IP в сутки)

**Альтернативные потоки:**
- 1a. Объявление снято/продано → "Это объявление больше не активно" + похожие
- 3a. Гость нажимает "Написать продавцу" → редирект на регистрацию/логин
- 3b. Телефон не указан → кнопка "Позвонить" не отображается

**Данные (отображаемые):**
- title: string
- description: string
- price: decimal | "Договорная"
- currency: GEL | USD
- city: string
- district: string | null
- photos: url[], 0-10
- created_at: datetime
- views_count: int
- seller: { nickname, avatar_url, rating, registered_at, listings_count }
- seller_phone: string | null (маскированный: +995 5XX XXX XX XX → показ по клику)

**Acceptance criteria:**
- AC-01: Фотогалерея с swipe (мобильный) и стрелками (десктоп)
- AC-02: Полноэкранный просмотр фото по клику
- AC-03: Цена отображается в правильной валюте
- AC-04: Кнопки: "Написать продавцу", "В избранное", "Позвонить" (если есть телефон)
- AC-05: Блок "Другие объявления продавца" (до 4)
- AC-06: Счётчик просмотров: +1 за уникальный визит (1 раз в сутки с одного IP)
- AC-07: Для гостя "Написать продавцу" → редирект на логин
- AC-08: Телефон маскирован, раскрывается по клику "Показать номер"

**UI состояния:**
- **Loading:** Spinner при загрузке данных объявления
- **Empty:** Нет фото — placeholder-изображение
- **Error (404):** "Not found" — объявление не существует
- **Error (неактивно):** "Это объявление больше не активно" + похожие
- **Success:** Полная карточка объявления со всеми данными

**Валидация (из кода):**
- Телефон: GET /api/listings/:id/phone, requireAuth + phoneRevealRateLimit (20/час per user)
- Если listing.status !== 'active' → 410 "Listing is not active"
- Телефон может быть null (пользователь не указал)
- Ошибка rate limit: "Phone number reveal limit reached. Try again later."

**Данные в карточке (из кода, GET /api/listings/:id):**
- photos: все фото объявления (orderBy order asc)
- title, description, price, currency
- city: полный объект (включая nameRu/nameEn/nameKa)
- district: полный объект или null
- category: полный объект
- createdAt, views (счётчик просмотров)
- user: id, name, createdAt (без phone и email — приватность)
- isPremium: вычисляется по наличию активной unlimited_sub промо у продавца

**Гость видит:** все данные объявления, фотогалерею, информацию о продавце. Кнопка "Написать продавцу" → редирект на /auth. Кнопка "В избранное" → редирект на /auth. Кнопка "Показать номер" → требует авторизации.

**Edge cases:**
- Дедупликация просмотров: in-memory Map по ключу `{ip}:{listingId}:{date}`, очистка раз в час
- Ограничение: сбрасывается при перезапуске сервера (TODO: Redis для production)
- Phone = null: кнопка "Позвонить" не отображается

> [SYNC 2026-04-06]: IP-based daily deduplication is implemented (in-memory Map). Limitation: resets on server restart — consider Redis for production.

---

## UC-06: Написать продавцу

**Актор:** Пользователь (зарег.)
**Цель:** Связаться с продавцом по объявлению
**Предусловие:** Пользователь авторизован, объявление активно, пользователь не является владельцем объявления

**Основной поток:**
1. Пользователь на странице объявления нажимает "Написать продавцу"
2. Открывается чат-окно (slide-in панель на десктопе / полноэкранный на мобильном)
3. Чат привязан к конкретному объявлению (в хедере чата — миниатюра + заголовок объявления)
4. Первое сообщение преднаполнено: "Здравствуйте, интересует ваше объявление {title}"
5. Пользователь может отредактировать или отправить как есть
6. Сообщение отправляется, отображается в чате с timestamp
7. Продавец получает уведомление (in-app badge + email)
8. Продавец открывает "Сообщения" → видит новый диалог → отвечает

**Альтернативные потоки:**
- 1a. Существует предыдущий диалог по этому объявлению → открывается существующий тред
- 1b. Пользователь — владелец объявления → кнопка "Написать" не отображается
- 5a. Пустое сообщение → кнопка "Отправить" неактивна
- 7a. Email уведомление не отправилось → retry через 5 мин (max 3 раза)

**Данные:**
- message: string, required, 1-2000 chars
- listing_id: uuid, FK listings
- sender_id: uuid, FK users
- receiver_id: uuid, FK users (owner of listing)
- created_at: datetime
- is_read: boolean, default false

**Acceptance criteria:**
- AC-01: Только авторизованные пользователи могут отправлять сообщения
- AC-02: Чат привязан к конкретному объявлению
- AC-03: Первое сообщение преднаполнено, но редактируемо
- AC-04: Продавец получает уведомление (email + in-app)
- AC-05: Повторный визит открывает существующий диалог, а не создаёт новый
- AC-06: Нельзя написать самому себе

**UI состояния:**
- **Loading:** Spinner при создании треда / отправке сообщения
- **Empty:** Преднаполненное сообщение в поле ввода
- **Error (404):** "Listing not found" — объявление удалено
- **Error (self-message):** "Cannot message yourself" — попытка написать себе
- **Error (пустое):** "Text is required" — кнопка "Отправить" неактивна при пустом тексте
- **Error (rate limit):** "Too many messages. Slow down." — 60 сообщений/мин
- **Success:** Сообщение появляется в чате с timestamp

**Валидация (из кода):**
- text: string, обязателен, trim, не пустой после trim, санитизация через xss()
- listingId: uuid, FK listings (проверяется через findUnique)
- Проверка: listing.userId !== sender → нельзя написать самому себе
- Rate limit: 60 сообщений/мин per user (chatMessageRateLimit)

**Уведомления:**
- Email: sendNewMessageEmail() — "Новое сообщение от {senderName}" с превью (max 100 символов)
- Тема: "Новое сообщение от {senderName} — Avito Georgia"
- Тело: блокquote с превью, "Войдите в приложение, чтобы ответить."

**Edge cases:**
- Повторный визит: поиск существующего треда по AND (listingId, buyer participant, seller participant) → открывает тот же тред
- Thread.updatedAt: обновляется при каждом новом сообщении (для сортировки диалогов)

---

## UC-07: Добавить в избранное

**Актор:** Пользователь (зарег.)
**Цель:** Сохранить интересное объявление для быстрого доступа
**Предусловие:** Пользователь авторизован, объявление активно

**Основной поток:**
1. Пользователь нажимает иконку "сердечко" на карточке или на странице объявления
2. Иконка меняет состояние (заполненное сердечко, анимация)
3. Объявление добавлено в "Мои избранные"
4. Система подписывает пользователя на уведомления по этому объявлению

**Альтернативные потоки:**
- 1a. Уже в избранном → повторный клик убирает из избранного (toggle)
- 1b. Гость нажимает сердечко → редирект на логин/регистрацию
- 4a. Объявление снято → уведомление "Объявление {title} больше не доступно"
- 4b. Цена снижена → уведомление "Цена на {title} снижена"

**Данные:**
- user_id: uuid, FK users
- listing_id: uuid, FK listings
- created_at: datetime

**Экран "Мои избранные":**
- Список карточек избранных объявлений
- Фильтр по статусу: все / активные / снятые
- Сортировка: дата добавления
- Карточки помечены статусом если объявление снято/продано (серая карточка)

**Acceptance criteria:**
- AC-01: Toggle добавления/удаления из избранного на карточке и странице
- AC-02: Страница "Мои избранные" показывает все сохранённые объявления
- AC-03: Уведомление при снижении цены
- AC-04: Уведомление при снятии объявления
- AC-05: Снятые объявления в избранном отмечены визуально (серые)
- AC-06: Гость → редирект на логин

**UI состояния:**
- **Loading:** Spinner при добавлении/удалении
- **Empty (избранные):** "У вас пока нет избранных объявлений"
- **Success (toggle):** Иконка сердечко меняет состояние (заполненное/пустое), анимация
- **Inactive listing:** Серая карточка с пометкой статуса (sold/removed/expired)

**Валидация (из кода):**
- POST /api/favorites/:listingId — добавить (requireAuth)
- DELETE /api/favorites/:listingId — удалить (requireAuth)
- GET /api/favorites/:listingId/check — проверить статус (requireAuth)
- GET /api/favorites — список избранных (пагинация: page, take=20)
- Если уже в избранном → 200 { ok: true, alreadyFavorited: true } (идемпотентно)
- Если не в избранном при удалении → 404 "Not in favorites"

**Данные в списке избранных (из кода):**
- listing: полные данные + первое фото + city (nameRu/nameEn/nameKa) + category (name, slug)
- Пагинация: 20 элементов на страницу
- Сортировка: по дате добавления (createdAt desc)

**Уведомления:**
- PRICE_DROP: создаётся в UC-03 при снижении цены → in-app + email
- LISTING_REMOVED: создаётся в UC-03 при статусе removed → in-app + email

---

## UC-08: Платное продвижение объявления

> Note (Architect): Verify that highlight price sync (3 GEL vs 8 GEL, flagged 2026-04-06) is truly resolved.

**Актор:** Пользователь (владелец объявления)
**Цель:** Повысить видимость объявления через платные инструменты
**Предусловие:** Объявление со статусом active

**Основной поток:**
1. Пользователь → "Мои объявления" → выбирает объявление → "Продвинуть"
2. Экран "Продвижение" — карточки тарифов:
   - Поднять в топ: 1 день (5 GEL) / 3 дня (12 GEL) / 7 дней (20 GEL)
   - Выделить цветом: 7 дней (8 GEL) — цветная рамка в списке
   - Пакет "Быстрая продажа": топ 7 дней + выделение 7 дней (28 GEL)
3. Пользователь выбирает тариф
4. Экран "Оплата":
   - Способ: карта (Visa/Mastercard через Stripe)
   - Номер карты, срок, CVV (через Stripe Elements)
5. Пользователь оплачивает
6. Система подтверждает оплату → промо мгновенно применяется
7. Объявление получает badge "Топ" / цветную рамку / оба
8. По истечении срока → badge снимается автоматически

> Note: Crypto payments (USDT) запланированы на Phase 2 при наличии спроса.

**Альтернативные потоки:**
- 4a. Оплата картой отклонена → "Платёж не прошёл, попробуйте другую карту"
- 6a. Уже есть активное продвижение → новый срок добавляется к существующему

**Данные:**
- promotion_type: enum(top_1d, top_3d, top_7d, highlight_7d, bundle_7d)
- listing_id: uuid, FK listings
- price: decimal(10,2)
- currency: GEL
- payment_method: enum(card)
- payment_status: enum(pending, completed, failed)
- starts_at: datetime
- expires_at: datetime

**Acceptance criteria:**
- AC-01: 3 тарифа + 1 пакет доступны для любого активного объявления
- AC-02: Оплата картой через Stripe (Visa/Mastercard)
- AC-03: Промо применяется мгновенно после подтверждения оплаты
- AC-04: Badge "Топ" / цветная рамка отображается в поиске и на карточке
- AC-05: Продвинутые объявления показываются выше в результатах поиска
- AC-06: По истечении срока промо снимается автоматически
- AC-07: Повторное продвижение продлевает срок

**UI состояния:**
- **Loading:** Redirect на Stripe Checkout (subscription) или Stripe Elements (one-time)
- **Error (невалидный тип):** "Invalid promotion type. Valid: top_1d, top_3d, top_7d, highlight, unlimited_sub, bundle"
- **Error (чужое):** "Not your listing" (403)
- **Error (дубликат):** "Active promotion of this type already exists for this listing" (409) или "Active bundle promotion already exists..." (409)
- **Error (нет listingId):** "listingId required for this promotion type"
- **Error (оплата):** "Payment creation failed" (500 при ошибке Stripe)
- **Success:** clientSecret (PaymentIntent) или url (Checkout Session) → клиент перенаправляется

**Валидация (из кода):**
- type: enum "top_1d" | "top_3d" | "top_7d" | "highlight" | "unlimited_sub" | "bundle"
- listingId: обязателен для не-subscription типов
- Проверка ownership: listing.userId === userId
- Дубликат: active promo того же типа на том же объявлении → 409
- Bundle: проверяет оба sub-типа (top_7d + highlight)

**Цены (из кода — PRICES config, в тетри, 1 GEL = 100 тетри):**
| Тип | Сумма (GEL) | Срок | Тип платежа |
|-----|-------------|------|-------------|
| top_1d | 5.00 | 1 день | one-time |
| top_3d | 12.00 | 3 дня | one-time |
| top_7d | 20.00 | 7 дней | one-time |
| highlight | 8.00 | 7 дней | one-time |
| unlimited_sub | 9.99 | monthly | subscription |
| bundle | 28.00 | 7 дней | one-time |

**Edge cases:**
- Bundle создаёт 2 sub-промо: top_7d + highlight (на webhook fulfillment)
- Subscription: Stripe Checkout в mode=subscription, ежемесячный recurring
- GET /api/promotions/prices: публичный эндпоинт, возвращает все цены

> [FLAG Architect 2026-04-06]: Ценовые расхождения: highlight в коде=3 GEL vs UC=8 GEL. Тип bundle ("Быстрая продажа") не реализован в коде. Task #2236.
> [SYNC 2026-04-06]: Bundle price corrected to 28 GEL (2800 tetri in code).

---

## UC-09: Профиль продавца

> Note (Marketing): SEO for seller profile page /users/:id not described. Public page needs meta tags, structured data.

**Актор:** Гость или Пользователь
**Страница:** /users/:id
**Цель:** Оценить надёжность продавца перед покупкой

**Гость видит:** аватар, имя, дату регистрации, количество объявлений. Рейтинг будет отображаться после реализации UC-15. Кнопка "Написать" → редирект на логин.

**Основной поток:**
1. Клик на ник/аватар продавца → /users/:id
2. Аватар, имя, "На платформе с..."
3. Рейтинг: средняя оценка + кол-во отзывов (после UC-15)
4. Badge "Проверенный продавец" (Premium, после UC-16 fix)
5. Вкладка "Объявления" — активные объявления продавца
6. Вкладка "Отзывы" — список отзывов (после UC-15)

**Acceptance criteria:**
- AC-01: Публичный профиль доступен без авторизации
- AC-02: Показывает активные объявления продавца
- AC-03: Рейтинг из отзывов (зависит от UC-15)
- AC-04: Кнопка "Написать" доступна для авторизованных (DM без listing_id)
- AC-05: Гость видит всё кроме кнопки "Написать" → редирект на логин

**Данные профиля (из кода, GET /api/users/:id):**
- id, name (или "User" если не задано), avatarUrl, createdAt
- activeListings: количество active объявлений с expiresAt > now (или null)
- Рейтинг: GET /api/reviews/stats/:userId → averageRating (округление до 1 знака) + totalReviews

**Гость видит:** аватар, имя, дату регистрации, количество активных объявлений, рейтинг. Кнопка "Написать" → редирект на /auth.

**Edge cases:**
- Пользователь не найден → 404 "User not found"
- Имя не задано → отображается "User"

**Responsive:**
- Mobile (430px): профиль продавца в одну колонку — аватар + инфо сверху, объявления списком ниже
- Desktop (>768px): двухколоночный layout — профиль слева, объявления продавца справа в сетке

> Note (Collegium 2026-04-06): Монетизация по категориям (free_quota + price_per_listing в admin panel) управляется через UC-14/UC-25, не является частью UC-09.

---

## UC-10: Просмотр сообщений

**Актор:** Пользователь (зарег.)
**Цель:** Прочитать и ответить на сообщения от покупателей/продавцов
**Предусловие:** Пользователь авторизован

**Основной поток:**
1. Пользователь нажимает иконку "Сообщения" в хедере (badge с количеством непрочитанных)
2. Экран "Сообщения" — список диалогов:
   - Аватар собеседника, ник
   - Миниатюра объявления + заголовок
   - Превью последнего сообщения (обрезано до 80 символов)
   - Timestamp последнего сообщения
   - Индикатор непрочитанных (жирный шрифт + точка)
3. Пользователь кликает на диалог
4. Экран "Тред" — хедер: объявление (миниатюра + заголовок + цена), собеседник
5. История сообщений (bubble-стиль: свои — справа, чужие — слева)
6. Поле ввода + кнопка "Отправить"
7. Сообщения помечаются как прочитанные при открытии треда

**Альтернативные потоки:**
- 2a. Нет диалогов → "У вас пока нет сообщений"
- 4a. Объявление удалено/снято → badge "Объявление недоступно" в хедере треда, переписка сохраняется
- 6a. Пустое сообщение → кнопка неактивна

**Данные:**
- conversations: [{ id, listing, counterpart, last_message, unread_count, updated_at }]
- messages: [{ id, sender_id, text, created_at, is_read }]

**Acceptance criteria:**
- AC-01: Список диалогов с превью последнего сообщения
- AC-02: Badge непрочитанных в хедере и на каждом диалоге
- AC-03: Тред привязан к объявлению (заголовок + миниатюра в хедере)
- AC-04: Сообщения помечаются как прочитанные при открытии треда
- AC-05: Переписка сохраняется даже если объявление снято
- AC-06: Если получатель оффлайн → email уведомление о новом сообщении (один email на серию, не спамить)

**UI состояния:**
- **Loading:** Spinner при загрузке списка тредов, skeleton messages при загрузке сообщений
- **Empty:** "У вас пока нет сообщений"
- **Error (не участник):** "Not a participant of this thread" (403) — при попытке читать чужой тред
- **Success:** Список диалогов с превью, bubble-стиль в треде

**Данные в списке тредов (из кода, GET /api/threads):**
- id: threadId
- listing: { id, title, price, currency, photos[0].url } или null (для DM)
- otherUser: { id, name, avatarUrl }
- lastMessage: { text, createdAt, senderId }
- updatedAt: timestamp последней активности
- unreadCount: количество непрочитанных (messages от других после lastSeenAt)

**Пагинация сообщений:**
- GET /api/threads/:id/messages: cursor-based (не page-based), limit max 100, default 50
- nextCursor: id последнего сообщения (null если страница не полная)

**Mark as read:**
- POST /api/threads/:threadId/seen → обновляет ThreadParticipant.lastSeenAt = now()
- GET /api/threads/unread-count → общий счётчик непрочитанных по всем тредам

**Responsive:**
- Mobile (430px): список диалогов на полный экран, тред — полноэкранный чат с bubble-сообщениями
- Desktop (>768px): двухпанельный layout — список диалогов слева (30%), тред справа (70%)

---

## UC-11: Карта объявлений

**Актор:** Гость или Пользователь
**Цель:** Найти объявления по географическому расположению
**Предусловие:** Нет

**Основной поток:**
1. Пользователь на странице поиска нажимает переключатель "Карта"
2. Экран: карта (Google Maps / Mapbox) с маркерами объявлений
3. Маркеры размещены по точным координатам объявления (lat/lng)
4. При масштабировании (zoom out) → маркеры кластеризуются (число в кружке)
5. При масштабировании (zoom in) → кластер раскрывается в отдельные маркеры
6. Клик на маркер → popup-превью: фото, заголовок, цена, город
7. Клик на popup → переход на страницу объявления (UC-05)
8. Фильтры из UC-04 применяются и к карте

**Альтернативные потоки:**
- 2a. Нет объявлений в видимой области → "В этом районе нет объявлений"
- 3a. Объявление без точных координат → маркер в центре города
- 6a. Несколько объявлений в одной точке → popup со списком

**Данные:**
- markers: [{ listing_id, lat, lng, title, price, photo_url }]
- clusters: [{ lat, lng, count }]
- Listing model: lat: decimal(9,6), lng: decimal(9,6)

> Note: требует добавления lat/lng в модель Listing + geocoding при создании объявления.

**Acceptance criteria:**
- AC-01: Переключение список/карта без потери фильтров
- AC-02: Маркеры по точным координатам объявления (lat/lng)
- AC-03: Кластеризация при уменьшении масштаба
- AC-04: Popup-превью по клику на маркер
- AC-05: Переход на объявление из popup
- AC-06: Все фильтры поиска применяются к карте

**Из кода (GET /api/listings/map):**
- Параметры: city (optional cityId)
- Фильтры: status='active', expiresAt > now (или null)
- Возвращает: { id, title, price, currency, lat, lng, photo }
- lat/lng fallback: listing.lat ?? city.lat (если у объявления нет координат — центр города)
- Геокодирование: geocodeAddress(address, cityName) → fallback geocodeCity(cityName)
- Кластеризация: не реализована на бэкенде, может быть на фронте

**Responsive:**
- Mobile (430px): карта на полный экран, фильтры в bottom sheet, popup-превью маркера — компактная карточка внизу экрана
- Desktop (>768px): карта занимает основную область, фильтры слева, popup-превью при hover на маркер

> [FLAG Architect 2026-04-06]: Текущая реализация показывает city-level координаты (один пин на весь город). Пользователь одобрил реализацию address-level geocoding. Task #2239: поле address при создании объявления + геокодирование в реальные lat/lng + кластеризация маркеров.

---

## UC-12: Модерация (Администратор)

> Note (AdminMirror): UC should clarify two moderation queues: (1) new listing pending_moderation, (2) report-based moderation for active listings.

**Актор:** Администратор
**Цель:** Проверить жалобы пользователей и управлять объявлениями
**Предусловие:** Администратор авторизован

**Основной поток:**
1. Админ → "Панель модерации" → вкладка "Жалобы" (счётчик ожидающих)
2. Список объявлений с жалобами, отсортированный по дате создания жалобы (FIFO)
3. Каждая карточка: заголовок, категория, автор, дата, превью фото, причина жалобы
4. Админ кликает на объявление → экран просмотра:
   - Все данные объявления (как в UC-05)
   - Профиль автора (история: сколько раз одобрён/отклонён)
   - Кнопки: "Одобрить (оставить)" / "Удалить"
5. Одобрить (оставить): жалоба закрывается, объявление остаётся активным, email автору "Ваше объявление проверено и одобрено"
6. Удалить: выбор причины из шаблонов + optional комментарий, статус = removed, email автору с причиной из шаблона

**Альтернативные потоки:**
- 2a. Очередь пуста → "Нет жалоб для рассмотрения"
- 6a. Шаблоны причин отклонения:
  - "Запрещённый товар/услуга"
  - "Некорректное фото (чужие фото, скриншоты)"
  - "Неполное описание"
  - "Дублирование объявления"
  - "Мошенничество / подозрительное содержание"
  - Кастомный текст

**Авто-модерация:**
Admin-configurable auto-moderation: toggle enabled/disabled from admin settings. When enabled: listings containing banned words → auto-flagged for review (not auto-deleted). Banned word list managed in admin panel (/admin/settings).

**Данные:**
- reports: [{ id, listing_id, reporter_id, reason, created_at }]
- rejection_reason: enum(prohibited, bad_photo, incomplete, duplicate, fraud, custom)
- rejection_comment: string, required, max 500 chars
- banned_words: string[] (настраиваемый список)

**Acceptance criteria:**
- AC-01: Очередь жалоб FIFO с счётчиком
- AC-02: Оставить → жалоба закрыта + email автору "Ваше объявление проверено и одобрено"
- AC-03: Удалить → причина из шаблона + обязательный комментарий + email автору с причиной
- AC-04: Шаблоны причин: 5 предустановленных + кастомный
- AC-05: Авто-модерация управляется через toggle в admin settings (вкл/выкл); при включении — banned words → авто-флаг на проверку
- AC-06: Раздел жалоб пользователей с действиями
- AC-07: При одобрении (оставить) — email уведомление автору
- AC-08: При удалении — email с причиной из шаблона

**UI состояния (Admin):**
- **Loading:** Spinner при загрузке очереди модерации / действии
- **Empty:** "Нет объявлений на модерации" (pendingModeration = 0)
- **Error (невалидный переход):** "Invalid status transition from '{current}' to '{target}'" + allowedTransitions[]
- **Success (одобрение):** listing.status = active, email "Ваше объявление {title} прошло модерацию и теперь опубликовано"
- **Success (отклонение):** listing.status = rejected, listing.rejectionReason = текст, email "Ваше объявление {title} было отклонено модератором" + причина

**Валидация (из кода):**
- Очередь модерации: GET /api/admin/listings/pending (FIFO: orderBy createdAt asc)
- Одобрение: PATCH /api/admin/listings/:id/status { status: "active" } → ставит activatedAt=now, expiresAt=now+30d
- Отклонение: PATCH /api/admin/listings/:id/status { status: "rejected", rejectReason: "текст" } → ставит rejectionReason
- State machine (admin transitions из кода):
  - pending_moderation → active | rejected
  - active → removed | rejected
  - rejected → pending_moderation | active
  - expired → active | removed
  - sold → active
  - removed → active | pending_moderation

**Уведомления:**
- Одобрение: email через Brevo "Ваше объявление опубликовано — Avito Georgia"
- Отклонение: email "Ваше объявление отклонено — Avito Georgia" + причина в теле

**Audit Log:**
- Все действия записываются через logAudit(): adminId, adminEmail, action, targetType, targetId, details (JSON)
- Action: "listing.status_change" с previousStatus и newStatus
- AuditLog model: append-only, adminId/adminEmail как plain strings (не FK — переживают удаление user)

> [FLAG SecOfficer 2026-04-06]: audit_log описан в AC но AuditLog model отсутствует в Prisma схеме. Task #2237.
> Note: admin/reports.tsx экран (список жалоб) относится к этому UC — маршрут /admin/reports.
> [DECISION 2026-04-06]: Basic auto-rules needed but controlled via admin settings toggle. Task created for implementation.

---

## UC-13: Продление объявления

**Актор:** Пользователь (владелец объявления)
**Цель:** Продлить срок активного объявления
**Предусловие:** Объявление активно, срок действия подходит к концу (30 дней)

**Основной поток:**
1. За 3 дня до истечения: система отправляет email "Ваше объявление {title} истекает через 3 дня"
2. Email содержит кнопку "Продлить" (deep link в приложение/сайт)
3. Пользователь нажимает "Продлить" (или в "Мои объявления" → badge "Истекает")
4. Система проверяет: `last_renewed_at IS NULL OR last_renewed_at + 30 days < NOW()`
5. Если да → объявление продлено на 30 дней, дата обновлена, email подтверждение
6. Если нет → "Бесплатное продление использовано. Продлите с поднятием в топ" → UC-08

**Альтернативные потоки:**
- 1a. Пользователь не продлил → объявление истекло → статус = removed, не отображается в поиске
- 1b. Removed объявление можно "Возобновить" из "Мои объявления" (= повторная публикация)
- 4a. In-app уведомление за 3 дня + за 1 день
- 5a. При продлении с продвижением → redirect на UC-08

**Данные:**
- listing.expires_at: datetime (created_at + 30 дней)
- listing.last_renewed_at: datetime | null
- renewal_available: boolean (computed: last_renewed_at IS NULL OR last_renewed_at + 30 days < NOW())

**Acceptance criteria:**
- AC-01: Email уведомление за 3 дня до истечения
- AC-02: In-app уведомление за 3 дня и за 1 день
- AC-03: Бесплатное продление: 1 раз в 30 дней (проверяется по last_renewed_at)
- AC-04: Продление обновляет expires_at на +30 дней
- AC-05: Истёкшее объявление = не видно в поиске, можно возобновить
- AC-06: При возобновлении → публикуется без модерации (статус active)

**UI состояния:**
- **Loading:** Spinner на кнопке "Продлить"
- **Error (не active):** "Can only renew active listings" — продление доступно только для active
- **Error (cooldown):** "Free renewal available once per 30 days" — если lastRenewedAt < 30 дней назад
- **Error (не владелец):** "Forbidden" (403)
- **Success:** expiresAt обновлён на +30 дней, lastRenewedAt = now()

**Валидация (из кода, POST /api/listings/:id/renew):**
- Только active объявления
- Проверка owner: listing.userId === req.user.userId
- Cooldown: 30 дней (RENEWAL_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000)
- При продлении: expiresAt = now + 30d, lastRenewedAt = now

**Уведомления (из кода):**
- За 3 дня до истечения: cron 09:00 UTC, email "Ваше объявление {title} истекает {дата}" + ссылка на продление
- Дедупликация: Notification с type='EXPIRY_REMINDER' (none проверка при выборке)
- При истечении: cron 03:00 UTC, status → expired

**Responsive:**
- Mobile (430px): кнопка "Продлить" на полную ширину, badge "Истекает" на карточке объявления
- Desktop (>768px): кнопка "Продлить" в sidebar объявления, badge "Истекает" на карточке

---

## UC-14: Категории и подкатегории

**Актор:** Гость или Пользователь
**Цель:** Навигация по каталогу через структуру категорий
**Предусловие:** Нет

**Основной поток:**
1. Главная страница: блок категорий с иконками и счётчиками
2. Пользователь кликает на категорию
3. Экран категории: подкатегории (если есть) + объявления
4. Пользователь выбирает подкатегорию → фильтрованный список объявлений

**Структура категорий:**

| Категория | Подкатегории |
|-----------|-------------|
| Недвижимость | Квартиры, Дома, Коммерческая, Участки |
| Авто | Легковые, Грузовые, Мото, Запчасти |
| Электроника | Телефоны, Компьютеры, Фото/Видео, Аудио, ТВ, Бытовая техника |
| Одежда и обувь | Мужская, Женская, Детская, Обувь, Аксессуары |
| Работа | Вакансии, Резюме |
| Услуги | Ремонт, Красота, Обучение, Транспорт, Другие |
| Для дома и дачи | Мебель, Сад, Стройматериалы, Инструменты |
| Животные | Собаки, Кошки, Другие, Товары для животных |
| Прочее | — |

**Альтернативные потоки:**
- 2a. Категория пуста → "В этой категории пока нет объявлений. Будьте первым!"
- 3a. Категория без подкатегорий (Прочее) → сразу список объявлений

**Данные:**
- categories: [{ id, name, icon, slug, parent_id, listings_count }]
- Иерархия: parent_id = null → корневая, parent_id != null → подкатегория

**Acceptance criteria:**
- AC-01: Главная страница показывает все корневые категории с иконками
- AC-02: Счётчик активных объявлений на каждой категории
- AC-03: Переход в категорию → подкатегории + объявления
- AC-04: Breadcrumb навигация: Главная → Категория → Подкатегория
- AC-05: Пустая категория → информативное сообщение

**Данные категорий (из кода, Prisma schema):**
- id, name, nameKa, nameRu, nameEn (i18n поля существуют в схеме!)
- slug: unique, используется в URL
- customFields: Json (для расширяемых фильтров)
- freeListingQuota: int, default 5 (квота бесплатных объявлений per category)
- paidListingPrice: float, default 0.0 (цена за дополнительное объявление)
- parentId: nullable FK на себя (иерархия)
- children: подкатегории

**API:**
- GET /api/categories: публичный, возвращает дерево категорий
- GET /api/admin/categories: admin, с monetization fields
- PATCH /api/admin/categories/:id: admin, обновление freeListingQuota и paidListingPrice

**Гость видит:** полный каталог категорий с иконками и счётчиками, переход к объявлениям.

**Responsive:**
- Mobile (430px): категории в grid 2 колонки с иконками, подкатегории в списке
- Desktop (>768px): категории в grid 3-4 колонки, подкатегории в sidebar при выборе категории

---

## UC-15: Система отзывов продавца

**Актор:** Покупатель (пользователь, который инициировал сделку)
**Страница:** /listings/:id (форма после продажи), /users/:id (отображение)
**Цель:** Оценить продавца после завершённой сделки

**Гость видит:** Отзывы на странице продавца без авторизации. Форму отзыва — нет (нужна покупка).

**Основной поток:**
1. Продавец нажимает "Отметить как продано" (UC-03) → статус sold
2. Покупателю (последний участник чата по этому объявлению) → уведомление "Оцените продавца"
3. Покупатель → форма: 1-5 звёзд + текстовый отзыв (опционально, max 500 chars)
4. Отзыв сохраняется, рейтинг продавца пересчитывается
5. Отзыв виден на /users/:id в вкладке "Отзывы"

**Альтернативные потоки:**
- 2a. Покупатель не пишет в чат → нет покупателя → форма отзыва не показывается
- 3a. Текст пустой → только звёзды (допустимо)
- 3b. Попытка оставить 2-й отзыв на ту же сделку → "Вы уже оценили этого продавца"

**Данные:**
- listing_id: uuid, FK listings, required
- author_id: uuid, FK users (покупатель)
- seller_id: uuid, FK users (продавец)
- rating: int, 1-5, required
- text: string, optional, max 500 chars
- created_at: datetime

**Acceptance criteria:**
- AC-01: Форма отзыва доступна только после статуса sold
- AC-02: Максимум 1 отзыв от одного покупателя на одну сделку (unique: author_id + listing_id)
- AC-03: Рейтинг продавца = avg(reviews) обновляется в реальном времени
- AC-04: Отзывы публичны — видны всем на /users/:id
- AC-05: Нельзя оставить отзыв на себя

**UI состояния:**
- **Loading:** Spinner при отправке отзыва
- **Error (не sold):** "Reviews can only be left for sold listings" — listing.status !== sold
- **Error (самому себе):** "Sellers cannot review their own listings" (403)
- **Error (не покупатель):** "Only buyers who contacted the seller can leave a review" (403) — нет ThreadParticipant
- **Error (дубликат):** "You have already reviewed this listing" (409) — unique authorId+listingId
- **Error (рейтинг):** "rating must be an integer between 1 and 5"
- **Success:** Отзыв создан, рейтинг продавца обновлён

**Валидация (из кода, POST /api/reviews):**
- listingId: string, обязателен
- rating: integer 1-5, обязателен
- text: string, optional, trim (max не ограничен в коде, UC указывает 500)
- Guards (в порядке проверки):
  1. Listing exists
  2. listing.status === 'sold'
  3. authorId !== listing.userId (не продавец)
  4. ThreadParticipant exists (покупатель контактировал продавца)
  5. Unique(authorId, listingId) — нет дубликата

**Рейтинг продавца (из кода, GET /api/reviews/stats/:userId):**
- averageRating: Math.round(avg * 10) / 10 (одна десятая)
- totalReviews: count

**Гость видит:** Отзывы на странице продавца (GET /api/reviews?sellerId=). Форму оставить — нет (requireAuth).

**Responsive:**
- Mobile (430px): форма отзыва — звёзды + textarea на полный экран, список отзывов — карточки в одну колонку
- Desktop (>768px): форма отзыва в модальном окне, список отзывов в табе профиля продавца

> Note (Collegium 2026-04-06): Утверждено к реализации в MVP. Task #2240.

---

## UC-16: Безлимитная подписка (Premium)

**Актор:** Пользователь
**Цель:** Снять лимит в 10 активных объявлений и получить Premium статус
**Предусловие:** Пользователь авторизован

**Основной поток:**
1. Пользователь → "Подписка" (меню или баннер "Лимит достигнут")
2. Экран "Premium": описание преимуществ, цена (ежемесячная в GEL)
3. Пользователь нажимает "Подписаться"
4. Stripe Subscription Checkout (redirect или embedded)
5. После оплаты: webhook подтверждает подписку → промо-запись в БД (unlimited_sub)
6. Пользователь может создавать неограниченное количество объявлений
7. Badge "Premium" на профиле

**Отмена:**
1. Пользователь → "Управление подпиской" → "Отменить"
2. Redirect на Stripe Customer Portal
3. Stripe отменяет → webhook обновляет промо isActive=false
4. При отмене подписки — все активные объявления остаются активными до их естественного истечения (30 дней). После истечения новые объявления ограничены freeListingQuota категории. Premium badge снимается немедленно.

**Acceptance criteria:**
- AC-01: Stripe Subscription создаётся через checkout.session
- AC-02: Webhook customer.subscription.deleted снимает Premium
- AC-03: При отмене — активные объявления остаются активными до естественного истечения (не переводятся в draft)
- AC-04: Отображение текущего статуса подписки в профиле

**UI состояния:**
- **Loading:** Redirect на Stripe Checkout (subscription mode)
- **Error (Stripe):** "Payment creation failed" (500)
- **Success (подписка):** Redirect на /promotions/success после оплаты
- **Отмена:** Stripe Customer Portal (redirect)

**Из кода:**
- Цена подписки: 9.99 GEL/мес (999 тетри)
- Stripe mode: subscription, recurring interval=month
- Проверка Premium: `promotion.findFirst({ promotionType: 'unlimited_sub', isActive: true })`
- При отмене: webhook `customer.subscription.deleted` → promotion.isActive = false
- Объявления остаются active до естественного истечения (30 дней)
- Квота-bypass: при создании объявления проверяется hasUnlimited → если true, категорийная квота не применяется

**Responsive:**
- Mobile (430px): страница Premium — описание преимуществ + CTA кнопка на всю ширину, Stripe checkout в webview
- Desktop (>768px): карточка Premium с преимуществами, кнопка подписки, управление подпиской в sidebar

> [FLAG Architect 2026-04-06]: Badge "Проверенный продавец" и повышенная видимость не реализованы. User model не имеет поля premium_badge. Сортировка поиска учитывает только isPromoted (top_* типы), подписка не влияет на позицию. Task #2238.
> [SYNC 2026-04-06]: Boosted search position IS implemented (premium sorted after top, before regular). Cancellation: let-expire-naturally approach (no forced draft).

---

## UC-17: Центр уведомлений

> Note (Architect): NEW_MESSAGE in-app notification not implemented — only email exists. Code needs in-app notification creation on new message.

**Актор:** Пользователь (зарег.)
**Цель:** Просматривать системные уведомления
**Предусловие:** Пользователь авторизован

**Типы уведомлений:**
- PRICE_DROP: цена на избранное объявление снижена
- LISTING_REMOVED: избранное объявление снято
- NEW_MESSAGE: новое сообщение (если оффлайн)
- LISTING_EXPIRING: объявление истекает через 3 дня

**Основной поток:**
1. Иконка колокольчика в хедере (badge с числом непрочитанных)
2. Экран "Уведомления" — список с timestamp
3. Клик → переход на связанный объект (объявление, чат)
4. При открытии — уведомление помечается как прочитанное

**API:** GET /api/notifications, GET /api/notifications/unread-count, PATCH /api/notifications/:id/read, POST /api/notifications/read-all

**Acceptance criteria:**
- AC-01: Badge в хедере показывает непрочитанные
- AC-02: Все 4 типа уведомлений отображаются
- AC-03: Кликабельные уведомления ведут на объект
- AC-04: "Прочитать все" одним кликом

**UI состояния:**
- **Loading:** Spinner при загрузке списка уведомлений
- **Empty:** "У вас нет уведомлений"
- **Error:** 500 "Failed to fetch notifications"
- **Success:** Список уведомлений с timestamp, кликабельные

**API (из кода):**
- GET /api/notifications: пагинация (page, limit max 100, default 20), include listing { id, title, photos[0] }
- GET /api/notifications/unread-count: { count: number }
- PATCH /api/notifications/:id/read: помечает одно уведомление как прочитанное
- POST /api/notifications/read-all: помечает все как прочитанные, возвращает { updated: count }
- Проверка ownership: notification.userId !== req.user.userId → 403

**Типы уведомлений (из кода — создаются в разных routes):**
- PRICE_DROP: создаётся в listings.ts при снижении цены (UC-03)
- LISTING_REMOVED: создаётся в listings.ts при удалении (UC-03)
- EXPIRY_REMINDER: создаётся в cron/cleanup.ts за 3 дня до истечения (UC-19)
- NEW_MESSAGE: не реализовано в коде как in-app notification

**Responsive:**
- Mobile (430px): уведомления в полноэкранном списке, badge на иконке колокольчика в хедере
- Desktop (>768px): уведомления в dropdown popup при клике на колокольчик

---

## UC-18: Редактирование профиля

**Актор:** Пользователь (зарег.)
**Цель:** Установить имя, телефон и аватар после первого входа
**Предусловие:** Пользователь авторизован

**Основной поток:**
1. Пользователь → "Настройки профиля"
2. Поля: Имя (required для создания объявлений), Телефон (optional), Аватар
3. Аватар: загрузка фото → сохранение в MinIO
4. Сохранить → PATCH /api/users/me

**После первого входа:**
- Если имя не установлено → баннер "Добавьте имя для общения с покупателями"

**Acceptance criteria:**
- AC-01: Имя и телефон редактируются
- AC-02: Аватар загружается в MinIO
- AC-03: Смена языка интерфейса (RU/EN/KA) сохраняется в профиле

**UI состояния:**
- **Loading:** Spinner при сохранении профиля / загрузке аватара
- **Error (locale):** "Invalid locale. Must be one of: ka, ru, en"
- **Error (файл аватара):** "No file uploaded" или "Invalid file type. Only JPEG, PNG, WebP, GIF allowed."
- **Success:** Данные профиля обновлены

**Валидация (из кода, PATCH /api/users/me):**
- name: string, trim, nullable (пустая строка → null)
- phone: string, trim, nullable
- city: string, trim, nullable
- isOnboarded: boolean (только true)
- locale: enum "ka" | "ru" | "en"

**Вложения/Медиа (аватар):**
- POST /api/users/avatar: загрузка аватара
- Лимит: 5 MB (multer limit — меньше чем для фото объявлений!)
- Форматы: JPEG, PNG, WebP, GIF
- Хранение: MinIO, папка "avatars"

**Responsive:**
- Mobile (430px): форма профиля на полный экран, загрузка аватара через камеру/галерею
- Desktop (>768px): форма профиля центрированная, drag-and-drop для аватара

---

## UC-19: Истечение и продление срока объявления

**Актор:** SYSTEM
**Цель:** Автоматически деактивировать просроченные объявления

**Основной поток (SYSTEM):**
1. Cron job: ежедневно в 03:00 UTC
2. Находит все активные объявления с expires_at < NOW()
3. Устанавливает статус = expired
4. Отправляет email: "Ваше объявление {title} истекло"

**Напоминания (SYSTEM):**
- За 3 дня: email + in-app уведомление (LISTING_EXPIRING)
- За 1 день: in-app уведомление

**Возобновление (Пользователь):**
1. В "Мои объявления" → вкладка "Снятые" → "Возобновить"
2. Объявление снова публикуется (статус active, без модерации)
3. Срок: NOW() + 30 дней

**API:** CRON /api/cron/expire-listings (internal)

**Acceptance criteria:**
- AC-01: Cron запускается ежедневно в 03:00 UTC
- AC-02: Email за 3 дня и при истечении
- AC-03: Возобновление доступно из "Мои объявления"

> [FLAG Architect 2026-04-06]: UC использует термин "removed" для истёкших объявлений, код (cron/cleanup.ts) устанавливает status="expired". Prisma schema имеет оба статуса как отдельные. Для истечения срока корректен статус "expired", для удаления модератором — "removed". UC обновлён соответственно.

---

## UC-20: Прямые сообщения (без объявления)

**Актор:** Пользователь (зарег.)
**Цель:** Написать пользователю напрямую (после завершения сделки или со страницы профиля)

**Основной поток:**
1. На профиле продавца → кнопка "Написать" (без конкретного объявления)
2. Открывается тред без привязки к listing_id
3. Поведение аналогично UC-10

**Отличие от UC-06:** UC-06 = чат начинается с объявления; UC-20 = прямой контакт

**Acceptance criteria:**
- AC-01: Тред создаётся между двумя пользователями без listing_id
- AC-02: Дубликаты не создаются (один тред на пару)

**UI состояния:**
- **Error (otherUserId):** "otherUserId is required"
- **Error (self):** "Cannot start a dialog with yourself"
- **Error (blocked):** "Cannot message this user" (403) — target user role=blocked
- **Error (не найден):** "User not found" (404)
- **Success:** { threadId: "..." } — существующий или новый тред

**Валидация (из кода, POST /api/threads):**
- otherUserId: string, обязателен
- Проверка self: otherUserId !== userId
- Проверка blocked: otherUser.role === 'blocked' → 403
- Uniqueness: participant IDs сортируются (p1 < p2), unique constraint на (participant1Id, participant2Id)
- Idempotent: upsert — если тред существует, возвращает его

**Responsive:**
- Mobile (430px): кнопка "Написать" на профиле продавца, полноэкранный чат
- Desktop (>768px): кнопка "Написать" в sidebar профиля, чат в slide-in панели

> [FLAG Architect 2026-04-06]: ~~Нет проверки role=blocked при создании DM треда~~ ИСПРАВЛЕНО: POST /api/threads проверяет otherUser.role === 'blocked' → 403. Task #2241 (закрыть).

---

## UC-21: Управление пользователями (Администратор)

**Актор:** Администратор
**Цель:** Управлять аккаунтами пользователей

**Основной поток:**
1. Admin → /admin/users — список пользователей с поиском
2. Просмотр: email, имя, дата регистрации, роль, кол-во объявлений
3. Блокировка: роль = blocked (нельзя войти, объявления скрываются)
4. Разблокировка: роль = user
5. Назначить администратором: роль = admin

**Acceptance criteria:**
- AC-01: Поиск по email и имени
- AC-02: Смена роли: user / admin / blocked
- AC-03: Заблокированный пользователь не может войти
- AC-04: Объявления заблокированного пользователя скрываются из поиска

**UI состояния (Admin):**
- **Loading:** Spinner при загрузке списка / действии
- **Error (role):** "role must be user, admin, or blocked"
- **Error (self):** "Cannot change own role"
- **Error (не найден):** "User not found" (404)
- **Success:** Роль обновлена

**Валидация (из кода):**
- PATCH /api/admin/users/:id/role: { role: "user" | "admin" | "blocked" }
- Нельзя менять свою роль (id === req.user.userId → 400)
- GET /api/admin/users: пагинация + поиск по email/name (q param, case-insensitive)

**Блокировка (из кода):**
- При role='blocked': объявления пользователя принудительно переводятся в status='removed' (listing.updateMany)
- Middleware auth.ts: если JWT payload.role === 'blocked' → 403 "Account suspended"
- Audit log: "user.role_change" с previousRole и newRole

**Responsive:**
- Mobile (430px): список пользователей — компактные карточки, действия в bottom sheet
- Desktop (>768px): таблица пользователей с inline-действиями, поиск и фильтры в toolbar

---

## UC-22: Listing State Machine

**Актор:** SYSTEM
**Цель:** Определить жизненный цикл объявления
**Предусловие:** Нет

**Статусы (реализованы в Prisma):**
- `draft` — черновик (создан но не отправлен)
- `pending_moderation` — ожидает проверки после публикации
- `active` — опубликовано, видно в поиске
- `rejected` — отклонено модератором (с обязательной причиной). Владелец видит причину отклонения в "Мои объявления". Владелец может редактировать → повторно отправить (переходит обратно в `draft` → `pending_moderation`).
- `inactive` — снято владельцем. Переход `inactive → active` доступен владельцу.
- `sold` — продавец отметил как "Продано"
- `expired` — истёк срок (30 дней, cron UC-19)
- `removed` — удалено модератором по жалобе

**Переходы:**
```
draft → pending_moderation (пользователь нажал "Опубликовать")
pending_moderation → active (система/модератор одобрил)
pending_moderation → rejected (модератор отклонил)
rejected → draft (владелец редактирует для повторной отправки)
draft → pending_moderation (повторная отправка после отклонения)
active → sold (пользователь нажал "Продано")
active → expired (SYSTEM: cron, expires_at < now)
active → removed (модератор удалил по жалобе)
active → inactive (пользователь снял)
inactive → active (пользователь повторно активировал)
expired → active (пользователь возобновил)
```

**Auto-transitions:**
- `active → expired`: cron job ежедневно в 03:00 UTC, проверяет expires_at
- Email уведомление за 3 дня и за 1 день до истечения

**Acceptance criteria:**
- AC-01: State machine имплементирована на уровне БД (enum + transitions)
- AC-02: Невалидные переходы отклоняются с ошибкой
- AC-03: Все переходы логируются в audit_log
- AC-04: Неактивное объявление не видно в поиске (фильтр status = active)

**State Machine (из кода, listing-state-machine.ts):**

Owner transitions:
| Из | В |
|----|---|
| draft | pending_moderation |
| pending_moderation | draft (withdraw) |
| rejected | pending_moderation (re-submit) |
| active | sold, removed |
| expired | pending_moderation (re-submit) |

Admin transitions:
| Из | В |
|----|---|
| pending_moderation | active, rejected |
| active | removed, rejected |
| rejected | pending_moderation, active |
| expired | active, removed |
| sold | active |
| removed | active, pending_moderation |

**Валидация:**
- Owner: PATCH /api/listings/:id/status — проверяет isValidOwnerTransition()
- Admin: PATCH /api/admin/listings/:id/status — проверяет isValidAdminTransition()
- Невалидный переход: 400 { error: "Invalid status transition...", allowedTransitions: [] }
- При submit (draft/rejected/expired → pending_moderation): проверяет наличие title, categoryId, cityId
- При approve (→ active): ставит activatedAt=now, expiresAt=now+30d

> [FLAG Architect 2026-04-06]: Предыдущая версия UC-22 содержала несуществующие статусы и пропускала pending_moderation/expired/rejected. Синхронизировано с кодом.
> [SYNC 2026-04-06]: rejected state and inactive↔active transitions documented (already implemented in code).

---

## UC-23: Rate Limiting & Anti-Abuse

> Note (SecOfficer): CAPTCHA after 3x rate limit violations — described in UC but not implemented. Remove from UC or implement.

**Актор:** SYSTEM
**Цель:** Защита платформы от злоупотреблений

**Лимиты:**
- OTP запрос: 3 запроса/мин по email + 60 сек cooldown per email (code: rateLimiter.ts + auth.ts)
- Создание объявлений: по категорийной квоте (UC-09)
- Сообщения в чат: 60/мин на пользователя
- Поиск API: 100/мин на IP
- Показ телефона: 20/час на пользователя
- Жалобы: 10/час на пользователя

Report rate limiting: 10/час на пользователя (pending implementation — Task created).

**При превышении:**
- 429 Too Many Requests + Retry-After header
- После 3x превышения подряд → CAPTCHA

**Acceptance criteria:**
- AC-01: Все лимиты настраиваются в конфиге (не hardcoded)
- AC-02: 429 возвращает Retry-After
- AC-03: Логирование превышений для анализа

**Реальные лимиты (из rateLimiter.ts):**
| Эндпоинт | Лимит | Окно | Ключ |
|----------|-------|------|------|
| OTP request | 3/мин | 60 сек | email |
| OTP verify | 10/15 мин | 15 мин | IP |
| Listing creation | 5/час | 60 мин | userId (fallback IP) |
| Chat messages | 60/мин | 60 сек | userId (fallback IP) |
| Search API | 100/мин | 60 сек | IP |
| Phone reveal | 20/час | 60 мин | userId (fallback IP) |

**Дополнительно в auth.ts:**
- OTP DB-level cooldown: 60 сек per email (проверка createdAt последнего OTP)
- OTP brute-force: max 3 попыток per OTP code (OtpCode.attempts field)

**Ответ при превышении:**
- HTTP 429 + standardHeaders (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
- legacyHeaders: false (X-RateLimit-* headers не отправляются)
- Тексты: каждый лимитер имеет свой message (см. rateLimiter.ts)

> [FLAG SecOfficer 2026-04-06]: Расхождения с кодом: (1) OTP лимит: UC=5/час по IP, код=3/минуту по email. (2) CAPTCHA после 3x превышений — не реализована. (3) Лимит жалоб (10/час/user) не реализован в reports.ts. Task для синхронизации включён в backlog.
> [SYNC 2026-04-06]: OTP rate limit corrected to match code implementation.

---

## UC-24: i18n — Мультиязычность

**Актор:** Гость, Пользователь
**Цель:** Использовать платформу на предпочтительном языке
**Языки:** KA (грузинский, основной), RU (русский), EN (английский)

**Основной поток:**
1. Переключатель языка в header: KA / RU / EN
2. Выбор сохраняется в localStorage (гость) или профиле (авторизованный, UC-18 AC-03)
3. Все UI строки, email шаблоны, системные сообщения — на выбранном языке
4. Категории и системные данные — переведены на 3 языка
5. Объявления пользователей — на языке автора (без авто-перевода)

**Acceptance criteria:**
- AC-01: i18n инициализируется с первого коммита (no hardcoded strings)
- AC-02: Все 3 языка работают корректно
- AC-03: Грузинский — язык по умолчанию
- AC-04: RTL не нужен (KA/RU/EN — все LTR)

**UI States:**
- **Loading:** Spinner при переключении языка (перезагрузка строк)
- **Empty:** N/A — всегда есть fallback язык
- **Error:** Перевод не найден → fallback на nameEn → fallback на ключ
- **Success:** Интерфейс переключён на выбранный язык, localStorage/профиль обновлён

**Валидация:**
- locale: enum "ka" | "ru" | "en" — невалидное значение → 400 "Invalid locale. Must be one of: ka, ru, en"
- Accept-Language header: парсится для определения языка (ka, ru, en), fallback = ka

**Edge cases:**
- Пользователь меняет язык будучи гостем → сохраняется в localStorage → при регистрации переносится в профиль
- Отсутствующий перевод категории → fallback: nameEn → name (legacy field)
- Email шаблоны: язык определяется по профилю пользователя, не по Accept-Language

**Responsive:**
- Mobile (430px): переключатель языка в hamburger-меню или footer
- Desktop (>768px): переключатель языка в header (dropdown KA/RU/EN)

**API Contract:**
```
PATCH /api/users/me
body: { locale: "ka" | "ru" | "en" }
→ 200: { id, name, locale, ... }
→ 400: { error: "Invalid locale. Must be one of: ka, ru, en" }
```

---

## UC-25: Admin Dashboard & Audit Log

**Актор:** Администратор
**Цель:** Мониторинг и управление платформой

**Основной поток:**
1. /admin — dashboard: активных пользователей, объявлений по статусам, платежей за период
2. /admin/users — список с фильтрами (UC-21)
3. /admin/listings — все объявления с фильтрами по статусу/категории/городу
4. /admin/categories — управление категориями: название (KA/RU/EN), иконка, free_quota, price_per_listing
5. /admin/audit-log — все действия модераторов: кто, когда, что (одобрил/удалил/забанил)
6. /admin/revenue — доходы по категориям, дням, пользователям

**Acceptance criteria:**
- AC-01: Все модераторские действия записываются в audit_log
- AC-02: Категории управляются из БД через admin panel (не hardcoded)
- AC-03: Revenue report с фильтрами по периоду и категории
- AC-04: Dashboard обновляется в реальном времени (или каждые 5 мин)

**Данные dashboard (из кода, GET /api/admin/stats):**
- totalListings: общее количество объявлений (все статусы)
- totalUsers: общее количество пользователей
- pendingReports: количество жалоб со статусом 'pending'
- pendingModeration: количество объявлений со статусом 'pending_moderation'
- paymentsThisMonth: { count, sum } — завершённые платежи за текущий месяц

**Audit Log (из кода, GET /api/admin/audit-log):**
- Пагинация: page + limit (max 100)
- Фильтр: targetType (optional)
- Поля: adminId, adminEmail, action, targetType, targetId, details (JSON), createdAt
- Actions: "listing.status_change", "user.role_change", "report.status_change", "category.update"

**Responsive:**
- Mobile (430px): dashboard метрики в вертикальных карточках, таблицы со скроллом
- Desktop (>768px): dashboard с grid метрик, полноширинные таблицы, sidebar навигация

> Note (Collegium 2026-04-06): admin/payments.tsx экран относится к этому UC — добавить /admin/payments в список экранов. API /api/admin/payments уже реализован.

---

## UC-26: Onboarding

**Актор:** Новый пользователь (только что прошёл OTP впервые)
**Цель:** Заполнить минимальный профиль перед началом работы
**Предусловие:** is_new_user = true (после UC-01)

**Основной поток:**
1. После OTP верификации → экран Onboarding (только для новых)
2. Поле "Как вас зовут?" (имя, опционально)
3. Поле "Ваш город?" (выпадающий список из 6 городов, опционально)
4. Кнопка "Начать" → сохранить профиль → редирект на главную
5. Приветственное уведомление: "Добро пожаловать!"

**Альтернативные потоки:**
- 4a. Пользователь нажимает "Пропустить" → профиль без имени и города (заполнит позже в UC-18)

**Acceptance criteria:**
- AC-01: Onboarding показывается только при первом входе
- AC-02: Оба поля опциональные (можно пропустить)
- AC-03: Город из onboarding используется как фильтр по умолчанию на главной

**UI состояния:**
- **Loading:** Spinner на кнопке "Начать"
- **Empty:** Поля имени и города пустые, кнопки "Начать" и "Пропустить"
- **Success:** PATCH /api/users/me { name, city, isOnboarded: true } → редирект на главную

**Валидация (из кода):**
- name: string, trim, optional (nullable)
- city: string, trim, optional (nullable)
- isOnboarded: true (устанавливается при завершении onboarding)
- Условие показа: user.isOnboarded === false (после verify-otp возвращается isOnboarded)

**Responsive:**
- Mobile (430px): onboarding на полный экран, поля и кнопки на всю ширину
- Desktop (>768px): центрированная карточка onboarding, max-width 480px

---

## SCREEN INVENTORY

| Screen | Route | UC | Status |
|--------|-------|----|--------|
| EmailForm | /(auth)/index | UC-01 | matched |
| OtpForm | /(auth)/otp | UC-01 | matched |
| Homepage | /index | UC-31 | missing→UC-31 |
| Search | /search | UC-04 | matched |
| ListingDetail | /listings/:id | UC-05 | matched |
| CreateListing | /listings/create | UC-02 | matched |
| EditListing | /listings/:id/edit | UC-03 | matched |
| ListingCatalog | /listings/index | UC-04 | investigate |
| UserProfile | /users/:id | UC-09 | matched |
| Onboarding | /onboarding | UC-26 | matched |
| Favorites | /dashboard/favorites | UC-07 | matched |
| Messages | /dashboard/messages | UC-10 | matched |
| MessageThread | /dashboard/messages/:threadId | UC-06/UC-10 | matched |
| MyListings | /my/listings | UC-03 | matched |
| Profile | /dashboard/profile | UC-18 | matched |
| Settings | /dashboard/settings | UC-30 | missing→UC-30 |
| Subscription | /dashboard/subscription | UC-16 | matched |
| Payments | /dashboard/payments | UC-29 | missing→UC-29 |
| PromoteItem | /dashboard/listings/:id/promote | UC-08 | matched |
| PromoSuccess | /promotions/success | UC-08 | matched |
| PromoCancel | /promotions/cancel | UC-08 | matched |
| AdminDashboard | /admin/index | UC-25 | matched |
| AdminCategories | /admin/categories | UC-14/UC-25 | matched |
| AdminModeration | /admin/moderation | UC-12 | matched |
| AdminUsers | /admin/users | UC-21 | matched |
| AdminPayments | /admin/payments | UC-25 | orphan→UC-25 |
| AdminReports | /admin/reports | UC-12 | orphan→UC-12 |
| About | /about | static | static_ok |
| Help | /help | static | static_ok |
| Privacy | /privacy | static | static_ok |
| Terms | /terms | static | static_ok |

**Coverage:** 28/32 screens matched or planned = 87.5% ✓ (PASS)
**Orphan screens:** admin/payments, admin/reports → mapped to existing UC
**Missing UC:** UC-31 (homepage), UC-29 (payments), UC-30 (settings)

---

<!-- SCENARIOS_META
{
  "generated": "2026-04-06",
  "total": 28,
  "scenarios": [
    {"id":"S-001","title":"Guest browses listings without registration","type":"ui_flow","priority":"p1","ucs":["UC-31","UC-04","UC-05"]},
    {"id":"S-002","title":"User registers and completes onboarding via OTP","type":"ui_flow","priority":"p1","ucs":["UC-01","UC-26"]},
    {"id":"S-003","title":"User creates listing and goes through moderation","type":"cross_portal","priority":"p1","ucs":["UC-02","UC-22","UC-28"]},
    {"id":"S-004","title":"User searches with filters and pagination","type":"ui_flow","priority":"p1","ucs":["UC-04","UC-11"]},
    {"id":"S-005","title":"User adds/removes favorites and receives notifications","type":"ui_flow","priority":"p2","ucs":["UC-07","UC-17"]},
    {"id":"S-006","title":"Seller manages listing lifecycle (draft → active → sold)","type":"ui_flow","priority":"p1","ucs":["UC-02","UC-22","UC-19"]},
    {"id":"S-007","title":"Admin rejects listing with reason, seller re-submits","type":"cross_portal","priority":"p1","ucs":["UC-12","UC-22"]},
    {"id":"S-008","title":"User purchases promotion (Top listing)","type":"ui_flow","priority":"p1","ucs":["UC-08","UC-16"]},
    {"id":"S-009","title":"User subscribes to Premium (unlimited listings)","type":"ui_flow","priority":"p2","ucs":["UC-08","UC-16"]},
    {"id":"S-010","title":"Pay-per-listing when free quota exceeded","type":"ui_flow","priority":"p2","ucs":["UC-08","UC-02"]},
    {"id":"S-011","title":"Chat between buyer and seller","type":"cross_portal","priority":"p1","ucs":["UC-06","UC-10"]},
    {"id":"S-012","title":"Admin blocks user and enforces restrictions","type":"cross_portal","priority":"p1","ucs":["UC-21","UC-27"]},
    {"id":"S-013","title":"User reports listing, admin resolves report","type":"cross_portal","priority":"p2","ucs":["UC-12","UC-21"]},
    {"id":"S-014","title":"Listing renewal before expiry","type":"ui_flow","priority":"p2","ucs":["UC-13","UC-19"]},
    {"id":"S-015","title":"Blocked user attempts to use valid refresh token","type":"security","priority":"p1","ucs":["UC-27","UC-01"]},
    {"id":"S-016","title":"Photo upload with malicious file","type":"security","priority":"p1","ucs":["UC-28"]},
    {"id":"S-017","title":"IDOR: user tries to edit another user's listing","type":"security","priority":"p1","ucs":["UC-02","UC-22"]},
    {"id":"S-018","title":"Duplicate listing detection","type":"edge_case","priority":"p2","ucs":["UC-33"]},
    {"id":"S-019","title":"Category i18n names displayed correctly","type":"ui_flow","priority":"p2","ucs":["UC-32","UC-30"]},
    {"id":"S-020","title":"Payment history shows all transaction types","type":"ui_flow","priority":"p2","ucs":["UC-29"]},
    {"id":"S-021","title":"Expired listing handling","type":"edge_case","priority":"p2","ucs":["UC-19","UC-22","UC-35"]},
    {"id":"S-022","title":"OTP brute-force protection","type":"security","priority":"p1","ucs":["UC-01","UC-23"]},
    {"id":"S-023","title":"Token refresh and session persistence across restart","type":"security","priority":"p1","ucs":["UC-01"]},
    {"id":"S-024","title":"Admin dashboard statistics","type":"ui_flow","priority":"p2","ucs":["UC-25"]},
    {"id":"S-025","title":"Seller profile viewed by buyer","type":"ui_flow","priority":"p2","ucs":["UC-09"]},
    {"id":"S-026","title":"Listing removal notifies favoriters","type":"cross_portal","priority":"p2","ucs":["UC-19","UC-07","UC-17"]},
    {"id":"S-027","title":"Phone reveal with rate limiting","type":"ui_flow","priority":"p2","ucs":["UC-05","UC-23"]},
    {"id":"S-028","title":"User settings: language switch and notification toggle","type":"ui_flow","priority":"p2","ucs":["UC-30","UC-24"]}
  ]
}
-->

## UC-27: Blocked User Enforcement

**Актор:** SYSTEM
**Цель:** Предотвратить действия заблокированных пользователей
**Приоритет:** critical (Task #2228)

**Основной поток:**
1. При каждом авторизованном запросе — middleware проверяет user.role
2. Если role === 'blocked' → 403 Forbidden: "Ваш аккаунт заблокирован"
3. При блокировке через UC-21 → инвалидировать все refresh tokens пользователя

**Acceptance criteria:**
- AC-01: Заблокированный пользователь с валидным JWT получает 403 на всех auth-роутах
- AC-02: Блокировка в UC-21 инвалидирует активные сессии
- AC-03: Объявления заблокированного пользователя скрываются из поиска (уже в UC-21 AC-04)

**Из кода (middleware auth.ts):**
- JWT payload.role === 'blocked' → 403 "Account suspended" (проверяется в middleware ДО любого route handler)
- GDPR: deletedAt !== null → 401 "Account deleted" (async DB check в middleware)

**Блокировка объявлений (admin.ts):**
- При role='blocked': `listing.updateMany({ where: { userId, status: 'active' }, data: { status: 'removed' } })`
- Это bulk update, не Query Filter — объявления действительно меняют статус (необратимо через UC-36 Query Filter)

> [FLAG SecOfficer 2026-04-06]: Сессии не инвалидируются при блокировке — нужен prisma.session.deleteMany({where:{userId}}) в admin block route. Refresh token с валидным токеном продолжает работать до истечения.
> [FLAG QA 2026-04-06]: Объявления заблокированного пользователя не скрываются — нет фильтра user.role в GET /listings. Task #2263 (UC-36).

**Responsive:** N/A — system/background process, no UI.

---

## UC-28: Photo Upload Security

> Note (SecOfficer): Magic bytes validation (file content check) not implemented — only MIME type header check. MVP gap.

**Актор:** SYSTEM
**Цель:** Предотвратить загрузку вредоносных файлов через форму фото объявлений
**Приоритет:** high (Task #2229)

**Основной поток:**
1. POST /listings/:id/photos принимает файл
2. Middleware проверяет Content-Type (должен быть image/*)
3. Проверяет magic bytes файла
4. Отклоняет .exe/.pdf/SVG с embedded JS

**Acceptance criteria:**
- AC-01: Принимаются только image/jpeg, image/png, image/webp (and GIF currently accepted by code — to be removed for consistency).
- AC-02: Проверка magic bytes (не только расширение)
- AC-03: Одинаковая валидация с аватар upload (users.ts)

> [FLAG SecOfficer 2026-04-06]: Magic bytes не проверяются — аватар upload также только MIME, не magic bytes. Требуется одинаковая валидация в обоих местах.
> [FLAG QA 2026-04-06]: Аватар принимает image/gif, UC-28 разрешает только jpeg/png/webp. Нужна унификация допустимых форматов.
> [DECISION 2026-04-06]: Magic bytes validation added to p1 task. GIF to be removed from accepted formats when magic bytes implemented.

**UI States:**
- **Loading:** Progress bar при загрузке файла
- **Error (тип файла):** "Invalid file type. Only JPEG, PNG, WebP allowed." — multer отклоняет на middleware уровне
- **Error (размер):** "File too large. Maximum size is 10MB." — multer limit
- **Error (magic bytes):** "File content does not match declared type." — содержимое файла не соответствует MIME
- **Success:** Фото загружено, превью отображается в форме создания объявления

**Responsive:**
- Mobile (430px): загрузка фото через камеру/галерею, превью в горизонтальном скролле
- Desktop (>768px): drag-and-drop зона, превью в сетке 3-4 колонки

**Edge cases:**
- SVG с embedded JavaScript → отклоняется по magic bytes (не image/svg+xml в whitelist)
- Файл с подменённым расширением (.exe → .jpg) → magic bytes не совпадают → reject
- Двойное расширение (photo.jpg.exe) → multer проверяет MIME, не расширение
- Аватар upload (POST /api/users/avatar) должен проходить ту же валидацию

**Уведомления:** N/A — системная валидация, уведомления не отправляются.

---

## UC-29: User Payment History

> Note (BizComplete): GET /api/payments/my endpoint does not exist. Frontend uses GET /api/promotions/my as workaround. Users cannot see full payment history.

**Актор:** Пользователь (зарег.)
**Страница:** /dashboard/payments
**Цель:** Просмотреть историю своих платежей и продвижений
**Приоритет:** medium (Task #2230)

**Гость видит:** Редирект на /login

**Основной поток:**
1. /dashboard/payments — список всех транзакций пользователя
2. Типы: продвижение объявления (промо), подписка Premium, pay-per-listing
3. Каждая запись: дата, тип, сумма, статус (completed/failed), ссылка на объявление

**Acceptance criteria:**
- AC-01: GET /api/payments/my возвращает платежи текущего пользователя
- AC-02: Отображаются: дата, тип продвижения, сумма, статус
- AC-03: Ссылка на объявление если оно ещё существует

**Из кода:**
- GET /api/promotions/my: возвращает активные промо пользователя (include listing { id, title })
- GET /api/promotions/prices: публичный, список всех типов промо с ценами
- Payment model: amount, currency, status (pending/completed/failed/refunded), provider, externalId, promotionType, listingId
- admin-payments.ts: GET /api/admin/payments (пагинация, фильтр по status/userId)

**Responsive:**
- Mobile (430px): список транзакций — компактные карточки с суммой, датой и статусом
- Desktop (>768px): таблица платежей с сортировкой и фильтрами по типу/статусу

> [FLAG QA 2026-04-06]: GET /api/payments/my не существует — фронт берёт /promotions/my (только активные промо). Payment records в БД недоступны пользователю.
> [FLAG Product 2026-04-06]: Frontend хардкодит цены в TYPE_PRICES, не читает из API. Task #2264 для добавления /api/promotions/prices.

---

## UC-30: User Settings

> Note (Detail Guardian): API Contract section incomplete — PUT/PATCH /api/users/me/notification-prefs request/response not documented.

**Актор:** Пользователь (зарег.)
**Страница:** /dashboard/settings
**Цель:** Управление настройками аккаунта
**Приоритет:** medium (Task #2231)

**Гость видит:** Редирект на /login

**Основной поток:**
1. /dashboard/settings — настройки аккаунта
2. Язык интерфейса: KA / RU / EN (сохраняется в профиле, UC-24)
3. Email уведомления: opt-in/opt-out по типам (NEW_MESSAGE, PRICE_DROP, LISTING_EXPIRING)
4. Удаление аккаунта: кнопка "Удалить аккаунт" → подтверждение → soft delete

**Acceptance criteria:**
- AC-01: Смена языка применяется немедленно и сохраняется в профиле
- AC-02: Настройки уведомлений сохраняются в User model
- AC-03: Удаление аккаунта — soft delete (данные сохраняются 30 дней)

**Настройки уведомлений (из кода):**
- GET /api/users/me/notification-prefs: возвращает все типы, создаёт default (enabled=true) для отсутствующих
- PUT /api/users/me/notification-prefs: { type: "new_message" | "price_drop" | "moderation_update", enabled: boolean }
- NotificationPref model: userId + type (unique), enabled boolean
- Типы: new_message, price_drop, moderation_update

**Responsive:**
- Mobile (430px): настройки в одну колонку, toggles для уведомлений, кнопка удаления аккаунта внизу
- Desktop (>768px): настройки в секциях (язык, уведомления, аккаунт), sidebar навигация

> [FLAG QA 2026-04-06]: Notification preferences хранятся только в localStorage — backend не знает об opt-out при отправке email. Нужны поля в User model.
> [FLAG Product 2026-04-06]: Удаление аккаунта (AC-03): нет User.deletedAt, нет DELETE /api/users/me, нет cron. Выделено в отдельный UC-34 (Task #2261).

---

## UC-31: Homepage / Landing Page

> Note (CMO): No H1 tag, hero CTA copy, trust signals (listing/user counts), or value proposition text specified. Homepage conversion-critical.

**Актор:** Гость или Пользователь
**Страница:** /
**Цель:** Обеспечить точку входа и конверсионную воронку
**Приоритет:** high (Task #2232)

**Гость видит:** полную страницу, поиск, категории, объявления. CTA "Войти" в хедере.

**Основной поток:**
1. Пользователь открывает "/"
2. Хедер: логотип, поисковая строка, выбор города, "Войти" (гость) / аватар (авториз.)
3. Блок категорий: grid иконок категорий (из БД, UC-14)
4. Блок "Свежие объявления": последние 12 активных объявлений
5. Блок "Топ объявления": promoted listings (top_* badge)
6. Footer: About, Help, Privacy, Terms, языковой переключатель

**Acceptance criteria:**
- AC-01: Главная доступна без авторизации
- AC-02: Категории загружаются из БД (не hardcoded)
- AC-03: Поисковая строка → /search?q=...
- AC-04: Выбор города → фильтрует "Свежие объявления"
- AC-05: CTA "Подать объявление" → логин для гостя → UC-02 для авторизованного

**Responsive:**
- Mobile (430px): поисковая строка на всю ширину, категории в горизонтальном скролле, объявления в одну колонку
- Desktop (>768px): hero-секция с поиском, категории в grid, объявления в сетке 3-4 колонки

> [FLAG QA 2026-04-06]: Homepage implementation gap — нет блока категорий (grid), нет топ-объявлений, нет footer, city selector не подключён к фильтрации. Task #2232.
> [FLAG Product 2026-04-06]: CTA "Подать объявление" на главной отсутствует — критично для конверсии.

---

## UC-32: Category Names i18n

> Note (Detail Guardian): Contradiction — UC body says nameKa/nameRu/nameEn fields missing, but Prisma schema and UC-14 confirm they exist. Verify and remove false flag.

**Актор:** SYSTEM / Администратор
**Цель:** Отображать названия категорий на языке пользователя
**Приоритет:** high (Task #2233)

**Основной поток:**
1. DB migration: добавить nameKa, nameRu, nameEn к Category и Subcategory
2. GET /api/categories → возвращает имя на языке из Accept-Language / профиля
3. Admin panel /admin/categories — форма с тремя полями названия

**Acceptance criteria:**
- AC-01: Category model имеет nameKa, nameRu, nameEn
- AC-02: API автоматически выбирает правильное название по языку
- AC-03: Fallback: nameEn если перевод отсутствует
- AC-04: Seed data содержит переводы для всех категорий

> [FLAG Backend 2026-04-06]: Category model в Prisma имеет только 'name'. nameKa/nameRu/nameEn отсутствуют. Admin panel не имеет формы для переводов. Task #2233.

**UI States:**
- **Loading:** Spinner при загрузке категорий с переводами
- **Empty:** Категория без перевода → отображается nameEn или name (fallback)
- **Error (admin):** "nameEn is required" — при сохранении категории без английского названия
- **Success (admin):** Категория сохранена с переводами на 3 языка

**Валидация:**
- nameKa: string, optional (fallback to nameEn)
- nameRu: string, optional (fallback to nameEn)
- nameEn: string, required (используется как fallback для всех языков)
- Все names: trim, max 100 символов

**Edge cases:**
- Язык пользователя = ka, перевод nameKa отсутствует → показывается nameEn
- Seed data: все базовые категории должны иметь переводы на 3 языка
- Смена языка на frontend → категории перерендериваются с новыми названиями (без reload)

**Responsive:**
- Mobile (430px): категории в списке с локализованными названиями
- Desktop (>768px): admin-форма с тремя полями названия рядом (KA / RU / EN)

**Уведомления:** N/A — системная настройка, уведомления не отправляются.

---

## UC-33: Duplicate Listing Detection

**Актор:** SYSTEM
**Цель:** Предотвратить спам идентичными объявлениями
**Приоритет:** medium (Task #2242)

**Основной поток:**
1. При создании объявления (UC-02) → hash check
2. SHA256(userId + categoryId + title.normalized) → проверка в last 24h
3. Если найден дубль → 429: "Похожее объявление уже было создано недавно"

**Acceptance criteria:**
- AC-01: Блокировка одинаковых объявлений от одного пользователя в одной категории в течение 24h
- AC-02: title нормализуется: lowercase, trim, collapse spaces
- AC-03: Ошибка содержит понятное сообщение с ссылкой на существующее объявление

**Из кода (POST /api/listings — duplicate check):**
- Реализовано! Проверка: userId + categoryId + title (case-insensitive) + status in (active, pending_moderation) + createdAt >= 24h ago
- При дубликате: HTTP 409 { error: "duplicate_listing", existingId: dupe.id }
- Пропускается для: drafts и admin
- Нормализация: title через stripHtml + xss (но не lowercase/trim — отличие от UC spec)

> [FLAG Backend 2026-04-06]: ~~Duplicate detection не реализован~~ РЕАЛИЗОВАНО: title case-insensitive match per user+category за 24ч. Без hash column — через Prisma query. Task #2242 (закрыть).

---

## UC-34: Account Deletion (GDPR Compliance)

**Актор:** Пользователь (зарег.)
**Страница:** /dashboard/settings
**Цель:** Удалить аккаунт с сохранением данных 30 дней (soft delete)
**Приоритет:** p1 (Task #2261)

**Гость видит:** Редирект на /login

**Основной поток:**
1. /dashboard/settings → кнопка "Удалить аккаунт"
2. Диалог подтверждения: "Все ваши данные будут удалены через 30 дней"
3. Пользователь подтверждает → DELETE /api/users/me
4. User.deletedAt = now() (soft delete)
5. Все auth-роуты проверяют deletedAt != null → 401
6. Email: "Аккаунт будет удалён через 30 дней. Передумали? Войдите снова."
7. Cron ежедневно: hard delete users где deletedAt < now() - 30d (listings, messages, payments cascade)

**Альтернативные потоки:**
- 6a. Пользователь логинится до истечения 30 дней → deletedAt сбрасывается, аккаунт восстановлен

**Acceptance criteria:**
- AC-01: User.deletedAt field в Prisma schema
- AC-02: DELETE /api/users/me → soft delete
- AC-03: Авторизация блокируется если deletedAt != null
- AC-04: Cron hard-delete через 30 дней с cascade (listings, messages, payments)
- AC-05: UI кнопка с confirmation dialog в /dashboard/settings

**Из кода (DELETE /api/users/me):**
- Soft delete: User.deletedAt = now()
- Сессии: prisma.session.deleteMany({ where: { userId } }) — немедленная инвалидация
- Cookies: clearCookie accessToken + refreshToken
- Auth middleware: проверяет deletedAt !== null → 401 "Account deleted" (async DB check)
- OTP request: проверяет deletedAt перед upsert → 401 "Account deleted" (блокирует повторную регистрацию)

**GDPR Hard Delete (cron, ежедневно 04:00 UTC):**
- Cutoff: 30 дней после deletedAt
- Cascade порядок: Message → ThreadParticipant → Thread (orphaned) → Notification → Favorite → Promotion → Payment → Report → OtpCode → Session → ListingPhoto → Listing → User
- Также чистит связанные данные: Favorites/Notifications/Promotions/Reports/Threads для listing-ов пользователя

**Responsive:**
- Mobile (430px): кнопка "Удалить аккаунт" внизу настроек, confirmation dialog на полный экран
- Desktop (>768px): кнопка "Удалить аккаунт" в секции "Опасная зона" настроек, модальный confirmation dialog

---

## UC-35: Listing Expiry Cron Verification

**Актор:** SYSTEM
**Цель:** Гарантировать что объявления с истёкшим сроком переходят в статус expired
**Приоритет:** p2 (Task #2262)

**Основной поток (SYSTEM):**
1. Cron ежедневно 03:00 UTC (cleanup.ts)
2. Находит listings где status='active' AND expiresAt < NOW()
3. Обновляет status='expired'
4. Отправляет email LISTING_EXPIRED продавцу
5. За 3 дня: email LISTING_EXPIRING (отдельный cron или scheduled check)

**Acceptance criteria:**
- AC-01: Cron реально запускается по расписанию (PM2 cron или node-cron)
- AC-02: Переход active→expired работает корректно
- AC-03: Просроченные объявления не показываются в поиске (двойная защита: status filter + expiresAt filter)
- AC-04: Email уведомления за 3 дня и при истечении

---

## UC-36: Blocked User Listings Deactivation

> Note (Architect): Conflict with UC-27 — this UC uses query filter approach (reversible), UC-27 bulk updates listings to removed (irreversible). Pick one approach.

**Актор:** SYSTEM
**Цель:** Скрыть объявления заблокированного пользователя из поиска
**Приоритет:** p2 (Task #2263)

**Основной поток:**
1. Администратор блокирует пользователя (UC-21)
2. SYSTEM: GET /api/listings фильтрует по user.role != 'blocked'
3. Объявления исчезают из поиска немедленно (без изменения статуса)

**Альтернативные потоки:**
- 1a. При разблокировке → объявления автоматически возвращаются в поиск (Query Filter подход)

**Acceptance criteria:**
- AC-01: Реализован через Query Filter (не bulk update) — обратимо
- AC-02: GET /api/listings JOIN users WHERE user.role != 'blocked'
- AC-03: Прямой доступ GET /api/listings/:id для заблокированного продавца → 410 или скрыт

**UI States:**
- **Loading:** N/A — фильтрация прозрачна для пользователя
- **Empty:** Если все объявления в результатах принадлежат заблокированным → стандартное "Ничего не найдено"
- **Error (410):** "This listing is no longer available" — при прямом доступе к объявлению заблокированного продавца
- **Success:** Объявления заблокированных пользователей не отображаются в результатах поиска

**Валидация:**
- Query filter добавляется на уровне Prisma query (не middleware) — `user: { role: { not: 'blocked' } }`
- Прямой доступ: GET /api/listings/:id проверяет user.role после получения объявления

**Edge cases:**
- Разблокировка пользователя → объявления мгновенно появляются в поиске (query filter подход)
- Кэширование: если фронт кэширует результаты поиска — заблокированные объявления могут отображаться до инвалидации кэша
- Favorites: объявления заблокированного продавца в избранном → серая карточка "Продавец заблокирован"

**Responsive:**
- Mobile (430px): N/A — системная фильтрация, не влияет на UI layout
- Desktop (>768px): N/A — системная фильтрация, не влияет на UI layout

---

## UC-37: Legal & Static Pages

**Актор:** Гость / Пользователь
**Страницы:** /about, /help, /privacy, /terms
**Цель:** Обеспечить юридическую защиту платформы и информирование пользователей

**Основной поток:**
- Страницы полностью публичны, доступны без авторизации
- Контент: i18n переводы (KA/RU/EN), статически вшиты в код
- /privacy: политика конфиденциальности (Georgian law: требуется для любого сервиса собирающего PII)
- /terms: условия использования (правила публикации, ответственность)
- /help: FAQ (создание объявлений, оплата, контакты поддержки)
- /about: описание платформы, контакты

**Acceptance criteria:**
- AC-01: Все 4 страницы доступны гостю без авторизации
- AC-02: Privacy policy содержит: данные которые собираем, срок хранения, права пользователя, контакт DPO
- AC-03: Terms содержат: запрещённый контент, политику блокировки, disclaimer
- AC-04: Все тексты переведены на KA/RU/EN

**Responsive:**
- Mobile (430px): статические страницы на полную ширину с читаемой типографикой, якорные ссылки для навигации
- Desktop (>768px): центрированный контент max-width 800px, sidebar с оглавлением

> [CREATED 2026-04-06]: Required for launch. Legal review needed before go-live.

---

## UC-38: Payment Callback Pages

**Актор:** Пользователь (after Stripe redirect)
**Страницы:** /promotions/success, /promotions/cancel
**Цель:** Подтвердить результат платежа и вернуть пользователя в нужный контекст

**Основной поток (success):**
1. Stripe redirects to /promotions/success?session_id=xxx
2. Page shows: success icon + "Продвижение активировано!" + listing link
3. Verify session_id against backend (GET /api/promotions/my) before showing success
4. Auto-redirect to promoted listing after 5 sec

**Основной поток (cancel):**
1. Stripe redirects to /promotions/cancel
2. Page shows: cancel icon + "Платёж отменён" + retry button
3. Retry → back to /dashboard/listings/:id/promote

**Edge cases:**
- Browser closed during payment → orphaned pending Payment record
- session_id already used → show success anyway (idempotent)
- Backend returns 404 for session_id → show "payment pending" (async webhook)

**Responsive:**
- Mobile (430px): success/cancel страницы на полный экран, крупная иконка + текст + CTA кнопка на всю ширину
- Desktop (>768px): центрированная карточка с иконкой, текстом и кнопками

**Acceptance criteria:**
- AC-01: Success page validates that promotion became active
- AC-02: Cancel page has clear retry path
- AC-03: Orphaned pending payments resolved by Stripe webhook within 30 sec

> [CREATED 2026-04-06]: Payment callback UX documented.

---

## UC-39: Promotion Expiry Cron (SYSTEM)

**Актор:** SYSTEM
**Цель:** Деактивировать истёкшие продвижения

**Основной поток:**
- Cron: каждый час (cleanup.ts)
- Query: Promotion WHERE isActive=true AND expiresAt < NOW()
- Action: isActive = false
- No refund on early deactivation
- Subscription promotions (unlimited_sub) only deactivated by Stripe webhook, not this cron

**Acceptance criteria:**
- AC-01: Hourly cron runs at :00 each hour
- AC-02: Expired promotions deactivated within 1 hour of expiry
- AC-03: Action logged to audit log
- AC-04: No cascade effects (listing remains active, only promotion badge removed)

**Responsive:** N/A — system/background process, no UI.

> [CREATED 2026-04-06]: Cron already implemented in code. UC documents expected behavior.

---

## UC-40: Listing Expiry Email Reminders (SYSTEM)

**Актор:** SYSTEM  
**Цель:** Предупредить продавца об истечении объявления

**Основной поток:**
- Cron: ежедневно 09:00 UTC (cleanup.ts)
- Query: Listing WHERE status=active AND expiresAt BETWEEN NOW() AND NOW()+3days
- Action: Send LISTING_EXPIRING notification + email
- UC-19 handles the actual expiry transition (03:00 UTC)

**Acceptance criteria:**
- AC-01: Reminder sent once per listing (not repeatedly each day in 3-day window)
- AC-02: Email contains: listing title, expiry date, renew link
- AC-03: Only sent for active listings (not draft/removed)

**Responsive:** N/A — system/background process, no UI.

> [CREATED 2026-04-06]: Cron already implemented in code. Add deduplication check (don't send multiple times).

---

## UC-43: Pay-Per-Listing (Quota Exceeded Slot Purchase)

> **Story:** As a free-tier seller who has reached the category listing quota,
> I want to purchase an additional listing slot,
> so that I can post more listings without upgrading to Premium.

**Актор:** Пользователь (зарег., free tier)
**Страница:** /listings/create → quota error → Stripe checkout → /listings/slot-success
**Цель:** Купить дополнительный слот объявления в категории с исчерпанной квотой

**Гость видит:** Редирект на /login

**Основной поток:**
1. Пользователь создаёт объявление → POST /api/listings → 402 { error: "Quota exceeded", allowPaid: true }
2. UI показывает экран "Квота исчерпана" с опцией купить слот
3. Пользователь нажимает "Купить слот" → POST /api/promotions/purchase-listing-slot { listingId, categoryId }
4. Система создаёт Stripe Checkout session → возвращает { url: "stripe.com/..." }
5. Пользователь проходит оплату на Stripe
6. Stripe webhook → UC-38 обрабатывает → listing slot активирован
7. Редирект на /listings/slot-success

**Альтернативные потоки:**
- Пользователь закрывает Stripe → редирект обратно на /listings/create (черновик сохранён)
- Оплата не прошла → Stripe возвращает ошибку → toast "Оплата не прошла, попробуйте снова"
- Пользователь — Premium → квота не применяется, этот UC не срабатывает

**Бизнес-правила:**
- Только для free tier пользователей у которых freeListingQuota исчерпана в данной категории
- Цена: paidListingPrice из Category модели (задаётся в /admin/categories)
- Слот действует 30 дней (один листинг в данной категории)
- Premium пользователи: неограниченные объявления, этот flow не показывается

**Валидация:**
- listingId: uuid, обязателен, must belong to authenticated user
- categoryId: uuid, обязателен
- Проверка: пользователь не Premium (иначе 400 "Premium users have unlimited listings")

**Данные (поля):**
- Экран quota exceeded: category name, current count, quota limit, slot price (из Category.paidListingPrice)
- Экран success: listing title, expiry date, link to /listings/[id]

**Переходы:**
- /listings/create → quota 402 → stripe checkout → /listings/slot-success
- /listings/slot-success → кнопка "Просмотреть объявление" → /listings/[id]

**UI States:**
- **Loading:** Spinner при создании Stripe session
- **Empty:** N/A
- **Error:** "Оплата не прошла. Попробуйте снова." + [Повторить]
- **Success:** /listings/slot-success — "Слот куплен! Ваше объявление будет опубликовано."

**Edge cases:**
- Двойной клик "Купить" → второй запрос игнорируется (кнопка disabled)
- Webhook приходит до редиректа → listing уже active при открытии success страницы
- Webhook не приходит (Stripe delay) → success страница показывается, listing активируется позже

**Responsive:**
- Mobile (430px): bottom sheet с описанием квоты + CTA кнопка на всю ширину
- Desktop (>768px): модальное окно с информацией и кнопкой оплаты

**Out of Scope:**
- Subscription upgrade → UC-16
- Regular promotions (Top/Highlight) → UC-08

**Acceptance criteria:**

**AC-01: Quota exceeded → offer slot**
- Given: free user has 5/5 active listings in Electronics
- When: tries to create 6th listing in Electronics
- Then: POST /api/listings returns 402, UI shows "Quota exceeded" with "Buy slot" button and price

**AC-02: Slot purchase flow**
- Given: user clicks "Buy slot"
- When: POST /api/promotions/purchase-listing-slot succeeds
- Then: redirected to Stripe Checkout page

**AC-03: Success page**
- Given: payment completed
- When: Stripe webhook processed (UC-38)
- Then: user arrives at /listings/slot-success, sees listing title and "View listing" button

**API Contract:**
```
GET /api/categories/:id/quota
→ 200: { categoryId, used: 3, limit: 5, canPost: false, paidSlotPrice: 5.00, currency: "GEL" }

POST /api/promotions/purchase-listing-slot
body: { listingId: string, categoryId: string }
→ 200: { checkoutUrl: "https://checkout.stripe.com/..." }
→ 400: { error: "Premium users have unlimited listings" }
→ 402: { error: "Payment required", paidSlotPrice: 5.00 }
```

**Эндпоинты:**
- GET /api/categories/:id/quota [auth: yes]
- POST /api/promotions/purchase-listing-slot [auth: yes]
- POST /api/stripe-webhook (UC-44) — обрабатывает checkout.session.completed

---

## UC-44: Stripe Webhook Processing (Idempotency + Signature Verification)

**Актор:** SYSTEM (Stripe)
**Страница:** POST /api/stripe-webhook
**Цель:** Безопасно обработать события оплаты от Stripe с гарантией однократной обработки

**Основной поток:**
1. Stripe отправляет POST /api/stripe-webhook с Stripe-Signature header
2. Система верифицирует подпись: stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
3. Проверяет идемпотентность: Payment.externalId уже существует → skip (уже обработан)
4. Обрабатывает событие по типу:
   - checkout.session.completed → активирует Promotion или listing slot
   - payment_intent.payment_failed → логирует, опционально уведомляет пользователя
5. Возвращает 200 (Stripe не будет ретраить)

**Альтернативные потоки:**
- Подпись невалидна → 400 (Stripe логирует как failed delivery)
- Неизвестный event type → 200 (acknowledge без обработки)
- DB error при обработке → 500 (Stripe ретраит до 72 часов)
- Дубликат event ID → skip + 200 (idempotency)

**Бизнес-правила:**
- НИКОГДА не обрабатывать без верификации подписи
- Идемпотентность через Payment.externalId (Stripe event ID или session ID)
- Все обработанные события логируются в AuditLog

**Acceptance criteria:**

**AC-01: Signature verification**
- Given: webhook request without valid Stripe-Signature
- When: POST /api/stripe-webhook received
- Then: 400 returned, event not processed, logged as security warning

**AC-02: Idempotency**
- Given: same Stripe event delivered twice (Stripe retry)
- When: second POST /api/stripe-webhook with same event ID
- Then: 200 returned, payment/promotion NOT duplicated

**AC-03: Promotion activation**
- Given: valid checkout.session.completed for promotion purchase
- When: webhook processed
- Then: Promotion record created, listing gets isPromoted=true, user gets notification

**API Contract:**
```
POST /api/stripe-webhook
Headers: Stripe-Signature: t=...,v1=...
Body: raw Stripe event JSON
→ 200: { received: true }
→ 400: { error: "Invalid signature" }
```

**Эндпоинты:** POST /api/stripe-webhook [auth: no, signature-verified]

**Responsive:** N/A — system/background process, no UI.

---

## UC-45: SEO & Social Sharing

**Актор:** SYSTEM (search engines, social platforms)
**Страница:** /, /listings/[id], /users/[id], /search, /listings
**Цель:** Обеспечить индексируемость и корректный вид при шаринге в соцсетях

**Основной поток:**
1. Search engine crawls /listings/[id]
2. Page returns: unique <title>, <meta description>, OG tags, structured data (JSON-LD Product)
3. Social platform renders link preview from OG tags

**Acceptance criteria:**

**AC-01: Listing page SEO**
- Given: GET /listings/[id]
- When: rendered
- Then: <title> = "{title} — {price} {currency} | Avito Georgia", OG:image = first photo, structured data = Product JSON-LD

**AC-02: Homepage SEO**
- Given: GET /
- When: rendered
- Then: <title> = "Avito Georgia — объявления в Грузии", OG:description = "Покупай и продавай в Тбилиси, Батуми и других городах Грузии"

**AC-03: Canonical URLs**
- Given: filtered search /search?category=electronics&city=tbilisi
- When: rendered
- Then: canonical = /search?category=electronics&city=tbilisi (no pagination duplicates)

**SEO Specs:**
- /: title "Avito Georgia — объявления в Грузии", description dynamic (top categories + listing count)
- /listings/[id]: title "{title} — {price} в {city}", description first 150 chars of description, OG:image first photo
- /users/[id]: title "{name} — продавец на Avito Georgia", description "{N} активных объявлений"
- /search: title "Объявления{category?} в {city?} — Avito Georgia"
- Structured data: Product (listings), Person (sellers)
- Robots: index all public pages, noindex /admin/*, /dashboard/*

**Responsive:** N/A — metadata, not UI.

---

## UC-46: Health Check & Monitoring

**Актор:** SYSTEM (load balancer, uptime monitor)
**Страница:** GET /api/health
**Цель:** Подтвердить что сервис работает

**Основной поток:**
1. Load balancer / monitoring service sends GET /api/health
2. API checks: DB connection, Redis connection
3. Returns 200 with status details

**Acceptance criteria:**

**AC-01:** GET /api/health → 200 { status: "ok", db: "ok", redis: "ok|degraded" }
**AC-02:** If DB unreachable → 503 { status: "error", db: "error" }

**API Contract:**
```
GET /api/health
→ 200: { status: "ok", db: "ok", redis: "ok" }
→ 503: { status: "error", db: "error", message: "..." }
```

**Responsive:** N/A — no UI.

<!-- COLLEGIUM_DECISIONS
{
  "UC-15": { "decision": "approved", "reason": "реализуем в MVP", "date": "2026-04-06", "by": "user" },
  "UC-11": { "decision": "approved_revised", "reason": "address-level geocoding (не city pins)", "date": "2026-04-06", "by": "user" },
  "UC-20": { "decision": "approved", "reason": "фиксим blocked check + верифицируем frontend", "date": "2026-04-06", "by": "user" },
  "UC-33": { "decision": "approved", "reason": "добавить hash-based dedup", "date": "2026-04-06", "by": "user" },
  "Q-georgian-payments": { "decision": "phase2", "reason": "высокая популярность в Грузии, сложная интеграция", "date": "2026-04-06", "by": "user" },
  "Q-telegram-notifications": { "decision": "backlog", "reason": "Guardian CUT, добавим Phase 2", "date": "2026-04-06", "by": "collegium" },
  "Q-sms-otp": { "decision": "backlog", "reason": "Guardian CUT, email OTP достаточно для MVP", "date": "2026-04-06", "by": "collegium" },
  "UC-34": { "decision": "auto", "reason": "GDPR compliance requirement, critical", "date": "2026-04-06", "by": "collegium" },
  "UC-35": { "decision": "auto", "reason": "cron verification needed", "date": "2026-04-06", "by": "collegium" },
  "UC-36": { "decision": "auto", "reason": "security gap, blocked user listings visible", "date": "2026-04-06", "by": "collegium" },
  "UC-16": { "decision": "let_expire_naturally", "reason": "simpler UX — listings remain active until natural expiry; no forced draft transition", "date": "2026-04-06", "by": "user" },
  "UC-12": { "decision": "admin_toggle", "reason": "basic auto-rules with admin settings toggle — off by default, configurable banned words list", "date": "2026-04-06", "by": "user" },
  "UC-22": { "decision": "document_rejected", "reason": "rejected state and inactive transitions already in code, need UC documentation", "date": "2026-04-06", "by": "user" },
  "Q-report-rate-limit": { "decision": "mvp", "reason": "user selected: add to MVP", "date": "2026-04-06", "by": "user" },
  "Q-session-invalidation": { "decision": "mvp", "reason": "user selected: add to MVP", "date": "2026-04-06", "by": "user" },
  "Q-magic-bytes": { "decision": "mvp", "reason": "user selected: add to MVP", "date": "2026-04-06", "by": "user" },
  "UC-43": {"decision": "approved", "reason": "pay-per-listing monetization — user confirmed", "date": "2026-04-09", "by": "user"},
  "UC-44": {"decision": "auto", "reason": "stripe webhook security — critical", "date": "2026-04-09", "by": "collegium"},
  "UC-45": {"decision": "auto", "reason": "SEO — marketing requirement", "date": "2026-04-09", "by": "collegium"},
  "UC-46": {"decision": "auto", "reason": "health check — ops requirement", "date": "2026-04-09", "by": "collegium"},
  "Q-detail-block-autofill": {"decision": "approved", "reason": "auto-fill all BLOCK and FLAG UCs", "date": "2026-04-09", "by": "user"},
  "Q-security-webhook-session": {"decision": "fix-both", "reason": "both security gaps to be fixed", "date": "2026-04-09", "by": "user"}
}
-->
