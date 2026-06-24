const pool = require('./db');

async function cleanupOldRecords() {
    try {
        console.log("Starting cleanup of old records (> 20 days)...");

        // Delete from news_raw_queue where created_at is older than 20 days
        const [resultQueue] = await pool.execute(`
            DELETE FROM news_raw_queue 
            WHERE created_at < DATE_SUB(NOW(), INTERVAL 20 DAY)
        `);
        console.log(`Deleted ${resultQueue.affectedRows} old records from news_raw_queue.`);

        // Delete from news_dedup_hashes where first_seen_at is older than 20 days
        const [resultDedup] = await pool.execute(`
            DELETE FROM news_dedup_hashes 
            WHERE first_seen_at < DATE_SUB(NOW(), INTERVAL 20 DAY)
        `);
        console.log(`Deleted ${resultDedup.affectedRows} old records from news_dedup_hashes.`);

        console.log("Cleanup completed successfully.");
    } catch (error) {
        console.error("Error during cleanup:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

cleanupOldRecords();
