// Run against a local development server. No email is sent or opened.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.env.SITE_URL || 'http://127.0.0.1:8000/';
const localUrl = (path) => new URL(path, base).href;

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    const failedResponses = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    assert.equal((await page.goto(base)).status(), 200);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });

    for (const width of [1440, 1024, 900, 768, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Horizontal overflow at ${width}px`);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('.nav-toggle');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert(await toggle.evaluate((element) => element === document.activeElement));
    await toggle.click();
    await page.locator('.main-nav a[href="#work"]').click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

    const serviceDetails = page.locator('.service-card details').first();
    await serviceDetails.locator('summary').click();
    assert.notEqual(await serviceDetails.getAttribute('open'), null);
    await page.locator('a[data-service="orgentwicklung"]').first().click();
    assert.equal(await page.locator('#booking-service').inputValue(), 'orgentwicklung');

    await page.locator('.methods-disclosure > summary').click();
    const skill = page.locator('.skill-leaf').first();
    await skill.click();
    assert.equal(await skill.getAttribute('aria-expanded'), 'true');
    assert(await page.locator('.skill-leaf__info').first().isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await skill.getAttribute('aria-expanded'), 'false');
    await page.locator('.project-archive > summary').click();
    assert(await page.locator('#mandate-m365').isVisible());

    await page.locator('#booking-name').fill('Test & Team');
    await page.locator('#booking-email').fill('invalid');
    await page.locator('#booking-message').fill('Wie können wir unseren Wandel gemeinsam gestalten?');
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator('.form-status').textContent(), '');
    await page.locator('#booking-email').fill('test@example.com');
    await page.locator('button[type="submit"]').click();
    const mailto = await page.locator('.form-status a').getAttribute('href');
    const draft = new URL(mailto);
    assert.equal(draft.protocol, 'mailto:');
    assert.equal(draft.pathname, 'ilyalex.yacine@gmail.com');
    assert(draft.searchParams.get('subject').includes('Test & Team'));
    assert(draft.searchParams.get('body').includes('Organisationsentwicklung & Transformation'));
    assert(draft.searchParams.get('body').includes('Wie können wir unseren Wandel gemeinsam gestalten?'));
    assert.equal(await page.locator('#booking-name').inputValue(), 'Test & Team');
    assert.equal(page.url().split('#')[0], new URL(base).href);
    console.log('PASS: responsive layout, mobile menu/focus, disclosures, service selection, popovers, validation, email draft.');

    for (const path of [
      'blog/', 'blog/evolutionaere-organisationen.html', 'blog/flow-und-potenzial.html',
      'blog/regeneratives-leadership.html', 'impressum.html', 'datenschutz.html',
    ]) {
      assert.equal((await page.goto(localUrl(path))).status(), 200, path);
      assert(await page.locator('h1').isVisible(), path);
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path);
      await page.locator('.nav-toggle').click();
      assert(await page.locator('.main-nav').isVisible(), path);
      await page.locator('.nav-toggle').click();
      console.log('PASS:', path);
    }

    await page.goto(base);
    const references = await page.evaluate(() => {
      return [...document.querySelectorAll('a[href], img[src], source[srcset], link[href], script[src]')]
        .map((element) => element.getAttribute('href') || element.getAttribute('src') || element.getAttribute('srcset'))
        .filter((value) => value && !value.startsWith('#') && !/^[a-z]+:/i.test(value));
    });
    for (const path of new Set(references)) {
      assert.equal((await page.request.get(localUrl(path))).status(), 200, path);
    }
    const missingAnchors = await page.evaluate(() => {
      return [...document.querySelectorAll('a[href^="#"]')]
        .filter((link) => !document.getElementById(link.hash.slice(1)))
        .map((link) => link.hash);
    });
    assert.deepEqual(missingAnchors, []);
    const duplicateIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    assert.deepEqual(duplicateIds, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(failedResponses, []);
    console.log('PASS: local links/assets, anchors, unique IDs, zero browser exceptions or HTTP errors.');
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
