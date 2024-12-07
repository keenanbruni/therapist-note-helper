const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { topics, modalities } = JSON.parse(event.body);

        const prompt = `Generate a professional therapist session note. 
Topics discussed: ${topics.map(t => formatTopic(t)).join(', ')}
Modalities used: ${modalities.map(m => formatModality(m)).join(', ')}
Keep the note concise, professional, and HIPAA-compliant. Do not include any specific client details.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a professional therapist writing session notes."},
                {"role": "user", "content": prompt}
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ note: completion.choices[0].message.content.trim() })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating note' })
        };
    }
};

function formatTopic(topic) {
    return topic.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatModality(modality) {
    const modalityMap = {
        'cbt': 'Cognitive Behavioral Therapy',
        'dbt': 'Dialectical Behavior Therapy',
        'act': 'Acceptance and Commitment Therapy'
    };
    return modalityMap[modality] || modality;
}