import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, MapPin, Menu, Phone, Plus, Send, X } from 'lucide-react';
import { assetPath, faqs, groups, methodology, navigation, plans, school, venues } from './content';

const price = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
const sessionWord = (count: number) => count === 4 ? 'тренировки' : 'тренировок';

function Star() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" stroke="currentColor" strokeWidth="3"/></svg>;
}

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#home" aria-label="СпортАкадемКлуб — на главную">
    <svg width="38" height="45" viewBox="0 0 38 45" fill="none" aria-hidden="true"><path d="M2 3h34v25L19 42 2 28V3Z" fill="var(--brand-green)" stroke="var(--yellow)" strokeWidth="2.5"/><path d="m19 11 7 5-3 9h-8l-3-9 7-5Z" fill="var(--paper)"/><path d="m12 16-8-2m22 2 8-2M15 25l-5 8m13-8 5 8m-9-22V5" stroke="var(--paper)" strokeWidth="1.6"/></svg>
    <span className="brand-wordmark">СПОРТ<span className="brand-second">АКАДЕМКЛУБ</span><span className="brand-caption">ДЕТСКИЙ ФУТБОЛЬНЫЙ КЛУБ</span></span>
  </a>;
}
function PitchArt({ type }: { type: string }) {
  return <svg viewBox="0 0 400 220" fill="none" className="pitch-art" aria-hidden="true">
    <rect x="55" y="28" width="290" height="164" rx="1" stroke="currentColor" strokeOpacity=".2"/>
    <path d="M200 28v164M55 64h52v92H55m290-92h-52v92h52" stroke="currentColor" strokeOpacity=".2"/>
    <circle cx="200" cy="110" r="40" stroke="currentColor" strokeOpacity=".2"/>
    {type === 'first' && <><path d="M125 147c0-43 37-23 37-63s42-20 42 20 41 29 72-39" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6"/><circle cx="124" cy="147" r="13" fill="currentColor"/><path d="m264 66 14-6-1 15" stroke="currentColor" strokeWidth="2"/><circle cx="205" cy="111" r="7" stroke="currentColor" strokeWidth="2"/></>}
    {type === 'technique' && <><path d="m129 140 71-63 73 64" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6"/><circle cx="129" cy="140" r="13" fill="currentColor"/><circle cx="200" cy="77" r="13" fill="currentColor"/><circle cx="273" cy="141" r="13" fill="currentColor"/><path d="m145 104 12 1-2 12m75-6 2 12-12-1" stroke="currentColor" strokeWidth="2"/></>}
    {type === 'team' && <><path d="m130 145 70-69 81 36 28-45M130 145l106 9 45-42" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6"/><circle cx="130" cy="145" r="11" fill="currentColor"/><circle cx="200" cy="76" r="11" fill="currentColor"/><circle cx="281" cy="112" r="11" fill="currentColor"/><circle cx="236" cy="154" r="11" fill="currentColor"/><path d="m297 67 13-4 2 13" stroke="currentColor" strokeWidth="2"/></>}
  </svg>;
}


function EnrollmentDialog({ onClose, selectedPlan }: { onClose: () => void; selectedPlan: string | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [experience, setExperience] = useState('Пока не играл');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const message = `Здравствуйте!${name.trim() ? ` Меня зовут ${name.trim()}.` : ''} Хочу записать ребёнка на бесплатную пробную тренировку в СпортАкадемКлуб.${age ? ` Возраст: ${age} ${Number(age) < 5 ? 'года' : 'лет'}.` : ''} Опыт: ${experience.toLowerCase()}.${selectedPlan ? ` Интересует абонемент: ${selectedPlan}.` : ''} Подскажите, пожалуйста, подходящую группу и время.`;
  const telegramLink = `${school.telegram}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.showModal();
    return () => { document.body.style.overflow = oldOverflow; };
  }, []);

  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); setShowMessage(true); }
  }

  return <dialog ref={dialogRef} className="enrollment-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="dialog-title">
    <button type="button" className="dialog-close icon-button" onClick={onClose} aria-label="Закрыть"><X size={23}/></button>
    <span className="eyebrow"><span className="status-dot"/> Первая тренировка — бесплатно</span>
    <h2 id="dialog-title">Первый пас.<br/>Первая команда.</h2>
    <p className="dialog-intro">Расскажите немного о ребёнке. Подготовим сообщение для администратора — останется отправить его в Telegram.</p>
    {selectedPlan && <div className="selected-plan"><Check size={15}/>{selectedPlan}</div>}
    <div className="dialog-fields"><div><label className="field-label" htmlFor="parent-name">Ваше имя <span>необязательно</span></label><input id="parent-name" type="text" autoComplete="given-name" maxLength={80} placeholder="Как к вам обращаться" value={name} onChange={e => { setName(e.target.value); setCopied(false); }}/></div><div><label className="field-label" htmlFor="child-age">Возраст ребёнка</label><select id="child-age" value={age} onChange={e => { setAge(e.target.value); setCopied(false); }}><option value="">Выберите возраст</option>{Array.from({ length: 9 }, (_, i) => i + 3).map(n => <option key={n} value={n}>{n} {n === 3 || n === 4 ? 'года' : 'лет'}</option>)}</select></div></div>
    <fieldset className="experience"><legend>Опыт игры</legend><div className="experience-options">{['Пока не играл', 'Играет во дворе', 'Уже тренировался'].map(option => <label key={option} className={experience === option ? 'selected' : ''}><input type="radio" name="experience" value={option} checked={experience === option} onChange={() => { setExperience(option); setCopied(false); }}/>{option}{experience === option && <Check size={15}/>}</label>)}</div></fieldset>
    <button type="button" className="message-toggle" onClick={() => setShowMessage(!showMessage)} aria-expanded={showMessage}>Ваше сообщение <ChevronDown size={17} className={showMessage ? 'rotated' : ''}/></button>
    {showMessage && <p className="message-preview">{message}</p>}
    <div className="dialog-actions"><a className="button button-primary" href={telegramLink} target="_blank" rel="noopener noreferrer">Открыть Telegram <Send size={18}/></a><div className="dialog-secondary"><button type="button" className="button button-light" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Скопировано' : 'Скопировать текст'}</button><a className="button button-light" href={school.max} target="_blank" rel="noopener noreferrer">Написать в Max <ArrowUpRight size={18}/></a></div></div>
    <p className="dialog-note" role="status">{copyError ? 'Выделите сообщение выше и скопируйте его вручную.' : 'Сообщение отправляете вы. Для записи через Max сначала скопируйте текст. Данные не сохраняются на сайте.'}</p>
    <a className="dialog-phone" href={school.phoneHref}><Phone size={14}/> Или позвоните: {school.phone}</a>
  </dialog>;
}

function VenueGallery() {
  const [index, setIndex] = useState(0);
  const current = venues[index];
  return <div className="venue-gallery"><div className="venue-main"><img src={current.image} alt={`${current.title} СпортАкадемКлуба, фотография ${index + 1}`} width="1280" height="612" loading="lazy"/><div className="venue-overlay"><span className="venue-label">{current.label}</span><h3>{current.title}</h3><span>{String(index + 1).padStart(2, '0')} / {String(venues.length).padStart(2, '0')}</span></div><div className="gallery-controls"><button className="icon-button" onClick={() => setIndex((index - 1 + venues.length) % venues.length)} aria-label="Предыдущая фотография"><ArrowLeft size={19}/></button><button className="icon-button" onClick={() => setIndex((index + 1) % venues.length)} aria-label="Следующая фотография"><ArrowRight size={19}/></button></div></div><div className="venue-thumbnails" aria-label="Фотографии залов">{venues.map((venue, i) => <button key={venue.image} className={index === i ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Показать фото ${i + 1}: ${venue.title}`} aria-pressed={index === i}><img src={venue.image} alt="" width="1280" height="612" loading="lazy"/></button>)}</div></div>;
}

function Schedule() {
  const [groupIndex, setGroupIndex] = useState(0);
  const group = groups[groupIndex];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function moveTab(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % groups.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + groups.length) % groups.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = groups.length - 1;
    else return;
    event.preventDefault(); setGroupIndex(next); refs.current[next]?.focus();
  }
  return <><div className="schedule-tabs" role="tablist" aria-label="Возрастная группа">{groups.map((item, i) => <button key={item.id} role="tab" id={`tab-${item.id}`} ref={el => { refs.current[i] = el; }} aria-selected={groupIndex === i} aria-controls={`panel-${item.id}`} tabIndex={groupIndex === i ? 0 : -1} onClick={() => setGroupIndex(i)} onKeyDown={e => moveTab(e, i)}><strong>{item.ages}</strong><span>{item.label}</span></button>)}</div><div className="schedule-panel" id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`} tabIndex={0}><div className="schedule-description"><span className="eyebrow">{group.birthYears}</span><h3>{group.label}</h3><span>Тренировка — 60 минут</span></div><div className="schedule-days">{['Понедельник', 'Среда', 'Пятница'].map(day => <div key={day}><span className="day-label">{day}</span><strong>{group.time}</strong><span className="day-venue"><MapPin size={13}/>{group.venue}</span></div>)}</div></div></>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  function openEnrollment(plan: string | null = null) {
    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedPlan(plan); setMenuOpen(false); setEnrollmentOpen(true);
  }
  function closeEnrollment() { setEnrollmentOpen(false); requestAnimationFrame(() => lastFocusRef.current?.focus()); }
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus(); } }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main-content">Перейти к содержимому</a><div id="home"/>
    <header className="header"><div className="header-inner container"><Brand/><nav className="desktop-nav" aria-label="Основная навигация">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><button className="button button-dark header-cta" onClick={() => openEnrollment()}>На пробную <ArrowUpRight size={18}/></button><button className="menu-button icon-button" ref={menuButtonRef} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-nav">{menuOpen ? <X/> : <Menu/>}</button></div>{menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Мобильная навигация">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={18}/></a>)}<button className="button button-primary" onClick={() => openEnrollment()}>Бесплатная тренировка <ArrowUpRight size={18}/></button></nav>}</header>

    <main id="main-content">
      <section className="hero container" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> СпортАкадемКлуб · Москва</div><h1 id="hero-title">Маленький<br/>игрок.<br/><span>Большая</span><br/>история.</h1><p className="hero-description">Футбол для детей от 3 до 11 лет.<br/>Своя команда. Первые победы. Любовь к игре.</p><div className="hero-actions"><button className="button button-primary" onClick={() => openEnrollment()}>На бесплатную тренировку <ArrowUpRight size={21}/></button><a className="hero-more" href="#about" aria-label="Узнать больше о клубе"><ArrowDown size={20}/></a></div><div className="hero-bottom"><MapPin size={19}/><span>м. Черкизовская · м. Локомотив<br/><strong>Москва, Сиреневый бульвар, 4</strong></span></div></div><div className="hero-visual"><img className="hero-photo" src={assetPath('images/hero.png')} alt="Юный футболист в зелёно-жёлтой форме СпортАкадемКлуба с мячом" width="1672" height="941" fetchPriority="high"/><div className="hero-photo-shade"/><div className="visual-topline"><span>СПОРТАКАДЕМКЛУБ / СВОЯ КОМАНДА</span><span>03 — 11 ЛЕТ</span></div><div className="visual-bottomline"><span>ТВОЯ КОМАНДА.<br/>ТВОЯ ИСТОРИЯ.</span><span className="visual-coordinate">МОСКВА / ДЕТСКИЙ ФУТБОЛ</span></div><div className="visual-sticker"><span>Всё начинается</span><strong>С ИГРЫ</strong><ArrowUpRight size={28}/></div><div className="hero-age-badge"><strong>3–11</strong><span>ЛЕТ</span></div></div></section>

      <div className="ticker" aria-label="Официальный партнёр ДФК Спартак. Играй. Расти. Будь в команде."><div>{Array.from({ length: 4 }, (_, i) => <span className="ticker-group" aria-hidden={i > 0} key={i}>ИГРАЙ <span className="ticker-star"><Star/></span> РАСТИ <span className="ticker-star"><Star/></span> БУДЬ В КОМАНДЕ <span className="ticker-star"><Star/></span></span>)}</div></div>

      <section className="about section container" id="about" aria-labelledby="about-title"><div className="section-label"><span className="section-index">01 /</span> О клубе</div><div className="about-content"><div><h2 id="about-title">Футбол — больше,<br/>чем <span className="outlined-word">просто игра.</span></h2><div className="partner-badge"><span className="partner-symbol">С</span><span>Официальный партнёр<br/><strong>ДФК «Спартак»</strong></span></div></div><div className="about-text"><p>СпортАкадемКлуб — место, где дети учатся играть в футбол, развиваются и становятся частью настоящей команды.</p><p className="muted">Тренируем детей от 3 до 11 лет в Москве. Занятия проходят в игровой форме с учётом возраста и уровня подготовки. Развиваем координацию, скорость, выносливость и уверенность в себе.</p><p className="muted">Наша задача — привить любовь к спорту и помочь ребёнку получать удовольствие от каждой тренировки.</p></div></div><div className="values"><article><span className="value-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="11"/><path d="m16 9 6 4-2 7h-8l-2-7 6-4Zm0 0V5m6 8 6-2m-8 9 4 6m-12-6-4 6m2-13-6-2"/></svg></span><h3>Профессиональный подход</h3><p>Квалифицированный тренер,<br/>актуальная методика и игровые упражнения.</p></article><article><span className="value-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 26V16h7v10m0 0V11h7v15m0 0V5h7v21M4 26h25M5 11l5-5 5 2 7-6"/></svg></span><h3>Внимание к каждому</h3><p>Маленькие группы. Развитие<br/>в своём темпе и соревновательный опыт.</p></article><article><span className="value-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 27V12l12-8 12 8v15H4Zm4-12h20M12 27V16m8 11V16"/></svg></span><h3>Комфортные условия</h3><p>Современная инфраструктура<br/>и удобное расписание рядом с метро.</p></article></div></section>

      <section className="coach-section section" id="coaches" aria-labelledby="coach-title"><div className="container"><div className="section-label"><span className="section-index">02 /</span> Тренер</div><div className="coach-layout"><div className="coach-photo-wrap"><img src={assetPath('images/coach-artem.jpeg')} alt="Артём Трофимов — тренер СпортАкадемКлуба" width="891" height="1280" loading="lazy"/><span className="coach-license">ЛИЦЕНЗИЯ C–UEFA <ArrowUpRight size={16}/></span></div><div className="coach-copy"><span className="eyebrow">Наставник вашего ребёнка</span><h2 id="coach-title">Артём<br/><span>Трофимов.</span></h2><p className="coach-intro">Профессиональный футбольный опыт.<br/>Внимательный подход к юным игрокам.</p><div className="coach-facts"><div><span>Образование</span><p>Российский государственный университет физической культуры и спорта. Кафедра теории и методики футбола.</p></div><div><span>Достижения</span><p>Победитель Летнего Первенства Москвы 2025. Победитель и призёр всероссийских турниров.</p></div></div><details className="coach-details"><summary>Карьера и тренерский опыт <Plus size={18}/></summary><div><h3>Игровая карьера</h3><p>Воспитанник ФК «Химки», победитель зимнего первенства Москвы. ФК «Зоркий» (Красногорск), ФК «Знамя» (Ногинск).</p><h3>Тренерский опыт</h3><ul><li>2023–2024 — Академия FFC</li><li>2024 — стажировка в Академии «Спартак» им. Фёдора Черенкова</li><li>2024–2026 — Академия «Витязь» Москва</li><li>С 2026 года — ДФК «СпортАкадемКлуб»</li></ul><p>Победитель и призёр турниров по 2010 и 2011 г. р. Многократный чемпион и призёр ЛБЛ, МЧЛ, Кубка Офицеров и Winnergy Cup.</p></div></details><button className="text-link" onClick={() => openEnrollment()}>Познакомиться на тренировке <ArrowUpRight size={20}/></button></div></div></div></section>

      <section className="training section" id="program" aria-labelledby="training-title"><div className="container"><div className="section-label"><span className="section-index">03 /</span> Программа</div><div className="section-heading"><h2 id="training-title">От первого паса —<br/>к настоящей игре.</h2><p className="muted">Четыре основы развития юного футболиста.<br/>Один принцип — любовь к игре.</p></div><div className="training-grid">{methodology.map(item => <article className={`training-card card-${item.type}`} key={item.number}><div className="card-top"><span>{item.label}</span><span>{item.number}</span></div><PitchArt type={item.type === 'positive' ? 'first' : item.type}/><div className="card-body"><h3>{item.title}</h3><p>{item.description}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></div></section>

      <section className="venues-section section container" id="venues" aria-labelledby="venues-title"><div className="section-label"><span className="section-index">04 /</span> Залы</div><div className="section-heading"><h2 id="venues-title">Своя команда.<br/>Своё поле.</h2><p className="muted">Спортивный зал и крытый модуль.<br/>Москва, Сиреневый бульвар, 4.</p></div><VenueGallery/></section>

      <section className="schedule-section section" id="schedule" aria-labelledby="schedule-title"><div className="container"><div className="section-label"><span className="section-index">05 /</span> Расписание</div><div className="section-heading"><h2 id="schedule-title">Футбол в ритме<br/>вашей недели.</h2><p className="muted">Три тренировки в неделю.<br/>Выберите возрастную группу.</p></div><Schedule/><p className="schedule-note">Перед первым посещением согласуйте тренировку с администратором.</p></div></section>

      <section className="pricing-section section container" id="pricing" aria-labelledby="pricing-title"><div className="section-label"><span className="section-index">06 /</span> Стоимость</div><div className="section-heading"><h2 id="pricing-title">Выбирайте свой<br/>темп игры.</h2><div><span className="offer-label"><span className="status-dot"/> Специальная цена в октябре</span><p className="muted">Скидка на пробный абонемент.<br/>Количество мест ограничено.</p></div></div><div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.count}>{plan.featured && <span className="plan-feature-label">УВЕРЕННЫЙ ТЕМП</span>}<div className="plan-count">{plan.count}<span>{sessionWord(plan.count)}<br/>в месяц</span></div><h3>{plan.title}</h3><div className="price-old">{price(plan.regular)} ₽</div><div className="price-current">{price(plan.price)} <span>₽ / мес.</span></div><p className="per-session">{price(plan.perSession)} ₽ за тренировку</p><ul><li><Check size={15}/>Тренировка — 60 минут</li><li><Check size={15}/>Маленькие группы</li>{plan.freeze && <li><Check size={15}/>Заморозка на 7 дней</li>}</ul><button className={`button ${plan.featured ? 'button-primary' : 'button-outline'}`} onClick={() => openEnrollment(`${plan.count} ${sessionWord(plan.count)} в месяц — ${price(plan.price)} ₽`)}>Выбрать абонемент <ArrowUpRight size={19}/></button></article>)}</div><div className="single-session"><div><span>Хотите заниматься без абонемента?</span><h3>Разовая тренировка</h3></div><div><del>1 650 ₽</del><strong>1 350 ₽ <span>/ занятие</span></strong></div><button className="text-link" onClick={() => openEnrollment('Разовая тренировка — 1 350 ₽')}>Записаться <ArrowUpRight size={19}/></button></div><p className="pricing-note">Специальные цены действуют на пробный абонемент в октябре. Подробные условия акции уточняйте у администратора.</p></section>

      <section className="join-section container" aria-labelledby="join-title"><div className="join-copy"><span className="eyebrow">Первая тренировка — бесплатно</span><h2 id="join-title">Пусть первым<br/>будет <span>футбол.</span></h2><p>Один шаг. Один мяч. И целый мир открытий впереди.</p><button className="button button-primary" onClick={() => openEnrollment()}>Попробовать бесплатно <ArrowUpRight size={22}/></button></div><div className="join-art" aria-hidden="true"><svg viewBox="0 0 500 480" fill="none"><circle cx="330" cy="240" r="169" stroke="currentColor"/><circle cx="330" cy="240" r="115" stroke="currentColor"/><path d="M330 12v456M102 240h456" stroke="currentColor"/><path d="m175 350 220-220m-110 0h110v110" stroke="var(--yellow)" strokeWidth="38"/></svg><span>БОЛЬШАЯ ИСТОРИЯ<br/>НАЧИНАЕТСЯ НА ПОЛЕ.</span></div></section>

      <section className="faq section container" aria-labelledby="faq-title"><div><div className="section-label"><span className="section-index">/</span> Перед тренировкой</div><h2 id="faq-title">Всё начинается<br/>с простого шага.</h2><p className="muted">Ответы на вопросы родителей.</p></div><div className="faq-list">{faqs.map((item, i) => <article className={`faq-item ${activeFaq === i ? 'is-open' : ''}`} key={item.question}><h3><button id={`faq-question-${i}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i} aria-controls={`faq-answer-${i}`}>{item.question}<Plus size={21}/></button></h3><div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} hidden={activeFaq !== i}><p>{item.answer}</p></div></article>)}</div></section>

      <section className="contacts-section section" id="contacts" aria-labelledby="contacts-title"><div className="container"><div className="section-label"><span className="section-index">07 /</span> Контакты</div><div className="contacts-layout"><div><h2 id="contacts-title">Увидимся<br/><span>на поле.</span></h2><a className="contact-phone" href={school.phoneHref}>{school.phone}<ArrowUpRight size={26}/></a><div className="contact-socials"><a className="button button-dark" href={school.telegram} target="_blank" rel="noopener noreferrer">Telegram <Send size={16}/></a><a className="button button-outline" href={school.max} target="_blank" rel="noopener noreferrer">Max <ArrowUpRight size={19}/></a></div><div className="contact-hours"><span>На связи</span><p>Пн–пт: 09:00–21:00<br/>Сб: 09:00–20:00 · Вс: выходной</p></div></div><div className="address-card"><div className="address-graphic" aria-hidden="true"><svg viewBox="0 0 500 240" fill="none"><path d="M-25 80 550 190M-10 155 510 45M130-20l110 290M350-20l-65 280" stroke="currentColor" strokeWidth="20"/><circle cx="278" cy="123" r="32" fill="var(--brand-green)"/><path d="M278 108c-9 0-15 6-15 15s15 23 15 23 15-14 15-23-6-15-15-15Z" fill="var(--yellow)"/><circle cx="278" cy="122" r="5" fill="var(--brand-green)"/></svg></div><div className="address-info"><span className="eyebrow">м. Черкизовская · м. Локомотив</span><h3>Сиреневый бульвар, 4</h3><p>Москва</p><a className="text-link" href={school.map} target="_blank" rel="noopener noreferrer">Открыть в Яндекс Картах <ArrowUpRight size={18}/></a></div></div></div></div></section>
    </main>

    <footer className="footer"><div className="container"><div className="footer-top"><Brand light/><div className="footer-invitation">Игра <span>объединяет.</span><ArrowUpRight size={38}/></div></div><div className="footer-middle"><p>Футбол для детей от 3 до 11 лет.<br/>Официальный партнёр ДФК «Спартак».</p><nav aria-label="Навигация в подвале">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="footer-contacts"><a href={school.phoneHref}>{school.phone}</a><span>Москва, Сиреневый бульвар, 4</span><a href={school.telegram} target="_blank" rel="noopener noreferrer">Telegram <ArrowUpRight size={15}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} СпортАкадемКлуб.</span><span>Большая история начинается с первого паса.</span><a href="#home">Наверх <ArrowUpRight size={15}/></a></div></div></footer>
    {enrollmentOpen && <EnrollmentDialog onClose={closeEnrollment} selectedPlan={selectedPlan}/>}
  </>;
}
