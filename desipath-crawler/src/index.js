const { fetchRssFeeds } = require('./crawler/rss');
const { fetchScraperSources } = require('./crawler/scraper');
const { processRawQueueBodies } = require('./crawler/extractor');
const { runAIPipeline } = require('./pipeline/run_pipeline');

async function runPipeline() {
    const runId = 'run_' + Date.now();
    console.log(`--- Starting Immigration News Pipeline [${runId}] ---`);
    
    try {
        // Step 1: Ingest RSS feeds
        await fetchRssFeeds(runId);
        
        // Step 2: Ingest Scraper sources
        await fetchScraperSources(runId);
        
        // Step 3: Extract full article bodies for new pending items
        await processRawQueueBodies(50);
        
        // Step 4: Run AI Classification, Summarisation, Quality Check
        await runAIPipeline();
        
        console.log(`--- Pipeline [${runId}] completed successfully ---`);
    } catch (error) {
        console.error(`Pipeline [${runId}] failed:`, error);
    } finally {
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    runPipeline();
}
