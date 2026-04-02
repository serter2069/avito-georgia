import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      // Navigation
      home: 'Главная',
      search: 'Поиск',
      favorites: 'Избранное',
      profile: 'Профиль',
      postAd: 'Подать объявление',

      // Common
      all: 'Все',
      loading: 'Загрузка...',
      error: 'Ошибка',
      retry: 'Повторить',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      done: 'Готово',
      back: 'Назад',
      next: 'Далее',
      send: 'Отправить',

      // Auth
      login: 'Войти',
      logout: 'Выйти',
      email: 'Электронная почта',
      enterEmail: 'Введите email',
      enterOtp: 'Введите код',
      otpSent: 'Код отправлен на {{email}}',
      authTitle: 'Авито Грузия',
      authSubtitle: 'Войдите или зарегистрируйтесь',
      getCode: 'Получить код',
      confirmCode: 'Подтвердить',
      resendCode: 'Отправить повторно',
      resendIn: 'Повторно через {{seconds}}с',
      invalidCode: 'Неверный код',
      invalidEmail: 'Введите корректный email',

      // Listings
      listings: 'Объявления',
      noListings: 'Объявлений пока нет',
      price: 'Цена',
      negotiable: 'Договорная',
      currency: 'GEL',
      description: 'Описание',
      location: 'Местоположение',
      category: 'Категория',
      photos: 'Фотографии',
      addPhoto: 'Добавить фото',
      contactSeller: 'Связаться с продавцом',

      // Cities
      tbilisi: 'Тбилиси',
      batumi: 'Батуми',
      kutaisi: 'Кутаиси',
      rustavi: 'Рустави',
      allCities: 'Все города',

      // Categories
      transport: 'Транспорт',
      realEstate: 'Недвижимость',
      electronics: 'Электроника',
      clothing: 'Одежда',
      furniture: 'Мебель',
      services: 'Услуги',
      jobs: 'Работа',
      other: 'Другое',

      // Home
      newListings: 'Новые объявления',
      viewAll: 'Смотреть все',
      searchPlaceholder: 'Поиск объявлений...',

      // Search & Filters
      filters: 'Фильтры',
      priceFrom: 'Цена от',
      priceTo: 'Цена до',
      apply: 'Применить',
      reset: 'Сбросить',
      nothingFound: 'Ничего не найдено',
      tryDifferentSearch: 'Попробуйте изменить параметры поиска',
      loadMore: 'Загрузить ещё',

      // Sort
      sort: 'Сортировка',
      sortDate: 'По дате',
      sortPriceAsc: 'Дешевле',
      sortPriceDesc: 'Дороже',
      sortViews: 'По просмотрам',

      // Footer
      about: 'О нас',
      terms: 'Условия',
      privacy: 'Конфиденциальность',
      help: 'Помощь',
    },
  },
  en: {
    translation: {
      home: 'Home',
      search: 'Search',
      favorites: 'Favorites',
      profile: 'Profile',
      postAd: 'Post Ad',

      all: 'All',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      done: 'Done',
      back: 'Back',
      next: 'Next',
      send: 'Send',

      login: 'Log In',
      logout: 'Log Out',
      email: 'Email',
      enterEmail: 'Enter email',
      enterOtp: 'Enter code',
      otpSent: 'Code sent to {{email}}',
      authTitle: 'Avito Georgia',
      authSubtitle: 'Sign in or register',
      getCode: 'Get code',
      confirmCode: 'Confirm',
      resendCode: 'Resend code',
      resendIn: 'Resend in {{seconds}}s',
      invalidCode: 'Invalid code',
      invalidEmail: 'Enter a valid email',

      listings: 'Listings',
      noListings: 'No listings yet',
      price: 'Price',
      negotiable: 'Negotiable',
      currency: 'GEL',
      description: 'Description',
      location: 'Location',
      category: 'Category',
      photos: 'Photos',
      addPhoto: 'Add photo',
      contactSeller: 'Contact seller',

      tbilisi: 'Tbilisi',
      batumi: 'Batumi',
      kutaisi: 'Kutaisi',
      rustavi: 'Rustavi',
      allCities: 'All cities',

      transport: 'Transport',
      realEstate: 'Real Estate',
      electronics: 'Electronics',
      clothing: 'Clothing',
      furniture: 'Furniture',
      services: 'Services',
      jobs: 'Jobs',
      other: 'Other',

      newListings: 'New Listings',
      viewAll: 'View all',
      searchPlaceholder: 'Search listings...',

      filters: 'Filters',
      priceFrom: 'Price from',
      priceTo: 'Price to',
      apply: 'Apply',
      reset: 'Reset',
      nothingFound: 'Nothing found',
      tryDifferentSearch: 'Try different search parameters',
      loadMore: 'Load more',

      sort: 'Sort',
      sortDate: 'By date',
      sortPriceAsc: 'Cheapest',
      sortPriceDesc: 'Most expensive',
      sortViews: 'By views',

      about: 'About',
      terms: 'Terms',
      privacy: 'Privacy',
      help: 'Help',
    },
  },
  ka: {
    translation: {
      home: 'მთავარი',
      search: 'ძიება',
      favorites: 'ფავორიტები',
      profile: 'პროფილი',
      postAd: 'განცხადების დამატება',

      all: 'ყველა',
      loading: 'იტვირთება...',
      error: 'შეცდომა',
      retry: 'ხელახლა',
      save: 'შენახვა',
      cancel: 'გაუქმება',
      delete: 'წაშლა',
      edit: 'რედაქტირება',
      done: 'მზადაა',
      back: 'უკან',
      next: 'შემდეგი',
      send: 'გაგზავნა',

      login: 'შესვლა',
      logout: 'გასვლა',
      email: 'ელ. ფოსტა',
      enterEmail: 'შეიყვანეთ ელ. ფოსტა',
      enterOtp: 'შეიყვანეთ კოდი',
      otpSent: 'კოდი გაგზავნილია {{email}}-ზე',
      authTitle: 'ავიტო საქართველო',
      authSubtitle: 'შესვლა ან რეგისტრაცია',
      getCode: 'კოდის მიღება',
      confirmCode: 'დადასტურება',
      resendCode: 'ხელახლა გაგზავნა',
      resendIn: 'ხელახლა {{seconds}}წ-ში',
      invalidCode: 'არასწორი კოდი',
      invalidEmail: 'შეიყვანეთ სწორი ელ. ფოსტა',

      listings: 'განცხადებები',
      noListings: 'განცხადებები ჯერ არ არის',
      price: 'ფასი',
      negotiable: 'შეთანხმებით',
      currency: 'GEL',
      description: 'აღწერა',
      location: 'მდებარეობა',
      category: 'კატეგორია',
      photos: 'ფოტოები',
      addPhoto: 'ფოტოს დამატება',
      contactSeller: 'გამყიდველთან კონტაქტი',

      tbilisi: 'თბილისი',
      batumi: 'ბათუმი',
      kutaisi: 'ქუთაისი',
      rustavi: 'რუსთავი',
      allCities: 'ყველა ქალაქი',

      transport: 'ტრანსპორტი',
      realEstate: 'უძრავი ქონება',
      electronics: 'ელექტრონიკა',
      clothing: 'ტანსაცმელი',
      furniture: 'ავეჯი',
      services: 'სერვისები',
      jobs: 'სამუშაო',
      other: 'სხვა',

      newListings: 'ახალი განცხადებები',
      viewAll: 'ყველას ნახვა',
      searchPlaceholder: 'განცხადებების ძიება...',

      filters: 'ფილტრები',
      priceFrom: 'ფასი -დან',
      priceTo: 'ფასი -მდე',
      apply: 'გამოყენება',
      reset: 'გასუფთავება',
      nothingFound: 'ვერაფერი მოიძებნა',
      tryDifferentSearch: 'სცადეთ სხვა საძიებო პარამეტრები',
      loadMore: 'მეტის ჩატვირთვა',

      sort: 'სორტირება',
      sortDate: 'თარიღით',
      sortPriceAsc: 'იაფი',
      sortPriceDesc: 'ძვირი',
      sortViews: 'ნახვებით',

      about: 'ჩვენ შესახებ',
      terms: 'პირობები',
      privacy: 'კონფიდენციალურობა',
      help: 'დახმარება',
    },
  },
};

const deviceLang = Localization.getLocales()[0]?.languageCode || 'ru';
const supportedLangs = ['ru', 'en', 'ka'];
const initialLang = supportedLangs.includes(deviceLang) ? deviceLang : 'ru';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
