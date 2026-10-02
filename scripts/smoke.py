# Functional smoke checks for the cloud development environment.
# Start the Vite server first. Requires Python Playwright and system Chromium.
import os
from pathlib import Path

output_dir = Path('/tmp/football-smoke')
output_dir.mkdir(parents=True, exist_ok=True)
base_url = os.environ.get('FOOTBALL_BASE_URL', 'http://127.0.0.1:5173/')
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1050},device_scale_factor=1,permissions=['clipboard-read','clipboard-write'])
 page=context.new_page()
 errors=[]
 page.on('pageerror', lambda e: errors.append(str(e)))
 response=page.goto(base_url,wait_until='networkidle')
 page.evaluate('document.fonts.ready')
 assert response.status==200
 assert 'СпортАкадемКлуб' in page.title()
 print('HTTP and title: passed')
 for anchor in ['about','coaches','program','venues','schedule','pricing','contacts']:
  assert page.locator('#'+anchor).count()==1
 print('Original school sections: 7 passed')
 for y in range(0, page.evaluate('document.body.scrollHeight'), 750):
  page.evaluate('(y)=>window.scrollTo(0,y)',y);page.wait_for_timeout(60)
 page.wait_for_load_state('networkidle')
 page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(400)
 page.screenshot(path='/tmp/football-smoke/desktop-final.png',full_page=True)
 page.screenshot(path='/tmp/football-smoke/desktop-hero-final.png',full_page=False)
 assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--brand-green').trim()")=='#11651a'
 assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim()")=='#ffdd2d'
 assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--red').trim()")=='#db320b'
 print('Original palette: passed')
 assert page.locator('img').evaluate_all('(imgs) => imgs.every(img => img.complete && img.naturalWidth > 0)')
 print('Local images: passed')
 page.get_by_role('button',name='На бесплатную тренировку',exact=True).click()
 page.get_by_label('Возраст ребёнка').select_option('7')
 page.get_by_label('Ваше имя').fill('Анна')
 page.get_by_text('Уже тренировался',exact=True).click()
 page.get_by_role('button',name='Ваше сообщение').click()
 msg=page.locator('.message-preview').inner_text()
 assert 'Возраст: 7 лет.' in msg and 'Анна' in msg and 'уже тренировался' in msg
 link=page.get_by_role('link',name='Открыть Telegram').get_attribute('href')
 assert link.startswith('https://t.me/sportacadem?text=')
 page.get_by_role('button',name='Скопировать текст').click()
 page.get_by_role('button',name='Скопировано',exact=True).wait_for(state='visible',timeout=3000)
 assert page.evaluate('navigator.clipboard.readText()')==msg
 print('Enrollment personalization, Telegram, clipboard: passed')
 page.keyboard.press('Escape')
 assert page.locator('dialog').count()==0
 assert page.get_by_role('button',name='На бесплатную тренировку',exact=True).evaluate('(el)=>document.activeElement===el')
 print('Dialog keyboard closing and focus restoration: passed')
 page.get_by_role('button',name='Когда проходят тренировки?').click()
 assert page.locator('#faq-answer-1').is_visible()
 print('FAQ toggle: passed')
 page.get_by_role('tab',name='6–8 лет Средняя группа').click()
 assert page.get_by_role('tabpanel').get_by_text('19:00–20:00',exact=True).count()==3
 page.get_by_role('tab',name='6–8 лет Средняя группа').press('ArrowRight')
 assert page.get_by_role('tab',name='9–11 лет Старшая группа').get_attribute('aria-selected')=='true'
 print('Schedule selection and keyboard navigation: passed')
 page.get_by_role('button',name='Следующая фотография',exact=True).click()
 assert page.get_by_role('button',name='Показать фото 2: Спортивный зал').get_attribute('aria-pressed')=='true'
 page.get_by_role('button',name='Показать фото 3: Крытый футбольный модуль').click()
 assert page.locator('.venue-overlay h3').inner_text()=='Крытый футбольный модуль'
 print('Venue gallery controls: passed')
 page.locator('.price-card').nth(1).get_by_role('button',name='Выбрать абонемент').click()
 assert '7 480' in page.locator('.selected-plan').inner_text() or '7\u00a0480' in page.locator('.selected-plan').inner_text()
 page.get_by_role('button',name='Закрыть',exact=True).click()
 print('Pricing selection: passed')
 widths=[320,375,390,640,768,900,1024,1200,1440]
 for width in widths:
  page.set_viewport_size({'width':width,'height':900})
  page.wait_for_timeout(100)
  assert not page.evaluate('document.documentElement.scrollWidth > window.innerWidth'), f'Overflow at {width}'
 print('Responsive widths:',len(widths),'passed')
 page.set_viewport_size({'width':390,'height':844})
 page.goto(base_url,wait_until='networkidle')
 page.screenshot(path='/tmp/football-smoke/mobile-final.png',full_page=True)
 page.screenshot(path='/tmp/football-smoke/mobile-hero-final.png',full_page=False)
 page.get_by_role('button',name='Открыть меню').click()
 assert page.locator('#mobile-nav').is_visible()
 page.locator('#mobile-nav').get_by_role('link',name='Расписание').click()
 assert page.locator('#mobile-nav').count()==0
 print('Mobile menu navigation: passed')
 for a in page.locator('a[href^="#"]').all():
  assert page.locator(a.get_attribute('href')).count()==1
 print('Internal navigation anchors: passed')
 print('Browser errors:',errors)
 assert not errors
 context.close();browser.close()
