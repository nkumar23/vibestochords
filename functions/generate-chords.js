const OpenAI = require('openai');

// Valid chord types that can be generated
const validChords = [
    // Major and minor triads
    'C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm',
    'Db', 'Dbm', 'Eb', 'Ebm', 'Gb', 'Gbm', 'Ab', 'Abm', 'Bb', 'Bbm',
    
    // Seventh chords
    'Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'Bm7b5',
    'Dbmaj7', 'Ebmaj7', 'Gbmaj7', 'Abmaj7', 'Bbmaj7',
    
    // Extended chords
    'C9', 'Dm9', 'G13', 'Fmaj9', 'Am9',
    'Db9', 'Eb9', 'Gb9', 'Ab9', 'Bb9',
    
    // Altered chords
    'Csus4', 'Dsus2', 'G7sus4', 'Asus4',
    'Dbsus4', 'Ebsus4', 'Gbsus4', 'Absus4', 'Bbsus4'
];

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { mood, measures = 1, apiKey } = JSON.parse(event.body);

        if (!mood || !apiKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Mood and API key are required' })
            };
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `Generate a ${measures} measure chord progression (${measures * 4} chords) that evokes the following mood or scene: "${mood}". 
        Only use these valid chords: ${validChords.join(', ')}. 
        Return ONLY the chord names separated by commas, no other text.
        Example response format: Cmaj7, Am7, Dm7, G7`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a music theory expert that generates chord progressions based on moods or scenes. You only respond with comma-separated chord names, no other text."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 100
        });

        const chordProgression = response.choices[0].message.content.trim();
        const chords = chordProgression.split(',').map(chord => chord.trim());

        // Validate the generated chords
        const invalidChords = chords.filter(chord => !validChords.includes(chord));
        if (invalidChords.length > 0) {
            throw new Error(`Invalid chords generated: ${invalidChords.join(', ')}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chords })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to generate chord progression',
                details: error.message
            })
        };
    }
}; 