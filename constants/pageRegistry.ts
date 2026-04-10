export type PageGroup = 'Overview' | 'Auth' | 'Onboarding' | 'Public' | 'My Listings' | 'Dashboard' | 'Promotions' | 'Admin' | 'Static';
export type NavVariant = 'none' | 'public' | 'auth' | 'client' | 'admin';

export interface PageNote {
  date: string;
  state?: string;
  text: string;
}

export interface PageEntry {
  id: string;
  title: string;
  group: PageGroup;
  route: string;
  stateCount: number;
  nav: NavVariant;
  notes?: PageNote[];
  qaScore?: number;
  qaCycles?: number;
}

export const pageRegistry: PageEntry[] = [
  // Overview
  {
    id: 'overview',
    title: 'Project Overview',
    group: 'Overview',
    route: '/proto/overview',
    stateCount: 1,
    nav: 'none',
    qaCycles: 0,
    qaScore: undefined,
    notes: [{ date: '2026-04-09', text: 'Карта проекта: роли, сценарии, прогресс прототипирования. Не экран приложения — документ.' }],
  },

  // Auth
  {
    id: 'auth-email',
    title: 'Email Login',
    group: 'Auth',
    route: '/(auth)',
    stateCount: 3,
    nav: 'auth',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Email OTP авторизация — одно поле email, кнопка отправить код. Пользователь создаётся автоматически при первом входе. Dev-режим: OTP всегда 000000' }],
  },
  {
    id: 'auth-otp',
    title: 'OTP Verification',
    group: 'Auth',
    route: '/(auth)/otp',
    stateCount: 6,
    nav: 'auth',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: '6-значный код вводится вручную. 3 попытки затем блокировка на 5 минут. Кнопка \'Отправить снова\' появляется через 60 секунд. Captcha после 2 неверных попыток' }],
  },

  // Onboarding
  {
    id: 'onboarding',
    title: 'Onboarding',
    group: 'Onboarding',
    route: '/onboarding',
    stateCount: 4,
    nav: 'none',
    notes: [{ date: '2026-04-10', text: 'Заполняется только при первом входе. Поля: имя, город (выбор из 6: Тбилиси, Батуми, Кутаиси, Рустави, Гори, Зугдиди), номер телефона (опционально). Пропустить нельзя' }],
  },

  // Public
  {
    id: 'homepage',
    title: 'Homepage',
    group: 'Public',
    route: '/',
    stateCount: 5,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Главная страница — лента свежих объявлений + категории. Гость видит CTA \'Разместить объявление\'. Авторизованный пользователь видит персонализированные рекомендации. Показывать объявления без авторизации' }],
  },
  {
    id: 'listings-feed',
    title: 'Listings Feed',
    group: 'Public',
    route: '/listings',
    stateCount: 4,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Список объявлений с фильтрами: город, категория, цена (min/max), сортировка. Пагинация 20 штук. Поддержка переключения лист/сетка' }],
  },
  {
    id: 'listing-detail',
    title: 'Listing Detail',
    group: 'Public',
    route: '/listings/[id]',
    stateCount: 5,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Детальная страница объявления. Телефон скрыт до нажатия \'Показать номер\' (записывается в аналитику). Кнопка \'Написать\' открывает чат. Кнопка \'Пожаловаться\' для авторизованных' }],
  },
  {
    id: 'search',
    title: 'Search',
    group: 'Public',
    route: '/search',
    stateCount: 5,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Поиск по ключевым словам + фильтры. Результаты в реальном времени (debounce 300ms). История поиска сохраняется локально. Переключение в режим карты' }],
  },
  {
    id: 'map-view',
    title: 'Map View',
    group: 'Public',
    route: '/search?view=map',
    stateCount: 1,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Карта объявлений — Leaflet + OpenStreetMap. Кластеризация маркеров. Клик по маркеру — превью объявления. Фильтры работают с картой' }],
  },
  {
    id: 'seller-profile',
    title: 'Seller Profile',
    group: 'Public',
    route: '/users/[id]',
    stateCount: 3,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Публичный профиль продавца: фото, имя, город, рейтинг, все активные объявления. Кнопка \'Написать продавцу\'' }],
  },

  // My Listings
  {
    id: 'my-listings',
    title: 'My Listings',
    group: 'My Listings',
    route: '/my/listings',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Управление своими объявлениями. Фильтры: активные / на модерации / архив / черновики. Кнопки: редактировать, архивировать, удалить, продвинуть' }],
  },
  {
    id: 'create-listing',
    title: 'Create Listing',
    group: 'My Listings',
    route: '/my/listings/create',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: '4 шага: 1-категория, 2-город, 3-детали (название/цена/описание/телефон), 4-фото (до 10 штук, макс 5МБ каждое). Можно сохранить как черновик' }],
  },
  {
    id: 'edit-listing',
    title: 'Edit Listing',
    group: 'My Listings',
    route: '/my/listings/[id]/edit',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Редактирование существующего объявления. Нельзя менять категорию после публикации. Новые фото добавляются к существующим' }],
  },

  // Dashboard
  {
    id: 'messages-list',
    title: 'Messages List',
    group: 'Dashboard',
    route: '/dashboard/messages',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Список всех чатов. Непрочитанные выделяются жирным. Поиск по чатам. Можно архивировать или удалить чат' }],
  },
  {
    id: 'chat-thread',
    title: 'Chat Thread',
    group: 'Dashboard',
    route: '/dashboard/messages/[id]',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Чат с покупателем/продавцом. Показывает превью объявления вверху. Отправка текста и фото. WebSocket real-time' }],
  },
  {
    id: 'favorites',
    title: 'Favorites',
    group: 'Dashboard',
    route: '/dashboard/favorites',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Сохранённые объявления. Сортировка по дате добавления. Если объявление удалено — показывать \'Объявление снято\' вместо него' }],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    group: 'Dashboard',
    route: '/dashboard/notifications',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Push-уведомления: новое сообщение, объявление добавлено в избранное, истекает срок объявления, одобрено/отклонено модерацией. Пометить все прочитанными' }],
  },
  {
    id: 'profile',
    title: 'Profile',
    group: 'Dashboard',
    route: '/dashboard/profile',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Редактирование профиля: фото (аватар), имя, город, телефон. Нельзя менять email. Кнопка \'Премиум подписка\' если нет подписки' }],
  },
  {
    id: 'settings',
    title: 'Settings',
    group: 'Dashboard',
    route: '/dashboard/settings',
    stateCount: 2,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Настройки приложения: язык (KA/RU/EN), уведомления, конфиденциальность. Кнопка \'Удалить аккаунт\' — с подтверждением' }],
  },
  {
    id: 'payment-history',
    title: 'Payment History',
    group: 'Dashboard',
    route: '/dashboard/payments',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'История платежей: дата, тип (Premium/Boost), сумма, статус. Фильтр по типу и дате. Скачать чек (PDF)' }],
  },
  {
    id: 'subscription',
    title: 'Premium Subscription',
    group: 'Dashboard',
    route: '/dashboard/subscription',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Premium подписка: безлимитные объявления, значок Premium, приоритет в поиске. Цена 29.99 GEL/месяц. Через Stripe' }],
  },

  // Promotions
  {
    id: 'promote-listing',
    title: 'Promote Listing',
    group: 'Promotions',
    route: '/promotions/promote',
    stateCount: 3,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Продвижение объявления: выбор пакета (1 день / 3 дня / 7 дней), цена. Оплата через Stripe. После оплаты — объявление в топе' }],
  },
  {
    id: 'promotion-success',
    title: 'Promotion Success',
    group: 'Promotions',
    route: '/promotions/success',
    stateCount: 1,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Успешная оплата продвижения. Показывает детали: объявление, период, дата истечения. Кнопка \'Посмотреть объявление\'' }],
  },
  {
    id: 'promotion-cancelled',
    title: 'Promotion Cancelled',
    group: 'Promotions',
    route: '/promotions/cancelled',
    stateCount: 1,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Отменённая оплата (пользователь закрыл Stripe). Показывает причину. Кнопка \'Попробовать снова\'' }],
  },
  {
    id: 'slot-success',
    title: 'Listing Slot Success',
    group: 'Promotions',
    route: '/promotions/slot-success',
    stateCount: 4,
    nav: 'client',
    notes: [{ date: '2026-04-10', text: 'Восстановление объявления из архива / публикация черновика. Показывает что объявление теперь активно' }],
  },

  // Admin
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    group: 'Admin',
    route: '/admin',
    stateCount: 2,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Сводная статистика: активные объявления, пользователи, очередь модерации, доходы. Графики за 7/30 дней' }],
  },
  {
    id: 'admin-users',
    title: 'Admin Users',
    group: 'Admin',
    route: '/admin/users',
    stateCount: 3,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Список пользователей с поиском. Статусы: активен, заблокирован. Действия: просмотр, блокировка, разблокировка' }],
  },
  {
    id: 'admin-moderation',
    title: 'Admin Moderation',
    group: 'Admin',
    route: '/admin/moderation',
    stateCount: 4,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Очередь объявлений на проверку. Показывает фото, описание, продавца. Кнопки: Одобрить / Отклонить (с причиной)' }],
  },
  {
    id: 'admin-categories',
    title: 'Admin Categories',
    group: 'Admin',
    route: '/admin/categories',
    stateCount: 3,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Управление категориями объявлений. Дерево категорий. Добавить / переименовать / скрыть категорию. i18n: KA/RU/EN' }],
  },
  {
    id: 'admin-reports',
    title: 'Admin Reports',
    group: 'Admin',
    route: '/admin/reports',
    stateCount: 3,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Жалобы пользователей на объявления. Статусы: новая, рассмотрена. Действия: удалить объявление, заблокировать пользователя, отклонить жалобу' }],
  },
  {
    id: 'admin-payments',
    title: 'Admin Payments',
    group: 'Admin',
    route: '/admin/payments',
    stateCount: 3,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'История всех платежей через Stripe. Фильтры: тип, дата, пользователь. Экспорт CSV' }],
  },
  {
    id: 'admin-settings',
    title: 'Admin Settings',
    group: 'Admin',
    route: '/admin/settings',
    stateCount: 4,
    nav: 'admin',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-10', text: 'Глобальные настройки платформы: комиссии, лимиты объявлений, email-шаблоны, режим обслуживания' }],
  },

  // Static
  {
    id: 'about',
    title: 'About',
    group: 'Static',
    route: '/about',
    stateCount: 1,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'О проекте: миссия, команда, контакты, версия приложения' }],
  },
  {
    id: 'help',
    title: 'Help',
    group: 'Static',
    route: '/help',
    stateCount: 2,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'FAQ и справка. Категории вопросов. Поиск по FAQ. Кнопка обратной связи' }],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    group: 'Static',
    route: '/privacy',
    stateCount: 1,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Политика конфиденциальности. Только текст. На трёх языках' }],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    group: 'Static',
    route: '/terms',
    stateCount: 1,
    nav: 'public',
    notes: [{ date: '2026-04-10', text: 'Пользовательское соглашение. Только текст. На трёх языках' }],
  },
];

export const pageGroups = [...new Set(pageRegistry.map((p) => p.group))];

export function getPage(id: string): PageEntry | undefined {
  return pageRegistry.find((p) => p.id === id);
}
