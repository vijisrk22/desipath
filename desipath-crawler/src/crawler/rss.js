const Parser = require('rss-parser');
const crypto = require('crypto');
const db = require('../db');

const parser = new Parser({
    headers: {
        'User-Agent': 'Desipath Immigration News Bot (https://desipath.com)'
    }
});

const RSS_SOURCES = [
    // --- Official Government Sources ---
    { name: 'USCIS News Releases', url: 'https://www.uscis.gov/rss-news/1/1125', category: 'official_govt' },
    { name: 'USCIS Alerts', url: 'https://www.uscis.gov/rss-news/5/1125', category: 'official_govt' },
    { name: 'IRCC Canada Newsroom', url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=immigrationrefugeesandcitizenshipcanada', category: 'official_govt' },
    { name: 'USCIS Official Newsroom', url: 'https://www.uscis.gov/news/rss', category: 'official_govt' },

    // --- Immigration Legal & Advocacy Blogs ---
    { name: 'Immigration Impact', url: 'https://immigrationimpact.com/feed/', category: 'advocacy' },
    { name: 'RedBus2US', url: 'https://redbus2us.com/feed/', category: 'legal' },
    { name: 'Murthy Law Firm', url: 'https://murthy.com/feed/', category: 'legal' },
    { name: 'Visa Lawyer Blog', url: 'https://visalawyerblog.com/feed/', category: 'legal' },
    { name: 'AILA', url: 'https://www.aila.org/rss/news', category: 'legal' },
    { name: 'Boundless Immigration Blog', url: 'https://www.boundless.com/blog/feed/', category: 'legal' },
    { name: 'National Immigration Forum', url: 'https://immigrationforum.org/feed/', category: 'advocacy' },

    // --- Indo-American & Diaspora News ---
    { name: 'The American Bazaar', url: 'https://www.theamericanbazaar.com/feed/', category: 'community' },
    { name: 'India West', url: 'https://www.indiawest.com/feed/', category: 'community' },

    // --- News Sites & Diaspora Focus ---
    { name: 'Times of India NRI', url: 'https://timesofindia.indiatimes.com/rssfeeds/71.cms', category: 'news_site' },
    { name: 'Economic Times NRI', url: 'https://economictimes.indiatimes.com/nri/rssfeeds/242254924.cms', category: 'news_site' },
    { name: 'The Hindu', url: 'https://www.thehindu.com/feeder/default.rss', category: 'news_site' },
    { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'news_site' },
    { name: 'NDTV Latest News', url: 'https://feeds.feedburner.com/NDTV-LatestNews', category: 'news_site' },
    { name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', category: 'news_site' },
    { name: 'AP Top News', url: 'https://rsshub.app/apnews/topics/apf-topnews', category: 'news_site' },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', category: 'news_site' },

    // --- Tech Industry, Layoffs & AI ---
    { name: 'TechCrunch Layoffs', url: 'https://techcrunch.com/tag/layoffs/feed/', category: 'layoffs' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'ai' },
    { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'ai' },

    // --- Indian & Global IT Sector ---
    { name: 'ET CIO Technology', url: 'https://cio.economictimes.indiatimes.com/rss/lateststories', category: 'it_news' },
    { name: 'TOI Technology', url: 'https://timesofindia.indiatimes.com/rssfeeds/66973374.cms', category: 'it_news' },

    // --- Breaking US Safety & Security ---
    { name: 'AP US News', url: 'https://rsshub.app/apnews/topics/apf-usnews', category: 'community' }
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
