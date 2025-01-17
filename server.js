require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Define a comprehensive list of jazz chords
const validChords = [
    // Basic major chords
    'C', 'D', 'E', 'F', 'G', 'A', 'B',
    'Db', 'Eb', 'Gb', 'Ab', 'Bb',
    
    // Basic minor chords
    'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
    'Dbm', 'Ebm', 'Gbm', 'Abm', 'Bbm',
    
    // Major 7th chords
    'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7',
    'Dbmaj7', 'Ebmaj7', 'Gbmaj7', 'Abmaj7', 'Bbmaj7',
    
    // Minor 7th chords
    'Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7',
    'Dbm7', 'Ebm7', 'Gbm7', 'Abm7', 'Bbm7',
    
    // Dominant 7th chords
    'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
    'Db7', 'Eb7', 'Gb7', 'Ab7', 'Bb7',
    
    // Minor 7 flat 5 (half diminished)
    'Cm7b5', 'Dm7b5', 'Em7b5', 'Fm7b5', 'Gm7b5', 'Am7b5', 'Bm7b5',
    'Dbm7b5', 'Ebm7b5', 'Gbm7b5', 'Abm7b5', 'Bbm7b5',
    
    // Diminished 7th chords
    'Cdim7', 'Ddim7', 'Edim7', 'Fdim7', 'Gdim7', 'Adim7', 'Bdim7',
    'Dbdim7', 'Ebdim7', 'Gbdim7', 'Abdim7', 'Bbdim7',
    
    // Diminished triads
    'Cdim', 'Ddim', 'Edim', 'Fdim', 'Gdim', 'Adim', 'Bdim',
    'Dbdim', 'Ebdim', 'Gbdim', 'Abdim', 'Bbdim',
    
    // Augmented chords
    'Caug', 'Daug', 'Eaug', 'Faug', 'Gaug', 'Aaug', 'Baug',
    'Dbaug', 'Ebaug', 'Gbaug', 'Abaug', 'Bbaug',
    'Caug7', 'Daug7', 'Eaug7', 'Faug7', 'Gaug7', 'Aaug7', 'Baug7',
    'Dbaug7', 'Ebaug7', 'Gbaug7', 'Abaug7', 'Bbaug7',
    
    // 6th chords
    'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
    'Db6', 'Eb6', 'Gb6', 'Ab6', 'Bb6',
    'Cm6', 'Dm6', 'Em6', 'Fm6', 'Gm6', 'Am6', 'Bm6',
    'Dbm6', 'Ebm6', 'Gbm6', 'Abm6', 'Bbm6',
    
    // 9th chords
    'C9', 'D9', 'E9', 'F9', 'G9', 'A9', 'B9',
    'Db9', 'Eb9', 'Gb9', 'Ab9', 'Bb9',
    'Cm9', 'Dm9', 'Em9', 'Fm9', 'Gm9', 'Am9', 'Bm9',
    'Dbm9', 'Ebm9', 'Gbm9', 'Abm9', 'Bbm9',
    'Cmaj9', 'Dmaj9', 'Emaj9', 'Fmaj9', 'Gmaj9', 'Amaj9', 'Bmaj9',
    'Dbmaj9', 'Ebmaj9', 'Gbmaj9', 'Abmaj9', 'Bbmaj9',
    
    // 11th chords
    'C11', 'D11', 'E11', 'F11', 'G11', 'A11', 'B11',
    'Db11', 'Eb11', 'Gb11', 'Ab11', 'Bb11',
    'Cm11', 'Dm11', 'Em11', 'Fm11', 'Gm11', 'Am11', 'Bm11',
    'Dbm11', 'Ebm11', 'Gbm11', 'Abm11', 'Bbm11',
    
    // 13th chords
    'C13', 'D13', 'E13', 'F13', 'G13', 'A13', 'B13',
    'Db13', 'Eb13', 'Gb13', 'Ab13', 'Bb13',
    'Cm13', 'Dm13', 'Em13', 'Fm13', 'Gm13', 'Am13', 'Bm13',
    'Dbm13', 'Ebm13', 'Gbm13', 'Abm13', 'Bbm13',
    
    // Sus chords
    'Csus2', 'Dsus2', 'Esus2', 'Fsus2', 'Gsus2', 'Asus2', 'Bsus2',
    'Dbsus2', 'Ebsus2', 'Gbsus2', 'Absus2', 'Bbsus2',
    'Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4',
    'Dbsus4', 'Ebsus4', 'Gbsus4', 'Absus4', 'Bbsus4',
    'C7sus4', 'D7sus4', 'E7sus4', 'F7sus4', 'G7sus4', 'A7sus4', 'B7sus4',
    'Db7sus4', 'Eb7sus4', 'Gb7sus4', 'Ab7sus4', 'Bb7sus4'
];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// API endpoint for chord generation
app.post('/api/generate-chords', async (req, res) => {
    try {
        const { mood, apiKey } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'OpenAI API key is required' });
        }

        const openai = new OpenAI({ apiKey });
        
        const { measures = 1 } = req.body;
        const numChords = measures * 4; // 4 chords per measure
        
        console.log('Received mood:', mood);
        console.log('Requested measures:', measures);
        
        if (!mood) {
            return res.status(400).json({ error: 'Mood description is required' });
        }

        console.log('Making OpenAI API call...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a jazz harmony expert. Your task is to generate a ${numChords}-chord progression based on a mood. Respond with a JSON object in this exact format: {"chords": ["chord1", "chord2", ..., "chordN"]}. The array must contain exactly ${numChords} chords. Use any of these jazz chords: ${validChords.join(', ')}. Example response for one measure: {"chords": ["Cmaj9","Am11","Dm7","G13"]}`
                },
                {
                    role: "user",
                    content: `Generate a ${numChords}-chord progression that captures this mood: ${mood}`
                }
            ],
            temperature: 0.7,
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0].message.content;
        console.log('Raw OpenAI response:', responseContent);

        // Try to parse the response as JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({
                error: 'Failed to parse OpenAI response as JSON',
                raw_response: responseContent
            });
        }

        // Extract the chord progression
        if (!parsedResponse.chords) {
            console.error('Response missing chords array:', parsedResponse);
            return res.status(500).json({
                error: 'Invalid response format: missing chords array',
                response: parsedResponse
            });
        }

        const chordProgression = parsedResponse.chords;
        
        // Validate the chord progression
        if (!Array.isArray(chordProgression)) {
            console.error('Chords is not an array:', chordProgression);
            return res.status(500).json({
                error: 'Invalid response format: chords is not an array',
                response: chordProgression
            });
        }

        if (chordProgression.length !== numChords) {
            console.error(`Wrong number of chords: got ${chordProgression.length}, expected ${numChords}`);
            return res.status(500).json({
                error: `Invalid response format: must have exactly ${numChords} chords`,
                chords: chordProgression
            });
        }

        const invalidChords = chordProgression.filter(chord => !validChords.includes(chord));
        
        if (invalidChords.length > 0) {
            console.error('Invalid chord names found:', invalidChords);
            return res.status(500).json({
                error: 'Invalid chord names in response',
                invalid_chords: invalidChords,
                valid_chords: validChords
            });
        }

        console.log('Successfully generated chord progression:', chordProgression);
        res.json({ chords: chordProgression });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ 
            error: 'Failed to generate chord progression',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:3000`);
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
});