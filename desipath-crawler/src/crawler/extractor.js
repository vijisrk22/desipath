const { chromium } = require('playwright');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const db = require('../db');

async function extractArticleBody(url) {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Desipath Immigration News Bot (https://desipath.com)'
        });
        const page = await context.newPage();
        
        // Timeout after 30 seconds
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Get the full HTML
        const html = await page.content();
        
        // Parse with JSDOM
        const doc = new JSDOM(html, { url });
        
        // Use Readability
        const reader = new Readability(doc.window.document);
        const article = reader.parse();
        
        if (!article) {
            return { body: '', paywallSuspected: true };
        }
        
        // Simple paywall detection
        const wordCount = article.textContent.trim().split(/\s+/).length;
        const paywallSuspected = wordCount < 150;
        
        return {
            title: article.title,
            body: article.textContent,
            author: article.byline,
            paywallSuspected
        };
        
    } catch (error) {
        console.error(`Error extracting article body from ${url}:`, error.message);
        return { body: '', paywallSuspected: true, error: error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Function to process raw articles and extract their bodies
async function processRawQueueBodies(limit = 20) {
    console.log(`Processing bodies for up to ${limit} articles...`);
    
    const safeLimit = parseInt(limit, 10);
    // Get articles that don't have bodies yet
    const [rows] = await db.execute(`
        SELECT id, source_url 
        FROM news_raw_queue 
        WHERE original_body IS NULL 
        AND processing_status = 'pending'
        ORDER BY created_at DESC 
        LIMIT ${safeLimit}
    `);

    for (const row of rows) {
        console.log(`Extracting body for ID ${row.id}: ${row.source_url}`);
        const extracted = await extractArticleBody(row.source_url);
        
        if (extracted.body) {
            await db.execute(`
                UPDATE news_raw_queue 
                SET original_body = ?, original_author = COALESCE(original_author, ?), paywall_suspected = ?
                WHERE id = ?
            `, [
                extracted.body.substring(0, 5000), // Safety truncation
                extracted.author || null,
                extracted.paywallSuspected,
                row.id
            ]);
        } else {
            // Failed to extract, mark as paywall suspected to rely on excerpt
            await db.execute(`
                UPDATE news_raw_queue 
                SET paywall_suspected = true
                WHERE id = ?
            `, [row.id]);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`Finished processing ${rows.length} article bodies.`);
}

module.exports = { extractArticleBody, processRawQueueBodies };
