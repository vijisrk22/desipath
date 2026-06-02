const db = require('../db');
const { runStage1Relevance } = require('./stage1_relevance');
const { runStage2Summarise } = require('./stage2_summarise');
const { runStage3Quality } = require('./stage3_quality');

async function processSingleArticle(article) {
    console.log(`Processing Article ID ${article.id}`);
    
    // Stage 1
    let stage1;
    try {
        await db.execute("UPDATE news_raw_queue SET processing_status = 'processing' WHERE id = ?", [article.id]);
        const textToAnalyze = article.original_body || article.original_excerpt;
        stage1 = await runStage1Relevance(article.id, article.original_title, textToAnalyze, article.is_government_source);
        
        await db.execute("UPDATE news_raw_queue SET stage1_response_json = ?, processing_status = ? WHERE id = ?", 
            [JSON.stringify(stage1), stage1.is_relevant ? 'stage1_passed' : 'stage1_failed', article.id]);
            
        if (!stage1.is_relevant) {
            await db.execute("UPDATE news_raw_queue SET processing_status = 'rejected' WHERE id = ?", [article.id]);
            return;
        }
    } catch (err) {
        await db.execute("UPDATE news_raw_queue SET processing_status = 'error', error_log = ? WHERE id = ?", [err.message, article.id]);
        return;
    }

    // Stage 2
    let stage2;
    try {
        const textToAnalyze = article.original_body || article.original_excerpt;
        stage2 = await runStage2Summarise(article.id, article.original_title, textToAnalyze);
        
        await db.execute("UPDATE news_raw_queue SET stage2_response_json = ?, processing_status = 'stage2_done' WHERE id = ?", 
            [JSON.stringify(stage2), article.id]);
    } catch (err) {
        await db.execute("UPDATE news_raw_queue SET processing_status = 'manual_review', error_log = ? WHERE id = ?", [err.message, article.id]);
        return;
    }

    // Stage 3
    let stage3;
    try {
        stage3 = await runStage3Quality(article.id, stage2.headline, stage2.summary);
        await db.execute("UPDATE news_raw_queue SET stage3_response_json = ?, processing_status = 'stage3_done' WHERE id = ?", 
            [JSON.stringify(stage3), article.id]);
    } catch (err) {
        stage3 = { decision: 'review', reason: 'Exception in Stage 3 code' };
    }

    // Final Decision
    if (stage3.decision === 'pass') {
        const slug = stage2.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
        
        await db.execute(`
            INSERT INTO immigration_news 
            (slug, raw_queue_id, source_name, source_type, source_url, original_title, ai_headline, ai_summary, ai_nri_angle, ai_action_required, category, tags_json, urgency, is_government_source, attorney_referral, ai_model_used, ai_summary_is_fallback, moderation_decision, status, published_at, original_published_at, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), NOW())
        `, [
            slug.substring(0, 200), article.id, article.source_name, article.source_type, article.source_url, article.original_title.substring(0, 300),
            stage2.headline.substring(0, 150), stage2.summary, stage2.nri_angle, stage2.action_required || null,
            stage2.category, JSON.stringify(stage2.tags || []), stage2.urgency, article.is_government_source,
            stage2.attorney_referral || false, stage2.fallback_used ? 'claude-3-haiku' : 'claude-3-5-sonnet',
            stage2.fallback_used, 'auto_pass', 'published', article.original_published_at
        ]);
        await db.execute("UPDATE news_raw_queue SET processing_status = 'published' WHERE id = ?", [article.id]);
    } else if (stage3.decision === 'review') {
        await db.execute(`
            INSERT INTO news_manual_review_queue 
            (raw_queue_id, ai_headline, ai_summary, source_url, flag_reason, flags_json, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
            article.id, stage2.headline.substring(0, 150), stage2.summary, article.source_url,
            stage3.reason || 'Flagged for review', JSON.stringify(stage3.flags || [])
        ]);
        await db.execute("UPDATE news_raw_queue SET processing_status = 'manual_review' WHERE id = ?", [article.id]);
    } else {
        await db.execute("UPDATE news_raw_queue SET processing_status = 'rejected' WHERE id = ?", [article.id]);
    }
}

async function runAIPipeline() {
    console.log(`Starting AI Pipeline...`);
    const [rows] = await db.execute(`
        SELECT * FROM news_raw_queue 
        WHERE processing_status = 'pending' AND (original_body IS NOT NULL OR paywall_suspected = 1)
        ORDER BY created_at ASC 
        LIMIT 50
    `);
    
    if (rows.length === 0) {
        console.log("No articles pending AI processing.");
        return;
    }
    
    // Process in batches of 3
    const concurrency = 3;
    for (let i = 0; i < rows.length; i += concurrency) {
        const batch = rows.slice(i, i + concurrency);
        await Promise.all(batch.map(row => processSingleArticle(row)));
    }
    
    console.log(`Finished AI Pipeline for ${rows.length} articles.`);
}

module.exports = { runAIPipeline };
