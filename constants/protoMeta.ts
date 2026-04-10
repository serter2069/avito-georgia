export const protoMeta = {
  project: 'AvitoGeorgia',
  description: 'Доска объявлений для Грузии — аналог Авито',
  stack: 'Expo (React Native web-first) + Express.js API + PostgreSQL',

  roles: [
    {
      id: 'guest',
      title: 'Гость',
      description: 'Неавторизованный пользователь. Может просматривать объявления, поиск, профили продавцов.',
    },
    {
      id: 'user',
      title: 'Авторизованный пользователь',
      description: 'Вошёл через email OTP. Может размещать объявления, писать в чат, добавлять в избранное.',
    },
    {
      id: 'premium',
      title: 'Premium пользователь',
      description: 'Подписка 29.99 GEL/мес. Безлимитные объявления, значок Premium, приоритет в поиске.',
    },
    {
      id: 'admin',
      title: 'Администратор',
      description: 'Полный доступ: модерация объявлений, управление пользователями, категориями, настройками.',
    },
  ],

  scenarios: [
    {
      id: 'browse',
      title: 'Просмотр объявлений',
      roles: ['guest', 'user'],
      steps: ['homepage → listings-feed → listing-detail'],
    },
    {
      id: 'search',
      title: 'Поиск',
      roles: ['guest', 'user'],
      steps: ['search → listings-feed или map-view → listing-detail'],
    },
    {
      id: 'auth',
      title: 'Авторизация',
      roles: ['guest'],
      steps: ['auth-email → auth-otp → onboarding (первый вход) → homepage'],
    },
    {
      id: 'create-listing',
      title: 'Размещение объявления',
      roles: ['user', 'premium'],
      steps: ['create-listing → my-listings (черновик/активное)'],
    },
    {
      id: 'messaging',
      title: 'Переписка',
      roles: ['user', 'premium'],
      steps: ['listing-detail → chat-thread → messages-list'],
    },
    {
      id: 'promote',
      title: 'Продвижение объявления',
      roles: ['user', 'premium'],
      steps: ['my-listings → promote-listing → (Stripe) → promotion-success'],
    },
    {
      id: 'subscribe',
      title: 'Premium подписка',
      roles: ['user'],
      steps: ['profile → subscription → (Stripe) → dashboard'],
    },
    {
      id: 'moderation',
      title: 'Модерация (Admin)',
      roles: ['admin'],
      steps: ['admin-dashboard → admin-moderation → (одобрить/отклонить)'],
    },
  ],

  cities: ['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'],

  languages: ['KA', 'RU', 'EN'],

  auth: {
    method: 'Email OTP',
    devOtp: '000000',
    tokenAccess: '15m',
    tokenRefresh: '30d',
  },

  payments: {
    provider: 'Stripe',
    currency: 'GEL',
    premiumPrice: 29.99,
    boostOptions: [
      { days: 1, price: 2.99 },
      { days: 3, price: 6.99 },
      { days: 7, price: 12.99 },
    ],
  },
};
