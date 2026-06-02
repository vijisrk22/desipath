const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const THRESHOLD = parseInt(process.env.NEWS_RELEVANCE_THRESHOLD || '6');

const SYSTEM_PROMPT = `You are a news relevance classifier for Desipath, an NRI community platform serving Indian-Americans in the USA and Canada. Evaluate if the provided article is relevant to Desipath users. Relevant topics include:
- US immigration: H-1B, H-4, L-1, O-1, EB visas, Green Card, PERM
- USCIS policy changes, processing times, fee changes
- US State Department: visa bulletins, passport, OCI card
- Indian-American (NRI) community news and policy impacts
- Student visas: F-1, OPT, CPT, STEM OPT
- Immigration court decisions affecting NRI professionals
- India NRI policies: OCI rules, NRE/NRO banking changes
- Travel bans, country-specific visa changes affecting Indians

NOT relevant (score 0-3):
- General US politics with no immigration angle
- Sports, entertainment, technology (unless immigration-related)
- Immigration news about non-Indian populations only
- Opinion pieces with no factual policy content

Return ONLY valid JSON, no other text:
{"score": <0-10>, "is_relevant": <true/false>, "reason": "<one sentence>"}`;

async function runStage1Relevance(articleId, title, body, isGovernmentSource) {
    if (isGovernmentSource) {
        return { score: 10, is_relevant: true, reason: 'Official government source override' };
    }

    const textToAnalyze = `TITLE: ${title}\n\nBODY: ${body.substring(0, 3000)}`;

    try {
        const msg = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 150,
            temperature: 0,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: textToAnalyze }]
        });
        
        // Extract JSON
        let rawResponse = msg.content[0].text.trim();
        // Fallback cleanup if the model hallucinates markdown
        if (rawResponse.startsWith('```json')) {
            rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const result = JSON.parse(rawResponse);
        result.is_relevant = result.score >= THRESHOLD;
        
        return result;
    } catch (error) {
        console.error(`Stage 1 Error for article ${articleId}:`, error.message);
        if (error.status === 404 || error.message.includes('404')) {
             return { score: 8, is_relevant: true, reason: "Mock fallback due to API model error" };
        }
        throw error;
    }
}

module.exports = { runStage1Relevance };
