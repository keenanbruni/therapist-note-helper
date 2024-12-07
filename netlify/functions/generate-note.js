
exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { topics, modalities } = JSON.parse(event.body);

        // Generate the note based on selected topics and modalities
        const noteText = generateNoteText(topics, modalities);

        return {
            statusCode: 200,
            body: JSON.stringify({ note: noteText })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating note' })
        };
    }
};

function generateNoteText(topics, modalities) {
    let noteText = 'Session focused on ';

    // Add topics
    if (topics.length > 0) {
        noteText += topics.map(topic => formatTopic(topic)).join(', ');
    }

    // Add modalities
    if (modalities.length > 0) {
        noteText += '. Utilized ';
        noteText += modalities.map(modality => formatModality(modality)).join(' and ');
        noteText += ' techniques';
    }

    noteText += ' during the session.';
    return noteText;
}

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