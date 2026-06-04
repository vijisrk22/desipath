const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const THRESHOLD = parseInt(process.env.NEWS_RELEVANCE_THRESHOLD || '6');

const SYSTEM_PROMPT = `You are a news relevance classifier for Desipath, an NRI community platform serving Indian-Americans in the USA and Canada. Evaluate if the provided article is relevant to Desipath users. 

Relevant topics include:
- US Immigration & Visas: H-1B, H-4, L-1, O-1, EB visas, Green Card, PERM, Visa Bulletins, USCIS policy/fee changes, student visas (F-1, OPT, CPT, STEM OPT), tourist visas (B-1/B-2), visa processing times, OCI card rules, and deporting/removal news.
- US & Indian IT Industry: Major corporate news and developments from Indian IT companies (TCS, Infosys, Wipro, HCL, Cognizant, etc.) and US tech companies (Google, Microsoft, Apple, Meta, Amazon, etc.).
- Tech Layoffs & Jobs: News regarding major layoffs, hiring trends, job markets, and economic changes in the US and Indian tech sectors.
- Artificial Intelligence (AI): Significant AI news, updates, products, and policy breakthroughs from major companies (e.g., OpenAI, Google, Anthropic, Microsoft, Meta).
- Safety & Community Security: News about gun violence and shootings in the USA that affect public safety.
- Financial & Currency News: Exchange rates between the Indian Rupee (INR) and the US Dollar (USD), remittances, and NRE/NRO banking regulations.
- India-US Policy & NRI News: State Department alerts, passport updates, travel bans, and strategic developments impacting the Indian-American community.

NOT relevant (score 0-3):
- General US/India local politics with no IT, tech, or immigration angle
- Lifestyle, gossip, sports, or entertainment news
- Global news that does not involve the USA, Canada, India, or the NRI/IT community

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
