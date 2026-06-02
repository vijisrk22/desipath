const Parser = require('rss-parser');
const crypto = require('crypto');
const db = require('../db');

const parser = new Parser({
    headers: {
        'User-Agent': 'Desipath Immigration News Bot (https://desipath.com)'
    }
});

const RSS_SOURCES = [
    { name: 'USCIS Official Newsroom', url: 'https://www.uscis.gov/news/rss', category: 'official_govt' },
    { name: 'US State Dept Visa Bulletins', url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html', category: 'official_govt' }, // Wait, this is a web page, not RSS.
    { name: 'Immigration Impact', url: 'https://immigrationimpact.com/feed/', category: 'advocacy' },
    { name: 'AILA', url: 'https://www.aila.org/rss/news', category: 'legal' },
    { name: 'Boundless Immigration Blog', url: 'https://www.boundless.com/blog/feed/', category: 'legal' },
    { name: 'National Immigration Forum', url: 'https://immigrationforum.org/feed/', category: 'advocacy' },
    { name: 'Times of India NRI', url: 'https://timesofindia.indiatimes.com/rssfeeds/71.cms', category: 'news_site' }, // updated URL based on typical TOI RSS
    { name: 'India West', url: 'https://www.indiawest.com/feed/', category: 'community' },
    { name: 'Economic Times NRI', url: 'https://economictimes.indiatimes.com/nri/rssfeeds/242254924.cms', category: 'news_site' }
];

async function isDuplicate(url, title) {
    const hash = crypto.createHash('md5').update(url + title).digest('hex');
    const [rows] = await db.execute('SELECT hash FROM news_dedup_hashes WHERE hash = ? AND expires_at > NOW()', [hash]);
    
    if (rows.length > 0) {
        return true;
    }
    
    // Add to dedup table
    await db.execute('INSERT INTO news_dedup_hashes (hash, source_name, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))', [hash, 'RSS Crawler']);
    return false;
}

async function fetchRssFeeds(runId) {
    console.log(`Starting RSS Crawl [Run ID: ${runId}]`);
    let ingestedCount = 0;

    for (const source of RSS_SOURCES) {
        try {
            console.log(`Fetching RSS: ${source.name} - ${source.url}`);
            
            // Note: State Dept is usually HTML, so we might skip it if parser fails, but we should handle it in scraper.js anyway
            if (!source.url.includes('rss') && !source.url.includes('feed') && !source.url.includes('xml')) {
                console.log(`Skipping non-RSS URL: ${source.url}`);
                continue;
            }

            const feed = await parser.parseURL(source.url);

            for (const item of feed.items) {
                const title = item.title || '';
                const link = item.link || '';
                const content = item.contentSnippet || item.content || '';
                const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

                if (!title || !link) continue;

                // Dedup check
                const isDup = await isDuplicate(link, title);
                if (isDup) {
                    continue;
                }

                const hash = crypto.createHash('md5').update(link + title).digest('hex');
                const isGov = source.category === 'official_govt';

                // Insert into raw queue
                await db.execute(`
                    INSERT INTO news_raw_queue 
                    (source_name, source_type, source_url, source_url_hash, original_title, original_excerpt, original_published_at, is_government_source, crawl_run_id, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                `, [
                    source.name, 
                    source.category, 
                    link, 
                    hash, 
                    title.substring(0, 300), 
                    content.substring(0, 1000), // Excerpt
                    pubDate,
                    isGov,
                    runId
                ]);

                ingestedCount++;
            }
        } catch (error) {
            console.error(`Failed to crawl ${source.name}: ${error.message}`);
        }
    }

    console.log(`RSS Crawl complete. Ingested ${ingestedCount} new articles.`);
    return ingestedCount;
}

module.exports = { fetchRssFeeds, isDuplicate };
