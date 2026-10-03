export const assetPath = (file: string) => `${import.meta.env.BASE_URL}${file.replace(/^\//, '')}`;

// School information and exact brand colors were transcribed from the supplied
// website on 2026-10-02. The reference website is used for visual direction only.
export const school = {
  name: 'СпортАкадемКлуб',
  subtitle: 'Детский футбольный клуб',
  originalUrl: 'https://dfc-sportacadem.tb.ru/',
  phone: '+7 985 335 40 92',
  phoneHref: 'tel:+79853354092',
  address: 'Москва, Сиреневый бульвар, 4',
  telegram: 'https://t.me/sportacadem',
  max: 'https://max.ru/u/f9LHodD0cOLHq0R9bIlWQIMtwDu0fxEzD6uCPPlyNP9TEZHLEjpNiXRi2nY',
  map: 'https://yandex.ru/maps/?text=' + encodeURIComponent('Москва, Сиреневый бульвар, 4'),
  mapWidget: 'https://yandex.ru/map-widget/v1/?ll=37.760081%2C55.801081&z=16&pt=37.760081%2C55.801081%2Cpm2rdm',
};

export const navigation = [
  { label: 'О клубе', href: '#about' },
  { label: 'Тренер', href: '#coaches' },
  { label: 'Программа', href: '#program' },
  { label: 'Залы', href: '#venues' },
  { label: 'Расписание', href: '#schedule' },
  { label: 'Стоимость', href: '#pricing' },
  { label: 'Контакты', href: '#contacts' },
];

export const methodology = [
  { label: 'Знакомство с футболом', title: 'Играем.\nИ учимся.', description: 'Игровые упражнения помогают освоить базовые навыки и получать удовольствие от футбола.', type: 'first' },
  { label: 'Физическое развитие', title: 'Наша сила\nв движении.', description: 'Развиваем координацию, гибкость, ловкость и силу. Закладываем основу здорового, активного детства.', type: 'technique' },
  { label: 'Команда и характер', title: 'Один мяч.\nОбщая цель.', description: 'Учимся сотрудничать, понимать партнёров и поддерживать друг друга на поле.', type: 'team' },
  { label: 'Уверенность в себе', title: 'Пробовать.\nИ не бояться.', description: 'Создаём позитивную атмосферу, где каждому ребёнку комфортно, а интерес к спорту только растёт.', type: 'positive' },
];

export const groups = [
  { id: 'junior', label: 'Младшая группа', ages: '3–5 лет', birthYears: '2021–2023 г. р.', time: '18:00–19:00', venue: 'Модуль А' },
  { id: 'middle', label: 'Средняя группа', ages: '6–8 лет', birthYears: '2018–2020 г. р.', time: '19:00–20:00', venue: 'Зал' },
  { id: 'senior', label: 'Старшая группа', ages: '9–11 лет', birthYears: '2015–2017 г. р.', time: '19:00–20:00', venue: 'Зал' },
];

export const plans = [
  { count: 4, title: 'Первый ритм', regular: 5800, price: 4500, perSession: 1125, freeze: false, featured: false },
  { count: 8, title: 'Уверенный темп', regular: 9800, price: 7480, perSession: 935, freeze: true, featured: true },
  { count: 12, title: 'Полная игра', regular: 10800, price: 9800, perSession: 817, freeze: true, featured: false },
];

export const venues = [
  { title: 'Спортивный зал', label: 'Зал', image: assetPath('/images/hall-1-upscaled.jpg'), width: 1813, height: 868 },
  { title: 'Спортивный зал', label: 'Зал', image: assetPath('/images/hall-2-upscaled.jpg'), width: 1814, height: 867 },
  { title: 'Крытый футбольный модуль', label: 'Модуль А', image: assetPath('/images/module-1-upscaled.jpg'), width: 1814, height: 867 },
  { title: 'Крытый футбольный модуль', label: 'Модуль А', image: assetPath('/images/module-2-upscaled.jpg'), width: 1814, height: 867 },
  { title: 'Крытый футбольный модуль', label: 'Модуль А', image: assetPath('/images/module-3-upscaled.jpg'), width: 1814, height: 867 },
];

export const faqs = [
  { question: 'С какого возраста можно заниматься?', answer: 'В клубе тренируются дети от 3 до 11 лет. Есть младшая группа 3–5 лет, средняя 6–8 лет и старшая 9–11 лет. Занятия учитывают возраст и уровень подготовки ребёнка.' },
  { question: 'Когда проходят тренировки?', answer: 'По понедельникам, средам и пятницам. Младшая группа занимается с 18:00 до 19:00 в Модуле А. Средняя и старшая занимаются с 19:00 до 20:00 в зале.' },
  { question: 'Нужен ли опыт игры в футбол?', answer: 'Занятия проходят в игровой форме с учётом возраста и уровня подготовки ребёнка.' },
  { question: 'Как записаться на бесплатную тренировку?', answer: 'Напишите в Telegram или Max клуба либо позвоните по номеру +7 985 335 40 92.' },
];
