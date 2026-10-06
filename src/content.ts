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
  vk: 'https://vk.ru/dfc_sportacadem',
  max: 'https://max.ru/u/f9LHodD0cOLHq0R9bIlWQIMtwDu0fxEzD6uCPPlyNP9TEZHLEjpNiXRi2nY',
  map: 'https://yandex.ru/maps/?text=' + encodeURIComponent('Москва, Сиреневый бульвар, 4'),
  mapWidget: 'https://yandex.ru/map-widget/v1/?ll=37.760081%2C55.801081&z=16&pt=37.760081%2C55.801081%2Cpm2rdm',
};

export const navigation = [
  { label: 'О клубе', href: '#about' },
  { label: 'Тренеры', href: '#coaches' },
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
  { id: 'junior', label: 'Младшая группа', ages: '3–5 лет', birthYears: '2021–2023 г. р.', time: '18:00–19:00', venue: 'Зал' },
  { id: 'middle', label: 'Средняя группа', ages: '6–8 лет', birthYears: '2018–2020 г. р.', time: '19:00–20:00', venue: 'Зал' },
  { id: 'senior', label: 'Старшая группа', ages: '9–11 лет', birthYears: '2015–2017 г. р.', time: '19:00–20:00', venue: 'Зал' },
];

export const plans = [
  { count: 4, title: 'Первый ритм', regular: 5800, price: 4500, perSession: 1125, freeze: false, featured: false },
  { count: 8, title: 'Уверенный темп', regular: 9800, price: 7480, perSession: 935, freeze: true, featured: false },
  { count: 12, title: 'Полная игра', regular: 10800, price: 9800, perSession: 817, freeze: true, featured: true },
];

export const venues = [
  { id: 1, width: 1600, height: 766 },
  { id: 2, width: 1600, height: 765 },
  { id: 3, width: 1600, height: 1200 },
  { id: 4, width: 1600, height: 1200 },
].map(venue => ({
  ...venue,
  title: 'Спортивный зал',
  label: 'Зал',
  image: assetPath(`/images/hall-${venue.id}-1600.webp`),
  srcSet: `${assetPath(`/images/hall-${venue.id}-768.webp`)} 768w, ${assetPath(`/images/hall-${venue.id}-1600.webp`)} 1600w`,
  thumbnail: assetPath(`/images/hall-${venue.id}-thumb.webp`),
}));

export const faqs = [
  { question: 'С какого возраста можно заниматься?', answer: 'В клубе тренируются дети от 3 до 11 лет. Есть младшая группа 3–5 лет, средняя 6–8 лет и старшая 9–11 лет. Занятия учитывают возраст и уровень подготовки ребёнка.' },
  { question: 'Когда проходят тренировки?', answer: 'По понедельникам, средам и пятницам. Младшая группа занимается с 18:00 до 19:00. Средняя и старшая занимаются с 19:00 до 20:00. Все группы тренируются в зале.' },
  { question: 'Нужен ли опыт игры в футбол?', answer: 'Занятия проходят в игровой форме с учётом возраста и уровня подготовки ребёнка.' },
  { question: 'Как записаться на бесплатную тренировку?', answer: 'Напишите в Telegram или Max клуба либо позвоните по номеру +7 985 335 40 92.' },
];
