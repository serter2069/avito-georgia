export const mockUsers = [
  { id: '1', name: 'Ираклий Гоциридзе', email: 'irakli@gmail.com', city: 'Тбилиси', phone: '+995 555 12 34 56', isPremium: true, role: 'user' as const, status: 'active' as const, createdAt: '2024-03-15', avatar: 'https://picsum.photos/seed/user-irakli/96/96' },
  { id: '2', name: 'Нино Кварацхелия', email: 'nino@mail.ru', city: 'Батуми', phone: '+995 555 98 76 54', isPremium: false, role: 'user' as const, status: 'active' as const, createdAt: '2024-08-20', avatar: 'https://picsum.photos/seed/user-nino/96/96' },
  { id: '3', name: 'Георгий Берианидзе', email: 'giorgi@gmail.com', city: 'Кутаиси', phone: '+995 555 11 22 33', isPremium: false, role: 'user' as const, status: 'active' as const, createdAt: '2025-01-10', avatar: 'https://picsum.photos/seed/user-giorgi/96/96' },
  { id: '4', name: 'Тамара Джанелидзе', email: 'tamara@gmail.com', city: 'Рустави', phone: '+995 555 44 55 66', isPremium: true, role: 'user' as const, status: 'blocked' as const, createdAt: '2024-11-05', avatar: 'https://picsum.photos/seed/user-tamara/96/96' },
  { id: '5', name: 'Давид Мерабишвили', email: 'david@gmail.com', city: 'Гори', phone: '+995 555 77 88 99', isPremium: false, role: 'admin' as const, status: 'active' as const, createdAt: '2024-01-01', avatar: 'https://picsum.photos/seed/user-david/96/96' },
];

export const mockListings = [
  { id: 'l1', title: 'Toyota Camry 2020, 2.5L', price: 28500, currency: 'USD', city: 'Тбилиси', category: 'Транспорт', status: 'active' as const, views: 342, isPromoted: true, isHighlighted: false, createdAt: '2026-04-05', photos: ['https://picsum.photos/seed/car-camry/400/300'] },
  { id: 'l2', title: 'Квартира 2-комн. в Ваке', price: 145000, currency: 'USD', city: 'Тбилиси', category: 'Недвижимость', status: 'active' as const, views: 89, isPromoted: false, isHighlighted: true, createdAt: '2026-04-07', photos: ['https://picsum.photos/seed/apartment-vake/400/300'] },
  { id: 'l3', title: 'iPhone 15 Pro Max 256GB', price: 3200, currency: 'GEL', city: 'Батуми', category: 'Электроника', status: 'active' as const, views: 215, isPromoted: false, isHighlighted: false, createdAt: '2026-04-08', photos: ['https://picsum.photos/seed/phone-iphone/400/300'] },
  { id: 'l4', title: 'Диван угловой IKEA', price: 850, currency: 'GEL', city: 'Кутаиси', category: 'Мебель', status: 'pending_moderation' as const, views: 12, isPromoted: false, isHighlighted: false, createdAt: '2026-04-09', photos: ['https://picsum.photos/seed/furniture-sofa/400/300'] },
  { id: 'l5', title: 'Ремонт квартир в Тбилиси', price: null, currency: 'GEL', city: 'Тбилиси', category: 'Услуги', status: 'active' as const, views: 67, isPromoted: true, isHighlighted: false, createdAt: '2026-04-06', photos: ['https://picsum.photos/seed/service-repair/400/300'] },
  { id: 'l6', title: 'Щенки лабрадора', price: 500, currency: 'GEL', city: 'Батуми', category: 'Животные', status: 'draft' as const, views: 0, isPromoted: false, isHighlighted: false, createdAt: '2026-04-09', photos: ['https://picsum.photos/seed/animal-puppy/400/300'] },
  { id: 'l7', title: 'BMW X5 2019, 3.0d', price: 42000, currency: 'USD', city: 'Батуми', category: 'Транспорт', status: 'sold' as const, views: 530, isPromoted: false, isHighlighted: false, createdAt: '2026-03-20', photos: ['https://picsum.photos/seed/car-bmw/400/300'] },
  { id: 'l8', title: 'Детская коляска Bugaboo', price: 1200, currency: 'GEL', city: 'Тбилиси', category: 'Детское', status: 'removed' as const, views: 45, isPromoted: false, isHighlighted: false, createdAt: '2026-03-15', photos: ['https://picsum.photos/seed/kids-stroller/400/300'] },
];

export const mockMessages = [
  { id: 'm1', threadId: 't1', senderId: '2', senderName: 'Нино Кварацхелия', senderAvatar: 'https://picsum.photos/seed/user-nino/48/48', listingTitle: 'Toyota Camry 2020', lastMessage: 'Здравствуйте! Машина ещё продаётся?', unreadCount: 2, createdAt: '2026-04-09T10:30:00' },
  { id: 'm2', threadId: 't2', senderId: '3', senderName: 'Георгий Берианидзе', senderAvatar: 'https://picsum.photos/seed/user-giorgi/48/48', listingTitle: 'iPhone 15 Pro Max', lastMessage: 'Можно посмотреть завтра?', unreadCount: 0, createdAt: '2026-04-08T18:15:00' },
  { id: 'm3', threadId: 't3', senderId: '4', senderName: 'Тамара Джанелидзе', senderAvatar: 'https://picsum.photos/seed/user-tamara/48/48', listingTitle: 'Квартира в Ваке', lastMessage: 'Какой этаж? Есть парковка?', unreadCount: 1, createdAt: '2026-04-07T14:00:00' },
];

