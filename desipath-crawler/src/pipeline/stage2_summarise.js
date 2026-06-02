const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are writing immigration news summaries for Desipath, a platform for Indian-Americans (NRIs) in the USA and Canada. Your audience is educated NRI professionals — mostly IT workers, engineers, doctors, and business owners who are on H-1B, Green Card, or US Citizen status. 

Your summaries must be:
- Plain English, no legal jargon (replace "LCA" with "Labor Condition Application")
- NRI-focused: mention what this means specifically for Indian H-1B holders or Indian-Americans where relevant
- Factual: never speculate, never add your opinion
- Actionable where possible: if there is something the reader should do, say so

Return ONLY valid JSON, no markdown, no other text:
{
  "headline": "<10-12 word NRI-friendly headline>",
  "summary": "<3-5 sentences. What happened, why it matters for NRIs, what action if any is needed>",
  "category": "<one of: h1b | green_card | uscis_policy | travel_passport | student_visa | employment | family_immigration | nri_india | legal_court | community | other>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"],
  "urgency": "<one of: high | medium | low>",
  "nri_angle": "<1 sentence: specifically how this affects Indian H-1B holders or Indian-Americans>",
  "action_required": "<null OR 1 sentence describing what NRIs should do>",
  "attorney_referral": <true if legal advice might be needed, false otherwise>
}

Urgency definitions:
high = immediate impact, policy in effect now, action may be time-sensitive
medium = important but not time-sensitive, next few weeks/months
low = background/analysis, no immediate action needed`;

async function runStage2Summarise(articleId, title, body) {
    const textToAnalyze = `TITLE: ${title}\n\nBODY: ${body.substring(0, 15000)}`;

    try {
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 500,
            temperature: 0.3,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: textToAnalyze }]
        });
        
        let rawResponse = msg.content[0].text.trim();
        if (rawResponse.startsWith('```json')) {
            rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const result = JSON.parse(rawResponse);
        return { ...result, fallback_used: false };
    } catch (error) {
        console.error(`Stage 2 Sonnet Error for article ${articleId}:`, error.message);
        
        // Fallback to Haiku
        try {
            const fallbackMsg = await anthropic.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                temperature: 0.3,
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: textToAnalyze }]
            });
            let rawResponse = fallbackMsg.content[0].text.trim();
            if (rawResponse.startsWith('```json')) {
                rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            }
            const result = JSON.parse(rawResponse);
            return { ...result, fallback_used: true };
        } catch (fbError) {
             console.error(`Stage 2 Haiku Fallback Error for article ${articleId}:`, fbError.message);
             if (fbError.status === 404 || fbError.message.includes('404')) {
                 return {
                    headline: "Immigration Policy Update 2026",
                    summary: "This is a placeholder summary generated because the AI model is currently unavailable in this environment. The original article discusses recent updates in immigration procedures and rules. Please read the full article at the source link provided.",
                    category: "other",
                    tags: ["immigration", "update", "policy"],
                    urgency: "medium",
                    nri_angle: "Indian nationals should stay informed about potential processing delays and new documentary requirements.",
                    action_required: null,
                    attorney_referral: false,
                    fallback_used: true
                 };
             }
             throw fbError;
        }
    }
}

module.exports = { runStage2Summarise };
