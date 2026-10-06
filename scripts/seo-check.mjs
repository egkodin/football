import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
const title = html.match(/<title>(.*?)<\/title>/)[1];
const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
assert.equal(canonical, 'https://cfc-sportacadem.ru/');
assert(title.includes('Футбол для детей в Москве') && title.includes('Черкизовская'));
assert(description.includes('3–11') && description.includes('бесплатную'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
assert.equal((html.match(/<main\b/g) || []).length, 1);
assert(!/noindex|nofollow|<div id="root"><\/div>/.test(html));
assert(/<html lang="ru"/.test(html));
assert(/name="yandex-verification" content="58005c97a2740b91"/.test(html));
for (const text of ['Сиреневый бульвар, 4', 'Трофимов', 'Геленава', 'Цимбал', 'Как записаться', 'panel-junior', 'panel-middle', 'panel-senior', '+7 985 335 40 92']) assert(html.includes(text), `Missing prerendered content: ${text}`);
assert.equal((html.match(/role="tabpanel"/g) || []).length, 3);
assert.equal((html.match(/role="tabpanel"[^>]*hidden=""|hidden=""[^>]*role="tabpanel"/g) || []).length, 2);
assert.equal((html.match(/type="application\/ld\+json"/g) || []).length, 1);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const club = schema['@graph'].find(item => item['@id'] === `${canonical}#club`);
assert(club['@type'].includes('SportsActivityLocation'));
assert.equal(club.url, canonical);
assert.equal(club.telephone, '+79853354092');
assert.equal(club.address.addressLocality, 'Москва');
assert(html.includes(club.address.streetAddress));
assert(!JSON.stringify(schema).match(/aggregateRating|review|FAQPage|SearchAction/));
assert.deepEqual(club.hasOfferCatalog.itemListElement.map(offer => offer.price), [4500, 7480, 9800]);
for (const offer of club.hasOfferCatalog.itemListElement) {
  assert.equal(offer.priceCurrency, 'RUB');
  assert(html.includes(new Intl.NumberFormat('ru-RU').format(offer.price)));
  assert.equal(offer.validThrough, '2026-10-31');
}
for (const name of ['og:type', 'og:locale', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) assert(html.includes(`property="${name}"`));
assert(html.includes(`property="og:url" content="${canonical}"`));
assert(html.includes('name="twitter:card" content="summary_large_image"'));
const robots = readFileSync('dist/robots.txt', 'utf8');
assert(robots.includes('User-agent: *\nAllow: /'));
assert(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
assert(sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9'));
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), [canonical]);
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|tel:)/.test(match[1])) continue;
  assert(existsSync(`dist/${match[1].replace(/^\.\//, '')}`), `Missing resource: ${match[1]}`);
}
for (const size of [768, 1254]) {
  assert(html.includes(`images/hero-training-${size}.webp`));
  assert(statSync(`dist/images/hero-training-${size}.webp`).size < statSync('dist/images/hero-training-uniform.jpg').size / 2);
}
console.log('SEO: complete HTML, metadata, canonical, schema, prices, sitemap, robots and assets passed');
