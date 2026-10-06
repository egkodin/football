import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { createElement, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

const temp = await mkdtemp('node_modules/.football-seo-');
try {
  await build({
    build: {
      ssr: true,
      outDir: temp,
      rollupOptions: {
        input: { App: 'src/App.tsx', content: 'src/content.ts' },
        output: { entryFileNames: '[name].mjs', chunkFileNames: '[name]-[hash].mjs' },
      },
    },
  });
  const { default: App } = await import(pathToFileURL(resolve(temp, 'App.mjs')));
  const { school, plans } = await import(pathToFileURL(resolve(temp, 'content.mjs')));
  const url = school.url;
  const clubId = `${url}#club`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['SportsActivityLocation', 'EducationalOrganization'],
        '@id': clubId,
        name: school.name,
        url,
        description: 'Детский футбольный клуб в Москве. Тренировки для детей от 3 до 11 лет у метро Черкизовская и Локомотив.',
        telephone: school.phoneHref.slice(4),
        logo: new URL('images/club-logo.jpg', url).href,
        image: new URL('images/hero-training-uniform.jpg', url).href,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Сиреневый бульвар, 4',
          addressLocality: 'Москва',
          addressCountry: 'RU',
        },
        hasMap: school.map,
        sameAs: [school.telegram, school.vk, school.max],
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '21:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Тренировки по футболу для детей',
          itemListElement: plans.map(plan => ({
            '@type': 'Offer',
            name: `${plan.count} ${plan.count === 4 ? 'тренировки' : 'тренировок'} в месяц: ${plan.title}`,
            price: plan.price,
            priceCurrency: 'RUB',
            validThrough: '2026-10-31',
            url: `${url}#pricing`,
            seller: { '@id': clubId },
            itemOffered: { '@type': 'Service', name: `Абонемент: ${plan.count} ${plan.count === 4 ? 'тренировки' : 'тренировок'} по футболу`, provider: { '@id': clubId } },
          })),
        },
      },
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: school.name, inLanguage: 'ru-RU', publisher: { '@id': clubId } },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: 'Футбол для детей в Москве, Черкизовская | СпортАкадемКлуб', inLanguage: 'ru-RU', isPartOf: { '@id': `${url}#website` }, about: { '@id': clubId } },
    ],
  };
  const markup = renderToString(createElement(StrictMode, null, createElement(App)));
  const template = await readFile('dist/index.html', 'utf8');
  if (!template.includes('<div id="root"></div>') || !template.includes('<!-- structured-data -->')) {
    throw new Error('Не найдены точки вставки HTML или структурированных данных');
  }
  const html = template
    .replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
    .replace('<!-- structured-data -->', () => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
  await writeFile('dist/index.html', html);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>\n`);
  console.log(`Prerender: ${markup.length} characters of HTML; schema, robots.txt and sitemap.xml generated`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
