// Browser smoke test. No messages are sent.
const assert = require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.SITE_URL||'http://127.0.0.1:4173/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{const page=await browser.newPage();await page.goto(new URL('en/index.html',base).href);for(const width of [1440,1090,768,390,320]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`)}
await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.locator('.main-nav a[href="#work"]').click();assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.service-card').count(),3);
await page.getByRole('link',{name:'DE',exact:true}).click();assert.equal(await page.locator('html').getAttribute('lang'),'de');assert(page.url().endsWith('#work'));await page.getByRole('link',{name:'ENG',exact:true}).click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
await page.locator('.perspective-model a[href="#perspective-flow"]').click();assert(page.url().endsWith('#perspective-flow'));
await page.goto(new URL('en/ueber-mich.html#methods',base).href);await page.locator('.methods-disclosure summary').click();await page.locator('.skill-leaf').first().click();assert.equal(await page.locator('.skill-leaf').first().getAttribute('aria-expanded'),'true');
console.log('PASS: responsive layout, mobile menu, matching language/section, offers, model, methods.');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
