import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Icon from './icons';
import { assetPath, faqs, groups, methodology, navigation, plans, school, venues } from './content';

/* THESIS: A club's green and yellow matchday identity, with the child and the first training at its centre.
 * OWN-WORLD: Deep green fields, yellow actions, clear white space, the supplied circular club crest.
 * STORY: Meet the club and coach, find a group and price, arrange a free training with the manager.
 * FIRST VIEWPORT: Green invitation at left, school illustration at right, yellow CTA and location below.
 * FORM: Brief-pinned modern football academy; original sections, palette and verified school content.
 */

const price = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
const sessionWord = (count: number) => count === 4 ? 'тренировки' : 'тренировок';

function Collapse({ open, children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { open: boolean; children: ReactNode }) {
  return <div {...props} className={`collapse ${className}`} data-open={open} aria-hidden={!open} inert={!open}>
    <div className="collapse-inner">{children}</div>
  </div>;
}

function CoachDetails({ id, children, label = 'Карьера и тренерский опыт' }: { id: string; children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return <div className="coach-details" data-open={open}>
    <button type="button" className="coach-details-toggle" id={`${id}-toggle`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(previous => !previous)}>
      {label} <Icon name="plus" size={16}/>
    </button>
    <Collapse open={open} id={id} role="region" aria-labelledby={`${id}-toggle`}><div className="coach-details-content">{children}</div></Collapse>
  </div>;
}

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#home" aria-label="СпортАкадемКлуб: на главную">
    <img className="brand-crest" src={assetPath('images/club-logo.jpg')} width="60" height="60" alt=""/>
    <span className="brand-wordmark">СПОРТ<span className="brand-second">АКАДЕМКЛУБ</span><span className="brand-caption">ДЕТСКИЙ ФУТБОЛЬНЫЙ КЛУБ</span></span>
  </a>;
}

function PitchArt({ type }: { type: string }) {
  return <svg viewBox="0 0 400 220" fill="none" className="pitch-art" aria-hidden="true">
    <rect x="55" y="28" width="290" height="164" rx="1" stroke="currentColor" strokeOpacity=".2"/>
    <path d="M200 28v164M55 64h52v92H55m290-92h-52v92h52" stroke="currentColor" strokeOpacity=".2"/>
    <circle cx="200" cy="110" r="40" stroke="currentColor" strokeOpacity=".2"/>
    {type === 'first' && <><path d="M125 147c0-43 37-23 37-63s42-20 42 20 41 29 72-39" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6"/><circle cx="124" cy="147" r="13" fill="currentColor"/><path d="m264 66 14-6-1 15" stroke="currentColor" strokeWidth="2"/><circle cx="205" cy="111" r="7" stroke="currentColor" strokeWidth="2"/></>}
    {type === 'technique' && <><path d="m129 140 71-63 73 64" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6"/><circle cx="129" cy="140" r="13" fill="currentColor"/><circle cx="200" cy="77" r="13" fill="currentColor"/><circle cx="273" cy="141" r="13" fill="currentColor"/><path d="M-9-5 0 0-9 5" transform="translate(164.5 108.5) rotate(-41.58)" stroke="currentColor" strokeWidth="2"/><path d="M-9-5 0 0-9 5" transform="translate(236.5 109) rotate(41.24)" stroke="currentColor" strokeWidth="2"/></>}
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
    <button type="button" className="dialog-close icon-button" onClick={onClose} aria-label="Закрыть"><Icon name="close" size={24}/></button>
    <span className="eyebrow"><span className="status-dot"/> Первая тренировка бесплатно</span>
    <h2 id="dialog-title">Первый пас.<br/>Первая команда.</h2>
    <p className="dialog-intro">Расскажите немного о ребёнке. Подготовим сообщение для менеджера. Вам останется отправить его в Telegram.</p>
    {selectedPlan && <div className="selected-plan"><Icon name="check" size={16}/>{selectedPlan}</div>}
    <div className="dialog-fields"><div><label className="field-label" htmlFor="parent-name">Ваше имя <span>необязательно</span></label><input id="parent-name" type="text" autoComplete="given-name" maxLength={80} placeholder="Как к вам обращаться" value={name} onChange={e => { setName(e.target.value); setCopied(false); }}/></div><div><label className="field-label" htmlFor="child-age">Возраст ребёнка</label><select id="child-age" value={age} onChange={e => { setAge(e.target.value); setCopied(false); }}><option value="">Выберите возраст</option>{Array.from({ length: 9 }, (_, i) => i + 3).map(n => <option key={n} value={n}>{n} {n === 3 || n === 4 ? 'года' : 'лет'}</option>)}</select></div></div>
    <fieldset className="experience"><legend>Опыт игры</legend><div className="experience-options">{['Пока не играл', 'Играет во дворе', 'Уже тренировался'].map(option => <label key={option} className={experience === option ? 'selected' : ''}><input type="radio" name="experience" value={option} checked={experience === option} onChange={() => { setExperience(option); setCopied(false); }}/>{option}{experience === option && <Icon name="check" size={16}/>}</label>)}</div></fieldset>
    <button type="button" className="message-toggle" onClick={() => setShowMessage(!showMessage)} aria-expanded={showMessage} aria-controls="message-preview">Ваше сообщение <Icon name="chevron" size={16} className={showMessage ? 'rotated' : ''}/></button>
    <Collapse open={showMessage} id="message-preview"><p className="message-preview">{message}</p></Collapse>
    <div className="dialog-actions"><a className="button button-primary" href={telegramLink} target="_blank" rel="noopener noreferrer">Открыть Telegram <Icon name="send" size={16}/></a><div className="dialog-secondary"><button type="button" className="button button-light" onClick={copy}>{copied ? <Icon name="check" size={16}/> : <Icon name="copy" size={16}/>} {copied ? 'Скопировано' : 'Скопировать текст'}</button><a className="button button-light" href={school.max} target="_blank" rel="noopener noreferrer">Написать в Max <Icon name="up-right" size={16}/></a></div></div>
    <p className="dialog-note" role="status">{copyError ? 'Выделите сообщение выше и скопируйте его вручную.' : 'Сообщение отправляете вы. Для записи через Max сначала скопируйте текст. Данные не сохраняются на сайте.'}</p>
    <a className="dialog-phone" href={school.phoneHref}><Icon name="phone" size={16}/> Или позвоните: {school.phone}</a>
  </dialog>;
}

function VenuePhoto({ venue, index, requested, active, base, onReady, onSettled }: { venue: typeof venues[number]; index: number; requested: boolean; active: boolean; base: boolean; onReady: (index: number) => void; onSettled: () => void }) {
  const [state, setState] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [visited, setVisited] = useState(requested);
  useEffect(() => { if (requested) setVisited(true); }, [requested]);
  async function loaded(image: HTMLImageElement) {
    try { await image.decode(); setState('ready'); onReady(index); }
    catch { setState('error'); }
  }
  return <>
    {(visited || requested) && <img key={attempt} src={venue.image} srcSet={venue.srcSet} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1050px) calc(100vw - 64px), (max-width: 1416px) calc(100vw - 96px), 1320px" alt={`${venue.title} СпортАкадемКлуба, фотография ${index + 1}`} width={venue.width} height={venue.height} loading="lazy" decoding="async" data-state={state} data-active={active} data-base={base} aria-hidden={!active} onLoad={event => loaded(event.currentTarget)} onError={() => setState('error')} onTransitionEnd={event => { if (event.propertyName === 'opacity' && active) onSettled(); }}/>}
    {requested && state !== 'ready' && <div className="venue-photo-state" role="status">
      <p>{state === 'loading' ? 'Загружаем фотографию…' : 'Не удалось загрузить фотографию.'}</p>
        {state === 'error' && <button className="button button-primary" onClick={event => { event.currentTarget.closest('.venue-gallery')?.querySelector<HTMLButtonElement>('.gallery-controls button')?.focus(); setState('loading'); setAttempt(attempt + 1); }}>Повторить загрузку</button>}
    </div>}
  </>;
}

function VenueGallery() {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState<number[]>([]);
  const [shown, setShown] = useState<number | null>(null);
  const [base, setBase] = useState<number | null>(null);
  useEffect(() => {
    if (ready.includes(index) && shown !== index) { setBase(shown); setShown(index); }
  }, [index, ready, shown]);
  const current = venues[index];
  return <div className="venue-gallery">
    <div className="venue-main">{venues.map((venue, i) => <VenuePhoto key={venue.image} venue={venue} index={i} requested={index === i} active={shown === i} base={base === i} onReady={loaded => setReady(previous => previous.includes(loaded) ? previous : [...previous, loaded])} onSettled={() => setBase(null)}/>)}</div>
    <div className="venue-footer">
      <div className="venue-overlay"><h3>{current.title}</h3><span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(venues.length).padStart(2, '0')}</span></div>
      <div className="venue-thumbnails" role="group" aria-label="Фотографии залов">{venues.map((venue, i) => <button key={venue.image} className={index === i ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Показать фото ${i + 1}: ${venue.title}`} aria-pressed={index === i}><img src={venue.thumbnail} alt="" width="320" height="213" loading="lazy" decoding="async"/></button>)}</div>
      <div className="gallery-controls"><button className="icon-button" onClick={() => setIndex(previous => (previous - 1 + venues.length) % venues.length)} aria-label="Предыдущая фотография"><Icon name="left" size={20}/></button><button className="icon-button" onClick={() => setIndex(previous => (previous + 1) % venues.length)} aria-label="Следующая фотография"><Icon name="right" size={20}/></button></div>
    </div>
  </div>;
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
  return <><div className="schedule-tabs" role="tablist" aria-label="Возрастная группа">{groups.map((item, i) => <button key={item.id} role="tab" id={`tab-${item.id}`} ref={el => { refs.current[i] = el; }} aria-selected={groupIndex === i} aria-controls={`panel-${item.id}`} tabIndex={groupIndex === i ? 0 : -1} onClick={() => setGroupIndex(i)} onKeyDown={e => moveTab(e, i)}><strong>{item.ages}</strong><span>{item.label}</span></button>)}</div><div key={group.id} className="schedule-panel" id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`} tabIndex={0}><div className="schedule-description"><span className="eyebrow">{group.birthYears}</span><h3>{group.label}</h3><span>Тренировка: 60 минут</span></div><div className="schedule-days">{['Понедельник', 'Среда', 'Пятница'].map(day => <div key={day}><span className="day-label">{day}</span><strong>{group.time}</strong><span className="day-venue"><Icon name="location" size={16}/>{group.venue}</span></div>)}</div></div></>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (document.getElementById('vk-pixel')) return;
    const tracker = window as typeof window & { _tmr?: { id: string; type: string; start: number }[] };
    tracker._tmr ??= [];
    tracker._tmr.push({ id: '3793562', type: 'pageView', start: Date.now() });
    const script = document.createElement('script');
    script.id = 'vk-pixel';
    script.async = true;
    script.src = 'https://top-fwz1.mail.ru/js/code.js';
    document.head.append(script);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = document.querySelectorAll('main .section h2, .coach-photo-wrap, .training-grid, .venue-gallery, .pricing-grid, .join-art, .address-card');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        entry.target.classList.add('motion-enter');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    function observe() {
      observer.disconnect();
      if (!preference.matches) targets.forEach(target => {
        if (!target.classList.contains('motion-enter')) observer.observe(target);
      });
    }
    observe();
    preference.addEventListener('change', observe);
    return () => { observer.disconnect(); preference.removeEventListener('change', observe); };
  }, []);

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
    <header className="header"><div className="header-inner container"><Brand/><nav className="desktop-nav" aria-label="Основная навигация">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><button className="button button-dark header-cta" onClick={() => openEnrollment()}>На пробную</button><button className="menu-button icon-button" ref={menuButtonRef} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-nav">{menuOpen ? <Icon name="close"/> : <Icon name="menu"/>}</button></div><Collapse open={menuOpen} className="menu-collapse"><nav id="mobile-nav" className="mobile-nav" aria-label="Мобильная навигация">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<button className="button button-primary" onClick={() => openEnrollment()}>Бесплатная тренировка</button></nav></Collapse></header>

    <main id="main-content">
    <section className="hero container" aria-labelledby="hero-title"><div className="hero-copy"><h1 id="hero-title"><span className="hero-title-line">Футбол</span>{' '}<span className="hero-title-line">начинается</span>{' '}<span className="hero-title-line">с детства.</span></h1><p className="hero-description">Футбол для детей от 3 до 11 лет.<br/>Своя команда. Первые победы. Любовь к игре.</p><div className="hero-actions"><button className="button button-primary" onClick={() => openEnrollment()}>На бесплатную тренировку</button><a className="hero-more" href="#about" aria-label="Узнать больше о клубе"><Icon name="down" size={20}/></a></div><div className="hero-bottom"><Icon name="location" size={20}/><span>м. Черкизовская · м. Локомотив<br/><strong>Москва, Сиреневый бульвар, 4</strong></span></div></div><div className="hero-visual"><img className="hero-photo" src={assetPath('images/hero-training-uniform.jpg')} alt="Дети в зелёно-жёлтой форме учатся вести мяч на футбольной тренировке" width="1254" height="1254" fetchPriority="high"/><div className="hero-photo-shade"/><div className="visual-bottomline"><span>ТВОЯ КОМАНДА.<br/>ТВОЯ ИСТОРИЯ.</span></div></div></section>

      <section className="partnership section container" id="partnership" aria-labelledby="partnership-title">
        <div className="partnership-heading">
          <h2 id="partnership-title">Сотрудничество<br/>с ДФК «Спартак»</h2>
          <div className="partner-badge"><img className="partner-crest" src={assetPath('images/spartak-logo.webp')} width="56" height="56" alt="Эмблема ДФК «Спартак»" loading="lazy"/><span>Официальный партнёр<br/><strong>ДФК «Спартак»</strong></span></div>
        </div>
        <ul className="partnership-benefits">
          <li><Icon name="check" size={20}/><strong>Ребёнок тренируется в системе, связанной с профессиональным футбольным клубом.</strong></li>
          <li><Icon name="check" size={20}/><strong>У талантливых игроков появляется дополнительная возможность быть замеченными.</strong></li>
          <li><Icon name="check" size={20}/><strong>Больше возможностей для игровой практики и соревнований.</strong></li>
          <li><Icon name="check" size={20}/><span>В тренировочном процессе используется методика ДФК Спартак.</span></li>
          <li><Icon name="check" size={20}/><span>Куратор ДФК Спартак отслеживает контроль качества тренировочного процесса и соответствия работы заявленным стандартам клуба.</span></li>
        </ul>
      </section>

      <section className="about section container" id="about" aria-labelledby="about-title"><div className="section-label">О клубе</div><div className="about-content"><div><h2 id="about-title">Больше,<br/>чем <span className="outlined-word">просто игра.</span></h2></div><div className="about-text"><p>В СпортАкадемКлубе дети учатся играть в футбол, развиваются и становятся частью настоящей команды.</p><p className="muted">Тренируем детей от 3 до 11 лет в Москве. Занятия проходят в игровой форме с учётом возраста и уровня подготовки. Развиваем координацию, скорость, выносливость и уверенность в себе.</p><p className="muted">Наша задача – не просто научить ребёнка играть в футбол, а привить любовь к спорту, помочь ему стать увереннее и получать удовольствие от каждой тренировки.</p></div></div><div className="values"><article><span className="value-icon"><Icon name="football" size={32}/></span><h3>Профессиональный подход</h3><p>Квалифицированный тренер,<br/>актуальная методика и игровые упражнения.</p></article><article><span className="value-icon"><Icon name="care" size={32}/></span><h3>Внимание к каждому</h3><p>Маленькие группы.<br/>Развитие в своём темпе и соревновательный опыт.</p></article><article><span className="value-icon"><Icon name="building" size={32}/></span><h3>Комфортные условия</h3><p>Современная инфраструктура<br/>и удобное расписание рядом с метро.</p></article></div></section>

      <section className="coach-section section" id="coaches" aria-labelledby="coaches-title"><div className="container"><h2 className="section-label coaches-title" id="coaches-title">Тренеры</h2><div className="coach-layout"><div className="coach-photo-wrap"><img src={assetPath('images/coach-artem-upscaled.jpg')} alt="Артем Михайлович Трофимов, старший тренер СпортАкадемКлуба" width="1046" height="1503" loading="lazy"/><span className="coach-license">ЛИЦЕНЗИЯ C–UEFA</span></div><div className="coach-copy"><span className="eyebrow">Старший тренер</span><h2 id="coach-title">Артем Михайлович<br/><span>Трофимов</span></h2><p className="coach-intro">Профессиональный футбольный опыт.<br/>Внимательный подход к юным игрокам.</p><div className="coach-facts"><div><span>Образование</span><p>Российский государственный университет физической культуры и спорта. Кафедра теории и методики футбола.</p></div><div><span>Достижения</span><p>Победитель Летнего Первенства Москвы 2025. Победитель и призёр всероссийских турниров.</p></div></div><CoachDetails id="artem-career"><h3>Игровая карьера</h3><p>Воспитанник ФК «Химки», победитель зимнего первенства Москвы.</p><ul><li>ФК «Зоркий» (Красногорск)</li><li>ФК «Знамя» (Ногинск)</li></ul><h3>Тренерский опыт</h3><ul><li>Академия FFC</li><li>2024: стажировка в Академии «Спартак» им. Фёдора Черенкова</li><li>Академия «Витязь» Москва</li><li>ДФК «СпортАкадемКлуб»</li></ul><p>Победитель и призёр турниров по 2010 и 2011 г. р. Многократный чемпион и призёр ЛБЛ, МЧЛ, Кубка Офицеров и Winnergy Cup.</p></CoachDetails><button className="text-link" onClick={() => openEnrollment()}>Познакомиться на тренировке</button></div></div><article className="coach-layout coach-methodist coach-secondary" aria-labelledby="methodist-title"><div className="coach-photo-wrap coach-methodist-portrait coach-square-portrait"><img src={assetPath('images/coach-methodist-portrait-upscaled.jpg')} alt="Портрет Ираклия Шалвовича Геленавы, тренера-методиста СпортАкадемКлуба" width="1254" height="1254" loading="lazy"/><span className="coach-license">ЛИЦЕНЗИЯ B–UEFA</span></div><div className="coach-copy"><span className="eyebrow">Тренер-методист</span><h2 id="methodist-title">Ираклий Шалвович<br/><span>Геленава</span></h2><div className="coach-facts"><div><span>Образование</span><p>Высшее образование, МФПА.</p></div><div><span>Достижения</span><p>Чемпион мира среди юношеских команд по футболу 1987 г.<br/>Мастер спорта по футболу СССР.</p></div></div><CoachDetails id="methodist-career"><h3>Игровая карьера</h3><ul><li>Динамо Сухуми</li><li>ФК Цхуми</li></ul><h3>Тренерский опыт</h3><ul><li>Barca Academy Moscow</li><li>Академия FFC</li><li>Академия Витязь</li><li>ДЮФА ЦСКА</li><li>Школа Динамо</li></ul></CoachDetails><button className="text-link" onClick={() => openEnrollment()}>Познакомиться на тренировке</button></div></article><article className="coach-layout coach-curator coach-secondary" aria-labelledby="curator-title">
          <div className="coach-photo-wrap coach-curator-portrait coach-square-portrait"><img src={assetPath('images/coach-curator-upscaled.webp')} alt="Валерий Валерьевич Цимбал, куратор ДФК Спартак" width="1208" height="1302" loading="lazy" decoding="async"/><span className="coach-license">ЛИЦЕНЗИЯ C–UEFA</span></div>
          <div className="coach-copy">
            <span className="eyebrow">Куратор ДФК «Спартак»</span>
            <h2 id="curator-title">Валерий Валерьевич<br/><span>Цимбал</span></h2>
            <p className="coach-intro">Контроль качества тренировочного процесса и соответствия работы стандартам клуба.</p>
            <div className="coach-facts">
              <div><span>Подготовка тренера</span><p>Центр подготовки детско-юношеских тренеров по футболу имени К. И. Бескова.</p></div>
              <div><span>Стаж работы тренером</span><p>6 лет</p></div>
            </div>
            <CoachDetails id="curator-biography" label="Образование и достижения">
              <h3>Образование</h3>
              <ul>
                <li><strong>Московский институт физической культуры и спорта</strong><br/>Факультет физической культуры, 2015–2020.</li>
                <li><strong>ГБОУ СПО Педагогический колледж № 18 «Митино»</strong><br/>Специальность: физическая культура, 2011–2015.</li>
                <li><strong>Центр подготовки детско-юношеских тренеров по футболу имени К. И. Бескова</strong><br/>Тренерская лицензия C–UEFA.</li>
              </ul>
              <h3>Личные достижения</h3>
              <ul>
                <li><strong>2002–2003:</strong> лучший игрок школы ДЮСШ «Зоркий».</li>
                <li><strong>2004, 2005, 2006:</strong> чемпион Московской области по футболу.</li>
                <li><strong>2008:</strong> чемпион Москвы по футболу.</li>
                <li><strong>2011:</strong> победитель спартакиады Московской области по футболу.</li>
                <li><strong>2013:</strong> чемпион Москвы среди ГБОУ СПО по мини-футболу.</li>
                <li><strong>2012, 2013, 2014:</strong> чемпион Кубка К. И. Бескова среди ГБОУ СПО по мини-футболу.</li>
                <li><strong>2015:</strong> серебряный призёр чемпионата России среди ГБОУ СПО по мини-футболу.</li>
                <li><strong>2011:</strong> первый взрослый разряд по футболу.</li>
              </ul>
            </CoachDetails>
          </div>
        </article></div></section>

      <section className="training section" id="program" aria-labelledby="training-title"><div className="container"><div className="section-label">Программа</div><div className="section-heading"><h2 id="training-title">От первого паса<br/>к настоящей игре.</h2><p className="muted">Четыре основы развития юного футболиста.<br/>В основе всего любовь к игре.</p></div><div className="training-grid">{methodology.map(item => <article className={`training-card card-${item.type}`} key={item.type}><div className="card-top"><span>{item.label}</span></div><PitchArt type={item.type === 'positive' ? 'first' : item.type}/><div className="card-body"><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></div></section>

      <section className="venues-section section container" id="venues" aria-labelledby="venues-title"><div className="section-label">Зал</div><div className="section-heading"><h2 id="venues-title">Своя команда.<br/>Своё поле.</h2><p className="muted">Все группы тренируются в зале.<br/>Москва, Сиреневый бульвар, 4.</p></div><VenueGallery/></section>

      <section className="schedule-section section" id="schedule" aria-labelledby="schedule-title"><div className="container"><div className="section-label">Расписание</div><div className="section-heading"><h2 id="schedule-title">Футбол в ритме<br/>вашей недели.</h2><p className="muted">Три тренировки в неделю.<br/>Выберите возрастную группу.</p></div><Schedule/><p className="schedule-note">Перед первым посещением согласуйте тренировку с менеджером.</p></div></section>

      <section className="pricing-section section container" id="pricing" aria-labelledby="pricing-title"><div className="section-label">Стоимость</div><div className="section-heading"><h2 id="pricing-title">Выбирайте свой<br/>темп игры.</h2><div><span className="offer-label"><span className="status-dot"/> Специальная цена в октябре</span><p className="muted">Скидка на пробный абонемент.<br/>Количество мест ограничено.</p></div></div><div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.count}>{plan.featured && <span className="plan-feature-label">ПОЛНАЯ ИГРА</span>}<div className="plan-count">{plan.count}<span>{sessionWord(plan.count)}<br/>в месяц</span></div><h3>{plan.title}</h3><div className="price-old">{price(plan.regular)} ₽</div><div className="price-current">{price(plan.price)} <span>₽ / мес.</span></div><p className="per-session">{price(plan.perSession)} ₽ за тренировку</p><ul><li><Icon name="check" size={16}/>Тренировка: 60 минут</li><li><Icon name="check" size={16}/>Маленькие группы</li>{plan.freeze && <li><Icon name="check" size={16}/>Заморозка абонемента на 7 календарных дней</li>}</ul><button className={`button ${plan.featured ? 'button-primary' : 'button-outline'}`} onClick={() => openEnrollment(`${plan.count} ${sessionWord(plan.count)} в месяц: ${price(plan.price)} ₽`)}>Выбрать абонемент</button></article>)}</div><div className="single-session"><div><span>Хотите заниматься без абонемента?</span><h3>Разовая тренировка</h3></div><div><del>1 650 ₽</del><strong>1 350 ₽ <span>/ занятие</span></strong></div><button className="text-link" onClick={() => openEnrollment('Разовая тренировка: 1 350 ₽')}>Записаться</button></div><p className="pricing-note">Специальные цены действуют на пробный абонемент в октябре. Подробные условия акции уточняйте у менеджера.</p></section>

      <section className="join-section container" aria-labelledby="join-title"><div className="join-copy"><span className="eyebrow">Первая тренировка бесплатно</span><h2 id="join-title">Пусть первым<br/>будет <span>футбол.</span></h2><p>Один шаг. Один мяч. И целый мир открытий впереди.</p><button className="button button-primary" onClick={() => openEnrollment()}>Записаться на тренировку</button></div><div className="join-art" aria-hidden="true"><svg viewBox="0 0 500 480" fill="none"><circle cx="330" cy="240" r="169" stroke="currentColor"/><circle cx="330" cy="240" r="115" stroke="currentColor"/><path d="M330 12v456M102 240h456" stroke="currentColor"/><path d="m175 350 220-220m-110 0h110v110" stroke="var(--yellow)" strokeWidth="38"/></svg><span>БОЛЬШАЯ ИСТОРИЯ<br/>НАЧИНАЕТСЯ НА ПОЛЕ.</span></div></section>

      <section className="faq section container" aria-labelledby="faq-title"><div><div className="section-label">Перед тренировкой</div><h2 id="faq-title">Всё начинается<br/>с простого шага.</h2><p className="muted">Ответы на вопросы родителей.</p></div><div className="faq-list">{faqs.map((item, i) => <article className={`faq-item ${activeFaq === i ? 'is-open' : ''}`} key={item.question}><h3><button id={`faq-question-${i}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i} aria-controls={`faq-answer-${i}`}>{item.question}<Icon name="plus" size={20}/></button></h3><Collapse open={activeFaq === i} id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`}><p>{item.answer}</p></Collapse></article>)}</div></section>

      <section className="contacts-section section" id="contacts" aria-labelledby="contacts-title"><div className="container"><div className="section-label">Контакты</div><div className="contacts-layout"><div><h2 id="contacts-title">Увидимся<br/><span>на поле.</span></h2><a className="contact-phone" href={school.phoneHref}>{school.phone}<Icon name="phone" size={24}/></a><div className="contact-socials"><a className="button button-dark" href={school.telegram} target="_blank" rel="noopener noreferrer">Telegram <Icon name="send" size={16}/></a><a className="button button-outline" href={school.max} target="_blank" rel="noopener noreferrer">Max <Icon name="up-right" size={20}/></a></div><div className="contact-hours"><span>Время работы</span><p>Пн–пт: 09:00–21:00<br/>Сб: 09:00–20:00 · Вс: выходной</p></div></div><div className="address-card"><iframe className="address-map" src={school.mapWidget} title="Яндекс Карты: Москва, Сиреневый бульвар, 4" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/><div className="address-info"><span className="eyebrow">м. Черкизовская · м. Локомотив</span><h3>Сиреневый бульвар, 4</h3><p>Москва</p><a className="text-link" href={school.map} target="_blank" rel="noopener noreferrer">Открыть в Яндекс Картах <Icon name="up-right" size={16}/></a></div></div></div></div></section>
    </main>

    <footer className="footer"><div className="container"><div className="footer-top"><Brand light/><div className="footer-invitation">Игра <span>объединяет.</span></div></div><div className="footer-middle"><p>Футбол для детей от 3 до 11 лет.<br/>Официальный партнёр ДФК «Спартак».</p><nav aria-label="Навигация в подвале"><a href="#partnership">Сотрудничество</a>{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="footer-contacts"><a href={school.phoneHref}>{school.phone}</a><span>Москва, Сиреневый бульвар, 4</span><a href={school.telegram} target="_blank" rel="noopener noreferrer">Telegram <Icon name="up-right" size={16}/></a><a href={school.vk} target="_blank" rel="noopener noreferrer">ВКонтакте <Icon name="up-right" size={16}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} СпортАкадемКлуб</span><a href="https://icons8.com/" target="_blank" rel="noopener noreferrer">Иконки: Icons8 <Icon name="up-right" size={16}/></a></div></div></footer>
    {enrollmentOpen && <EnrollmentDialog onClose={closeEnrollment} selectedPlan={selectedPlan}/>}
  </>;
}
