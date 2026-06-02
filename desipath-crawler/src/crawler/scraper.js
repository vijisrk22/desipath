const { chromium } = require('playwright');
const crypto = require('crypto');
const db = require('../db');
const { isDuplicate } = require('./rss');

const SCRAPER_SOURCES = [
    { name: 'Politico Immigration', url: 'https://www.politico.com/tag/immigration', category: 'news_site', selector: '.story-text' }
];

async function fetchScraperSources(runId) {
    console.log(`Starting Web Scraper [Run ID: ${runId}]`);
    let ingestedCount = 0;
    
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        
        for (const source of SCRAPER_SOURCES) {
            console.log(`Scraping: ${source.name} - ${source.url}`);
            try {
                const context = await browser.newContext();
                const page = await context.newPage();
                await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                
                // Get all links matching the selector
                const articles = await page.$$eval(source.selector, els => {
                    return els.map(el => {
                        const a = el.querySelector('a') || el.closest('a') || el;
                        const title = el.textContent || '';
                        return { link: a.href, title: title.trim() };
                    }).filter(a => a.link && a.title);
                });
                
                for (const item of articles) {
                    if (!item.title || !item.link) continue;
                    
                    const isDup = await isDuplicate(item.link, item.title);
                    if (isDup) continue;
                    
                    const hash = crypto.createHash('md5').update(item.link + item.title).digest('hex');
                    
                    await db.execute(`
                        INSERT INTO news_raw_queue 
                        (source_name, source_type, source_url, source_url_hash, original_title, crawl_run_id, created_at, updated_at) 
                        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
                    `, [
                        source.name, 
                        source.category, 
                        item.link, 
                        hash, 
                        item.title.substring(0, 300),
                        runId
                    ]);
                    ingestedCount++;
                }
                
                await context.close();
            } catch (err) {
                console.error(`Failed scraping ${source.name}: ${err.message}`);
            }
        }
    } catch (err) {
        console.error(`Scraper framework failed:`, err);
    } finally {
        if (browser) await browser.close();
    }
    
    console.log(`Web Scraper complete. Ingested ${ingestedCount} new articles.`);
    return ingestedCount;
}

module.exports = { fetchScraperSources };
