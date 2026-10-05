import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH || 'playwright');
const out = process.env.FOOTBALL_SCREENSHOTS || '/tmp/football-smoke';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.FOOTBALL_BROWSER ? { executablePath: process.env.FOOTBALL_BROWSER } : {}) });
async function checkTouchTargets(page) {
  const small = await page.locator('a, button, summary').evaluateAll(elements => elements.filter(el => el.getClientRects().length).map(el => {
    const { width, height } = el.getBoundingClientRect();
    return { text: el.textContent.trim().slice(0, 50), width, height };
  }).filter(el => el.width < 44 || el.height < 44));
  assert.deepEqual(small, [], 'Every visible control must have a 44 × 44 px target');
}
async function checkDisclosure(page, target, trigger) {
  await page.locator(trigger).first().scrollIntoViewIfNeeded();
  for (const opening of [true, false]) {
    const heights = await page.evaluate(async ({ target, trigger }) => {
      const content = document.querySelector(target);
      const samples = [content.getBoundingClientRect().height];
      document.querySelector(trigger).click();
      const start = performance.now();
      await new Promise(resolve => {
        function sample() {
          samples.push(content.getBoundingClientRect().height);
          if (performance.now() - start < 400) requestAnimationFrame(sample); else resolve();
        }
        requestAnimationFrame(sample);
      });
      return samples;
    }, { target, trigger });
    assert(new Set(heights.map(Math.round)).size > 2, `${target} must animate height in both directions`);
    assert(opening ? heights.at(-1) > heights[0] : heights.at(-1) < heights[0]);
  }
  await page.evaluate(async trigger => {
    for (let i = 0; i < 6; i++) {
      document.querySelector(trigger).click();
      await new Promise(requestAnimationFrame);
    }
  }, trigger);
  await page.waitForTimeout(350);
  assert(await page.locator(target).first().evaluate(el => el.matches('details') ? !el.open : el.inert && el.getBoundingClientRect().height === 0), `${target} must settle closed after rapid input`);
}
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  await context.route('https://yandex.ru/map-widget/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="ru"><title>Карта: проверка встраивания</title><body>Яндекс Карты</body></html>' }));
  let pixelRequests = 0;
  await context.route('https://top-fwz1.mail.ru/**', route => {
    pixelRequests++;
    return route.fulfill({ contentType: 'application/javascript', body: 'window.__pixelEvents = [...window._tmr];' });
  });
  const page = await context.newPage();
  const errors = [];
  const galleryRequests = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (/hall-\d+-(?:768|1600)\.webp$/.test(path)) galleryRequests.push(path);
  });
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(process.env.FOOTBALL_BASE_URL || 'http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.locator('.hero').waitFor();
  await page.waitForFunction(() => window.__pixelEvents?.length === 1);
  assert.equal(pixelRequests, 1, 'Pixel must load once per page, including React StrictMode');
  assert.deepEqual(await page.evaluate(() => window.__pixelEvents.map(({id, type}) => ({id, type}))), [{ id: '3793562', type: 'pageView' }]);
  assert.equal(await page.locator('#privacy-options, .privacy-actions').count(), 0, 'Consent popup must be removed');
  assert.equal(await page.getByRole('button', { name: 'Настройки ВК-пикселя' }).count(), 0);
  console.log('VK pixel 3793562: automatic single initialization, no consent popup (provider stub): passed');
  assert(await page.locator('.hero, .hero *').evaluateAll(elements => elements.every(el => {
    const style = getComputedStyle(el);
    return style.animationName === 'none' && style.transform === 'none' && style.clipPath === 'none' && style.opacity === '1';
  })), 'First screen must be fully visible without entrance animations');
  await page.locator('.hero-photo').evaluate(img => img.decode());
  await page.evaluate(() => document.fonts.ready);
  const masks = await page.locator('.icon').evaluateAll(elements => [...new Set(elements.map(el => getComputedStyle(el).maskImage.match(/url\(["']?(.*?)["']?\)/)?.[1]))]);
  assert(masks.length >= 12, 'Page icons must use local masks');
  const iconSet = JSON.parse(readFileSync(new URL('../icons8.json', import.meta.url)));
  const iconUrls = Object.keys(iconSet.icons.items).map(name => new URL(`icons/${name}.png`, page.url()).href);
  assert(masks.every(url => iconUrls.includes(url)), 'Only the selected Icons8 set is used');
  for (const url of iconUrls) {
    assert.equal(new URL(url).origin, new URL(page.url()).origin, 'Icon must load locally');
    const icon = await context.request.get(url);
    assert.equal(icon.status(), 200);
    const png = await icon.body();
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 96);
    assert.equal(png.readUInt32BE(20), 96);
  }
  assert.equal(await page.getByRole('link', { name: 'Иконки: Icons8' }).getAttribute('href'), 'https://icons8.com/');
  console.log('17 local Icons8 PNGs and attribution: passed');
  assert.equal(await page.locator('.hero-title-line').count(), 3);
  for (const id of ['partnership', 'about', 'coaches', 'program', 'venues', 'schedule', 'pricing', 'contacts']) assert.equal(await page.locator(`#${id}`).count(), 1);
  for (const [property, value] of Object.entries({ '--brand-green': '#11651a', '--yellow': '#ffdd2d', '--red': '#db320b' })) assert.equal(await page.evaluate(p => getComputedStyle(document.documentElement).getPropertyValue(p).trim(), property), value);
  for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(50); }
  await page.waitForFunction(() => [...document.querySelectorAll('img')].every(img => img.complete && img.naturalWidth > 0));
  assert(await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)));
  const upscaledPhotos = page.locator('.coach-photo-wrap > img[src$="-upscaled.jpg"]');
  assert.equal(await upscaledPhotos.count(), 2);
  assert(await upscaledPhotos.evaluateAll(images => images.every(img => img.currentSrc.includes('-upscaled.jpg') && (img.currentSrc.includes('methodist-portrait') ? img.naturalWidth > 358 : img.naturalWidth > img.naturalHeight ? img.naturalWidth > 1280 : img.naturalHeight > 1280))), 'Both coaches must use higher-resolution replacements');
  assert.equal(await page.locator('.venue-thumbnails img').count(), 4);
  assert(await page.locator('.venue-thumbnails img').evaluateAll(images => images.every(img => img.currentSrc.endsWith('-thumb.webp') && img.naturalWidth === 320 && img.naturalHeight === 213)), 'Thumbnails must use small dedicated files');
  assert(galleryRequests.length > 0 && galleryRequests.every(path => /hall-1-(?:768|1600)\.webp$/.test(path)), 'Unselected full-size photos must not load with the gallery');
  for (let id = 1; id <= 4; id++) {
    for (const variant of ['768', '1600', 'thumb']) {
      const file = readFileSync(new URL(`../public/images/hall-${id}-${variant}.webp`, import.meta.url));
      assert.equal(file.subarray(0, 4).toString(), 'RIFF');
      assert.equal(file.subarray(8, 12).toString(), 'WEBP');
      assert(file.length < (variant === 'thumb' ? 12000 : variant === '768' ? 70000 : 300000), 'Gallery files must stay within the byte budget');
    }
  }
  assert((await page.locator('.hero-photo').getAttribute('src')).endsWith('hero-training-uniform.jpg'), 'Use the first photo with the corrected uniform');
  assert.equal(await page.locator('.brand-crest').count(), 2);
  const map = page.locator('.address-map');
  const mapUrl = new URL(await map.getAttribute('src'));
  assert.equal(mapUrl.origin, 'https://yandex.ru');
  assert.equal(mapUrl.pathname, '/map-widget/v1/');
  assert.equal(mapUrl.searchParams.get('ll'), '37.760081,55.801081');
  assert.equal(mapUrl.searchParams.get('pt'), '37.760081,55.801081,pm2rdm');
  assert.equal(await map.getAttribute('title'), 'Яндекс Карты: Москва, Сиреневый бульвар, 4');
  assert.equal(await map.getAttribute('loading'), 'lazy');
  console.log('Yandex widget URL, source coordinates, title and lazy loading (provider stub): passed');
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/desktop.png`, fullPage: true });
  await page.screenshot({ path: `${out}/desktop-hero.png` });
  for (const id of ['partnership', 'coaches', 'program', 'schedule', 'pricing', 'contacts']) await page.locator(`#${id}`).screenshot({ path: `${out}/${id}.png` });
  await page.locator('.coach-methodist').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('.coach-methodist').screenshot({ path: `${out}/methodist-desktop.png` });
  await page.locator('#venues').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#venues').screenshot({ path: `${out}/venues-desktop.png` });
  console.log('School sections, palette, crest and images: passed');
  assert.equal(await page.locator('#coaches .coach-layout').count(), 3);
  assert.equal(await page.locator('#coaches-title').innerText(), 'Тренеры');
  assert.equal(await page.locator('#curator-title').innerText(), 'Валерий Валерьевич\nЦимбал');
  assert.equal(await page.locator('.coach-curator img').count(), 1);
  assert((await page.locator('.coach-curator img').getAttribute('src')).endsWith('coach-curator-upscaled.webp'));
  assert(await page.locator('.coach-curator img').evaluate(img => img.naturalWidth >= 1000 && img.naturalHeight >= 1000), 'Curator portrait must have higher resolution');
  assert.equal(await page.locator('a[href*="spartakpd.ru/cimbal"]').count(), 0, 'Biography must be on this site');
  await page.locator('#curator-biography-toggle').click();
  await page.waitForTimeout(350);
  assert.equal(await page.locator('#curator-biography ul').count(), 2);
  assert.equal(await page.locator('#curator-biography li').count(), 11);
  const curatorBiography = await page.locator('.coach-curator').innerText();
  for (const text of ['6 лет', '2015–2020', '№ 18 «Митино»', '2011–2015', 'К. И. Бескова', '2002–2003', '«Зоркий»', '2004, 2005, 2006', '2008', 'спартакиады', '2013', '2012, 2013, 2014', 'серебряный призёр', 'первый взрослый разряд']) assert(curatorBiography.includes(text), `Missing curator biography: ${text}`);
  await page.locator('#curator-biography-toggle').click();
  assert.equal(await page.locator('.partnership-benefits li').count(), 5);
  assert.equal(await page.locator('.partnership-benefits strong').count(), 3);
  assert(await page.evaluate(() => Boolean(document.querySelector('#partnership').compareDocumentPosition(document.querySelector('#about')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await page.locator('footer').getByRole('link', { name: 'ВКонтакте' }).getAttribute('href'), 'https://vk.ru/dfc_sportacade');
  assert((await page.locator('.footer-privacy > p').innerText()).includes('не сохраняются на сайте'));

  assert.equal(await page.locator('#coach-title').innerText(), 'Артем Михайлович\nТрофимов');
  assert.deepEqual(await page.locator('.coach-license').allInnerTexts(), ['ЛИЦЕНЗИЯ C–UEFA', 'ЛИЦЕНЗИЯ B–UEFA', 'ЛИЦЕНЗИЯ C–UEFA']);
  assert.equal(await page.locator('.coach-copy .eyebrow').first().innerText(), 'СТАРШИЙ ТРЕНЕР');
  assert.equal(await page.locator('#methodist-title').innerText(), 'Ираклий Шалвович\nГеленава');
  assert.equal(await page.locator('.coach-methodist img').count(), 1);
  assert((await page.locator('.coach-methodist img').getAttribute('src')).endsWith('coach-methodist-portrait-upscaled.jpg'));
  const methodistText = await page.locator('.coach-methodist').innerText();
  for (const text of ['МФПА', '1987', 'Мастер спорта по футболу СССР']) assert(methodistText.includes(text));
  await page.locator('.coach-details-toggle').first().click();
  await page.waitForTimeout(350);
  const artemExperience = await page.locator('.coach-details').first().innerText();
  assert(artemExperience.includes('2024: стажировка'));
  assert(!/2023|2026|2024–/.test(artemExperience));
  await page.locator('.coach-details-toggle').first().click();
  await page.locator('.coach-details-toggle').nth(1).click();
  await page.waitForTimeout(350);
  const methodistCareer = await page.locator('.coach-details').nth(1).innerText();
  for (const text of ['Динамо Сухуми', 'ФК Цхуми', 'Barca Academy Moscow', 'Академия FFC', 'Академия Витязь', 'ДЮФА ЦСКА', 'Школа Динамо']) assert(methodistCareer.includes(text));
  await page.locator('.coach-details-toggle').nth(1).click();
  assert(!/модул|администратор|Артём/i.test(await page.locator('main').innerText()));
  assert.equal(await page.locator('.price-card.featured').count(), 1);
  assert((await page.locator('.price-card.featured .price-current').innerText()).replaceAll(/\s/g, '').includes('9800'));
  assert.equal(await page.locator('.price-card').nth(1).evaluate(el => el.classList.contains('featured')), false);
  await page.getByRole('tab', { name: '3–5 лет Младшая группа' }).click();
  assert.equal(await page.getByRole('tabpanel').getByText('Зал', { exact: true }).count(), 3);
  console.log('Coach roles and histories, hall-only schedule and 12-session pricing emphasis: passed');

  const trigger = page.getByRole('button', { name: 'На бесплатную тренировку', exact: true });
  await trigger.click();
  assert((await page.locator('.dialog-intro').innerText()).includes('для менеджера'));
  await page.getByLabel('Возраст ребёнка').selectOption('7');
  await page.getByLabel('Ваше имя').fill('Анна');
  await page.getByText('Уже тренировался', { exact: true }).click();
  await page.getByRole('button', { name: 'Ваше сообщение' }).click();
  const message = await page.locator('.message-preview').innerText();
  assert(message.includes('Возраст: 7 лет.') && message.includes('Анна') && message.includes('уже тренировался'));
  const link = new URL(await page.getByRole('link', { name: 'Открыть Telegram' }).getAttribute('href'));
  assert.equal(link.hostname, 't.me');
  assert.equal(link.pathname, '/sportacadem');
  assert.equal(link.searchParams.get('text'), message);
  await page.getByRole('button', { name: 'Скопировать текст' }).click();
  await page.getByRole('button', { name: 'Скопировано', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), message);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').count(), 0);
  await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
  // Clipboard denial must keep the message available for manual copying.
  await trigger.click();
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied'); }; });
  await page.getByRole('button', { name: 'Скопировать текст' }).click();
  await page.getByText('Выделите сообщение выше и скопируйте его вручную.').waitFor();
  assert(await page.locator('.message-preview').isVisible());
  await page.keyboard.press('Escape');
  console.log('Enrollment, encoded message, clipboard success/failure, Escape and focus: passed');
  await page.getByRole('button', { name: 'Когда проходят тренировки?' }).click();
  await page.locator('#faq-answer-1').waitFor({ state: 'visible' });
  await page.getByRole('tab', { name: '6–8 лет Средняя группа' }).click();
  assert.equal(await page.getByRole('tabpanel').getByText('19:00–20:00', { exact: true }).count(), 3);
  await page.getByRole('tab', { name: '6–8 лет Средняя группа' }).press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: '9–11 лет Старшая группа' }).getAttribute('aria-selected'), 'true');
  await page.getByRole('button', { name: 'Следующая фотография', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Показать фото 2: Спортивный зал' }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.venue-thumbnails button').count(), 4);
  assert.equal(await page.locator('.venue-overlay h3').innerText(), 'Спортивный зал');
  for (const photo of [3, 4]) {
    await page.getByRole('button', { name: `Показать фото ${photo}: Спортивный зал` }).click();
    await page.waitForFunction(photo => {
      const img = document.querySelector('.venue-main > img[data-active="true"]');
      return img?.dataset.state === 'ready' && img.currentSrc.includes(`hall-${photo}-`);
    }, photo);
    assert.equal(await page.locator('.venue-overlay > span').innerText(), `0${photo} / 04`);
    await page.waitForTimeout(350);
    await page.locator('.venue-gallery').screenshot({ path: `${out}/gallery-photo-${photo}.png` });
  }
  await page.getByRole('button', { name: 'Показать фото 2: Спортивный зал' }).click();
  // Fast input must leave the final selected photo visible after its transition.
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Следующая фотография', exact: true }).click();
  await page.waitForTimeout(400);
  assert.equal(await page.getByRole('button', { name: 'Показать фото 1: Спортивный зал' }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.venue-main > img[data-active="true"]').evaluate(el => getComputedStyle(el).opacity), '1');
  await page.locator('.price-card').nth(1).getByRole('button', { name: 'Выбрать абонемент' }).click();
  assert((await page.locator('.selected-plan').innerText()).replaceAll(/\s/g, '').includes('7480'));
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  console.log('FAQ, schedule keyboard controls, gallery and pricing: passed');
  for (const width of [320, 375, 390, 640, 768, 900, 1024, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(100);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
    assert(await page.locator('h1').evaluate(el => el.scrollWidth <= el.clientWidth), `Heading overflow at ${width}`);
    assert(await page.locator('#methodist-title').evaluate(el => el.scrollWidth <= el.clientWidth), `Coach name overflow at ${width}`);
    assert(await page.locator('#partnership-title, #curator-title').evaluateAll(elements => elements.every(el => el.scrollWidth <= el.clientWidth)), `New heading overflow at ${width}`);
    const galleryLayout = await page.locator('.venue-gallery').evaluate(el => {
      const frame = el.querySelector('.venue-main').getBoundingClientRect();
      const caption = el.querySelector('.venue-overlay').getBoundingClientRect();
      const controls = el.querySelector('.gallery-controls').getBoundingClientRect();
      const thumbnails = [...el.querySelectorAll('.venue-thumbnails button')].map(button => button.getBoundingClientRect());
      return caption.top >= frame.bottom && controls.top >= frame.bottom && caption.right <= controls.left && thumbnails.every(thumb => thumb.top >= frame.bottom && thumb.width / thumb.height >= 1.4 && thumb.width / thumb.height <= 1.6);
    });
    assert(galleryLayout, `Gallery captions, controls and landscape thumbnails must fit below the photo at ${width}`);
    assert(await page.locator('.coach-methodist-portrait').evaluate(el => {
      const frame = el.getBoundingClientRect();
      const portrait = el.querySelector('img').getBoundingClientRect();
      return Math.abs(frame.width - frame.height) < 1 && portrait.width === frame.width && portrait.height === frame.height;
    }), `Coach portrait must fill its square frame at ${width}`);
    await checkTouchTargets(page);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.hero-photo').evaluate(img => img.decode());
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, 0); });
  await page.waitForFunction(() => scrollY === 0);
  await page.screenshot({ path: `${out}/mobile-hero.png` });
  await page.screenshot({ path: `${out}/mobile.png`, fullPage: true });
  for (const [selector, name] of [['#partnership', 'partnership-mobile'], ['.coach-curator', 'curator-mobile'], ['.coach-methodist', 'methodist-mobile']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator(selector).screenshot({ path: `${out}/${name}.png` });
  }
  await page.locator('#venues').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#venues').screenshot({ path: `${out}/venues-mobile.png` });
  await page.getByRole('button', { name: 'На бесплатную тренировку', exact: true }).click();
  await page.locator('dialog').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  await checkTouchTargets(page);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.locator('.menu-collapse').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.menu-collapse')?.getBoundingClientRect().height === 0);
  assert.equal(await page.locator('.menu-collapse').getAttribute('inert'), '');
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.locator('#mobile-nav').getByRole('link', { name: 'Расписание' }).click();
  await page.waitForFunction(() => document.querySelector('.menu-collapse')?.getBoundingClientRect().height === 0);
  assert.equal(await page.locator('.menu-collapse').getAttribute('inert'), '');
  for (const a of await page.locator('a[href^="#"]').all()) assert.equal(await page.locator(await a.getAttribute('href')).count(), 1);
  const reduced = await context.newPage();
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  await reduced.goto(page.url(), { waitUntil: 'load' });
  assert.equal(await reduced.locator('.hero-title-line').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await reduced.locator('.motion-enter').count(), 0);
  await reduced.locator('#program').scrollIntoViewIfNeeded();
  assert.equal(await reduced.locator('#program h2').evaluate(el => getComputedStyle(el).opacity), '1');
  await reduced.emulateMedia({ reducedMotion: 'no-preference' });
  await reduced.waitForFunction(() => document.querySelector('#program h2')?.classList.contains('motion-enter'));
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0);
  await reduced.close();
  console.log('Motion, rapid gallery input and live reduced-motion preference: passed');
  const disclosures = await context.newPage();
  await disclosures.setViewportSize({ width: 390, height: 844 });
  await disclosures.goto(page.url(), { waitUntil: 'load' });
  await disclosures.evaluate(() => document.fonts.ready);
  await disclosures.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await disclosures.locator('#faq-question-0').click();
  await disclosures.waitForTimeout(350);
  for (let i = 0; i < 4; i++) await checkDisclosure(disclosures, `#faq-answer-${i}`, `#faq-question-${i}`);
  await checkDisclosure(disclosures, '#artem-career', '#artem-career-toggle');
  await checkDisclosure(disclosures, '#methodist-career', '#methodist-career-toggle');
  await checkDisclosure(disclosures, '#curator-biography', '#curator-biography-toggle');
  await disclosures.locator('.coach-details-toggle').first().press('Enter');
  assert.equal(await disclosures.locator('.coach-details-toggle').first().getAttribute('aria-expanded'), 'true');
  await disclosures.locator('.coach-details-toggle').first().press('Enter');
  await disclosures.waitForTimeout(350);
  await checkDisclosure(disclosures, '.menu-collapse', '.menu-button');
  await disclosures.locator('.menu-button').focus();
  await disclosures.keyboard.press('Tab');
  assert(await disclosures.evaluate(() => !document.activeElement.closest('#mobile-nav')), 'Collapsed menu links must be skipped by Tab');
  await disclosures.getByRole('button', { name: 'На бесплатную тренировку', exact: true }).click();
  await disclosures.locator('dialog').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  await checkDisclosure(disclosures, '#message-preview', '.message-toggle');
  await disclosures.emulateMedia({ reducedMotion: 'reduce' });
  await disclosures.locator('.message-toggle').click();
  assert.equal(await disclosures.evaluate(() => document.getAnimations().length), 0);
  assert((await disclosures.locator('#message-preview').boundingBox()).height > 0);
  await disclosures.locator('.message-toggle').click();
  assert.equal((await disclosures.locator('#message-preview').boundingBox()).height, 0);
  await disclosures.close();
  console.log('Disclosure opening/closing heights, rapid input, keyboard and reduced motion: passed');
  const fades = await context.newPage();
  await fades.setViewportSize({ width: 390, height: 844 });
  let releaseNext;
  const nextImageGate = new Promise(resolve => { releaseNext = resolve; });
  await fades.route(/\/images\/hall-2-(?:768|1600)\.webp$/, async route => { await nextImageGate; await route.continue(); });
  await fades.goto(page.url(), { waitUntil: 'domcontentloaded' });
  await fades.locator('.venue-main').scrollIntoViewIfNeeded();
  await fades.waitForFunction(() => document.querySelector('.venue-main > img[data-active="true"]')?.dataset.state === 'ready');
  assert((await fades.locator('.venue-main > img[data-active="true"]').evaluate(img => img.currentSrc)).endsWith('hall-1-768.webp'), 'Mobile must select the smaller responsive image');
  await fades.waitForTimeout(700);
  await fades.getByRole('button', { name: 'Следующая фотография', exact: true }).click();
  await fades.getByRole('status').filter({ hasText: 'Загружаем фотографию' }).waitFor();
  assert((await fades.locator('.venue-main > img[data-active="true"]').getAttribute('src')).includes('hall-1-'));
  assert.equal(await fades.locator('.venue-main > img[data-active="true"]').evaluate(el => getComputedStyle(el).opacity), '1', 'Previous photo must remain opaque while the next loads');
  releaseNext();
  await fades.waitForFunction(() => [...document.querySelectorAll('.venue-main > img')].every(img => img.dataset.state === 'ready'));
  await fades.waitForTimeout(350);
  const fadeEvidence = await fades.locator('.venue-main').evaluate(async frame => {
    const images = [...frame.querySelectorAll(':scope > img')];
    const height = frame.getBoundingClientRect().height;
    const samples = [];
    const transitions = [];
    for (let i = 0; i < 5; i++) {
      const before = samples.length;
      frame.closest('.venue-gallery').querySelector(i % 2 === 0 ? 'button[aria-label="Предыдущая фотография"]' : 'button[aria-label="Следующая фотография"]').click();
      const start = performance.now();
      await new Promise(resolve => {
        function sample() {
          const styles = images.map(img => getComputedStyle(img));
          samples.push({ covered: styles.some(style => style.visibility === 'visible' && Number(style.opacity) === 1), fixed: styles.every(style => style.transform === 'none'), stable: frame.getBoundingClientRect().height === height, blending: styles.some(style => Number(style.opacity) > 0 && Number(style.opacity) < 1) });
          if (performance.now() - start < 350) requestAnimationFrame(sample); else resolve();
        }
        requestAnimationFrame(sample);
      });
      transitions.push(samples.slice(before).some(sample => sample.blending));
    }
    return { samples, transitions, retained: images.every((img, i) => img === frame.querySelectorAll(':scope > img')[i]) };
  });
  assert(fadeEvidence.retained, 'Switching must keep decoded image elements');
  assert(fadeEvidence.samples.every(sample => sample.covered && sample.fixed && sample.stable), 'No blank frames, scaling or gallery height shifts');
  assert(fadeEvidence.transitions.every(Boolean), 'Each forward/backward change must fade gradually');
  await fades.close();
  console.log('Gallery holds previous photo, retains decoded images and fades without blank/scaled frames: passed');
  const gallery = await context.newPage();
  await gallery.setViewportSize({ width: 320, height: 900 });
  await gallery.emulateMedia({ reducedMotion: 'reduce' });
  let releaseImage;
  let blockImage = true;
  const imageGate = new Promise(resolve => { releaseImage = resolve; });
  await gallery.route(/\/images\/hall-1-(?:768|1600)\.webp$/, async route => {
    if (blockImage) { await imageGate; await route.abort(); }
    else await route.continue();
  });
  await gallery.goto(page.url(), { waitUntil: 'domcontentloaded' });
  await gallery.locator('.venue-main').scrollIntoViewIfNeeded();
  await gallery.getByRole('status').filter({ hasText: 'Загружаем фотографию' }).waitFor();
  const frameBefore = await gallery.locator('.venue-main').boundingBox();
  releaseImage();
  await gallery.getByText('Не удалось загрузить фотографию.').waitFor();
  const frameError = await gallery.locator('.venue-main').boundingBox();
  assert.equal(frameError.height, frameBefore.height, 'An image error must not shift the gallery frame');
  await checkTouchTargets(gallery);
  await gallery.locator('#venues').screenshot({ path: `${out}/gallery-error.png` });
  blockImage = false;
  await gallery.getByRole('button', { name: 'Повторить загрузку' }).press('Enter');
  await gallery.waitForFunction(() => document.querySelector('.venue-main > img[data-active="true"]')?.dataset.state === 'ready');
  assert(await gallery.locator('.venue-main > img[data-active="true"]').evaluate(img => img.naturalWidth > 0));
  assert.equal(await gallery.locator('.venue-photo-state').count(), 0);
  assert(await gallery.getByRole('button', { name: 'Предыдущая фотография', exact: true }).evaluate(el => el === document.activeElement), 'Retry must preserve a useful keyboard focus');
  await gallery.close();
  console.log('44 px targets, delayed photo, image failure, retry and keyboard recovery: passed');
  assert.deepEqual(errors, []);
  console.log('9 responsive widths, mobile menu, anchors and browser errors: passed');
} finally { await browser.close(); }