export const mockChatMessages = [
  { id: 'c1', senderId: '2', text: 'Здравствуйте! Машина ещё продаётся?', createdAt: '2026-04-09T10:30:00', isOwn: false },
  { id: 'c2', senderId: '1', text: 'Да, конечно! Пробег 45 000 км, всё в отличном состоянии.', createdAt: '2026-04-09T10:32:00', isOwn: true },
  { id: 'c3', senderId: '2', text: 'Можно на тест-драйв записаться?', createdAt: '2026-04-09T10:35:00', isOwn: false },
  { id: 'c4', senderId: '1', text: 'Конечно, давайте завтра в 14:00 у метро Руставели.', createdAt: '2026-04-09T10:36:00', isOwn: true },
];

export const mockNotifications = [
  { id: 'n1', type: 'message' as const, title: 'Новое сообщение', description: 'Нино написала вам по объявлению "Toyota Camry"', isRead: false, createdAt: '2026-04-09T10:30:00' },
  { id: 'n2', type: 'moderation' as const, title: 'Объявление одобрено', description: 'Ваше объявление "iPhone 15 Pro Max" прошло модерацию', isRead: false, createdAt: '2026-04-08T15:00:00' },
  { id: 'n3', type: 'promotion' as const, title: 'Продвижение завершено', description: 'Продвижение объявления "Toyota Camry" истекло', isRead: true, createdAt: '2026-04-07T09:00:00' },
  { id: 'n4', type: 'system' as const, title: 'Добро пожаловать!', description: 'Ваш аккаунт успешно создан. Начните размещать объявления.', isRead: true, createdAt: '2026-04-05T12:00:00' },
];

export const mockPayments = [
  { id: 'p1', type: 'promotion' as const, amount: 15, currency: 'GEL', status: 'success' as const, description: 'Продвижение: Toyota Camry', createdAt: '2026-04-05T10:00:00' },
  { id: 'p2', type: 'subscription' as const, amount: 29, currency: 'GEL', status: 'success' as const, description: 'Premium подписка (1 мес.)', createdAt: '2026-03-15T09:00:00' },
  { id: 'p3', type: 'promotion' as const, amount: 25, currency: 'GEL', status: 'failed' as const, description: 'VIP размещение: Квартира', createdAt: '2026-03-10T14:00:00' },
  { id: 'p4', type: 'promotion' as const, amount: 10, currency: 'GEL', status: 'pending' as const, description: 'Выделение: iPhone 15', createdAt: '2026-04-09T08:00:00' },
];

export const mockCategories = ['Транспорт', 'Недвижимость', 'Электроника', 'Одежда', 'Мебель', 'Услуги', 'Работа', 'Детское', 'Животные', 'Хобби'];

export const mockCategoryIcons: Record<string, string> = {
  'Транспорт': 'truck',
  'Недвижимость': 'home',
  'Электроника': 'smartphone',
  'Одежда': 'tag',
  'Мебель': 'package',
  'Услуги': 'tool',
  'Работа': 'briefcase',
  'Детское': 'heart',
  'Животные': 'feather',
  'Хобби': 'activity',
};

export const mockCities = ['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'];

export const mockReports = [
  { id: 'r1', listingId: 'l1', listingTitle: 'Toyota Camry 2020', reporterName: 'Георгий Берианидзе', type: 'spam' as const, description: 'Подозрительное объявление, цена нереальная', createdAt: '2026-04-08T12:00:00' },
  { id: 'r2', listingId: 'l3', listingTitle: 'iPhone 15 Pro Max', reporterName: 'Тамара Джанелидзе', type: 'fraud' as const, description: 'Продавец просит предоплату на карту', createdAt: '2026-04-09T09:00:00' },
  { id: 'r3', listingId: 'l5', listingTitle: 'Ремонт квартир', reporterName: 'Нино Кварацхелия', type: 'inappropriate' as const, description: 'Некорректные фотографии', createdAt: '2026-04-07T16:00:00' },
];

export const mockAdminStats = {
  totalUsers: 12450,
  totalListings: 8340,
  pendingModeration: 23,
  totalRevenue: 45200,
};

export const mockFaqItems = [
  { question: 'Как разместить объявление?', answer: 'Нажмите кнопку "Создать объявление" в меню, выберите категорию, заполните описание и добавьте фотографии.' },
  { question: 'Сколько стоит размещение?', answer: 'Базовое размещение бесплатно. Платные опции: продвижение (15 GEL), VIP (25 GEL), выделение цветом (10 GEL).' },
  { question: 'Как связаться с продавцом?', answer: 'На странице объявления нажмите "Написать" для отправки сообщения или "Показать телефон" для просмотра номера.' },
  { question: 'Как удалить объявление?', answer: 'Перейдите в "Мои объявления", найдите нужное и нажмите кнопку "Удалить".' },
  { question: 'Что делать если меня обманули?', answer: 'Нажмите "Пожаловаться" на странице объявления. Наша служба модерации рассмотрит жалобу в течение 24 часов.' },
];
