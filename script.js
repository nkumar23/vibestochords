let currentChords = [];
let isPlaying = false;
let currentChordIndex = 0;
let isAudioInitialized = false;

// Initialize audio
let synth;
let loop;

// Chord to notes mapping
const chordToNotes = {
    // Power chords (root and fifth)
    'C5': ['C4', 'G4'],
    'D5': ['D4', 'A4'],
    'E5': ['E4', 'B4'],
    'F5': ['F4', 'C5'],
    'G5': ['G4', 'D5'],
    'A5': ['A4', 'E5'],
    'B5': ['B4', 'F#5'],

    // Major triads
    'C': ['C4', 'E4', 'G4'],
    'D': ['D4', 'F#4', 'A4'],
    'E': ['E4', 'G#4', 'B4'],
    'F': ['F4', 'A4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'A': ['A4', 'C#5', 'E5'],
    'B': ['B4', 'D#5', 'F#5'],

    // Minor triads
    'Cm': ['C4', 'Eb4', 'G4'],
    'Dm': ['D4', 'F4', 'A4'],
    'Em': ['E4', 'G4', 'B4'],
    'Fm': ['F4', 'Ab4', 'C5'],
    'Gm': ['G4', 'Bb4', 'D5'],
    'Am': ['A4', 'C5', 'E5'],
    'Bm': ['B4', 'D5', 'F#5'],

    // Diminished triads
    'Cdim': ['C4', 'Eb4', 'Gb4'],
    'Ddim': ['D4', 'F4', 'Ab4'],
    'Edim': ['E4', 'G4', 'Bb4'],
    'Fdim': ['F4', 'Ab4', 'B4'],
    'Gdim': ['G4', 'Bb4', 'Db5'],
    'Adim': ['A4', 'C5', 'Eb5'],
    'Bdim': ['B4', 'D5', 'F5'],

    // Augmented triads
    'Caug': ['C4', 'E4', 'G#4'],
    'Daug': ['D4', 'F#4', 'A#4'],
    'Eaug': ['E4', 'G#4', 'B#4'],
    'Faug': ['F4', 'A4', 'C#5'],
    'Gaug': ['G4', 'B4', 'D#5'],
    'Aaug': ['A4', 'C#5', 'E#5'],
    'Baug': ['B4', 'D#5', 'F##5'],

    // Sus2 chords
    'Csus2': ['C4', 'D4', 'G4'],
    'Dsus2': ['D4', 'E4', 'A4'],
    'Esus2': ['E4', 'F#4', 'B4'],
    'Fsus2': ['F4', 'G4', 'C5'],
    'Gsus2': ['G4', 'A4', 'D5'],
    'Asus2': ['A4', 'B4', 'E5'],
    'Bsus2': ['B4', 'C#5', 'F#5'],

    // Sus4 chords
    'Csus4': ['C4', 'F4', 'G4'],
    'Dsus4': ['D4', 'G4', 'A4'],
    'Esus4': ['E4', 'A4', 'B4'],
    'Fsus4': ['F4', 'Bb4', 'C5'],
    'Gsus4': ['G4', 'C5', 'D5'],
    'Asus4': ['A4', 'D5', 'E5'],
    'Bsus4': ['B4', 'E5', 'F#5'],

    // Major 7th chords
    'Cmaj7': ['C4', 'E4', 'G4', 'B4'],
    'Dmaj7': ['D4', 'F#4', 'A4', 'C#5'],
    'Emaj7': ['E4', 'G#4', 'B4', 'D#5'],
    'Fmaj7': ['F4', 'A4', 'C5', 'E5'],
    'Gmaj7': ['G4', 'B4', 'D5', 'F#5'],
    'Amaj7': ['A4', 'C#5', 'E5', 'G#5'],
    'Bmaj7': ['B4', 'D#5', 'F#5', 'A#5'],

    // Minor 7th chords
    'Cm7': ['C4', 'Eb4', 'G4', 'Bb4'],
    'Dm7': ['D4', 'F4', 'A4', 'C5'],
    'Em7': ['E4', 'G4', 'B4', 'D5'],
    'Fm7': ['F4', 'Ab4', 'C5', 'Eb5'],
    'Gm7': ['G4', 'Bb4', 'D5', 'F5'],
    'Am7': ['A4', 'C5', 'E5', 'G5'],
    'Bm7': ['B4', 'D5', 'F#5', 'A5'],

    // Dominant 7th chords
    'C7': ['C4', 'E4', 'G4', 'Bb4'],
    'D7': ['D4', 'F#4', 'A4', 'C5'],
    'E7': ['E4', 'G#4', 'B4', 'D5'],
    'F7': ['F4', 'A4', 'C5', 'Eb5'],
    'G7': ['G4', 'B4', 'D5', 'F5'],
    'A7': ['A4', 'C#5', 'E5', 'G5'],
    'B7': ['B4', 'D#5', 'F#5', 'A5'],

    // Diminished 7th chords
    'Cdim7': ['C4', 'Eb4', 'Gb4', 'A4'],
    'Ddim7': ['D4', 'F4', 'Ab4', 'B4'],
    'Edim7': ['E4', 'G4', 'Bb4', 'Db5'],
    'Fdim7': ['F4', 'Ab4', 'B4', 'D5'],
    'Gdim7': ['G4', 'Bb4', 'Db5', 'E5'],
    'Adim7': ['A4', 'C5', 'Eb5', 'Gb5'],
    'Bdim7': ['B4', 'D5', 'F5', 'Ab5'],

    // Half-diminished (m7b5) chords
    'Cm7b5': ['C4', 'Eb4', 'Gb4', 'Bb4'],
    'Dm7b5': ['D4', 'F4', 'Ab4', 'C5'],
    'Em7b5': ['E4', 'G4', 'Bb4', 'D5'],
    'Fm7b5': ['F4', 'Ab4', 'B4', 'Eb5'],
    'Gm7b5': ['G4', 'Bb4', 'Db5', 'F5'],
    'Am7b5': ['A4', 'C5', 'Eb5', 'G5'],
    'Bm7b5': ['B4', 'D5', 'F5', 'A5'],

    // 6th chords
    'C6': ['C4', 'E4', 'G4', 'A4'],
    'D6': ['D4', 'F#4', 'A4', 'B4'],
    'E6': ['E4', 'G#4', 'B4', 'C#5'],
    'F6': ['F4', 'A4', 'C5', 'D5'],
    'G6': ['G4', 'B4', 'D5', 'E5'],
    'A6': ['A4', 'C#5', 'E5', 'F#5'],
    'B6': ['B4', 'D#5', 'F#5', 'G#5'],

    // Minor 6th chords
    'Cm6': ['C4', 'Eb4', 'G4', 'A4'],
    'Dm6': ['D4', 'F4', 'A4', 'B4'],
    'Em6': ['E4', 'G4', 'B4', 'C#5'],
    'Fm6': ['F4', 'Ab4', 'C5', 'D5'],
    'Gm6': ['G4', 'Bb4', 'D5', 'E5'],
    'Am6': ['A4', 'C5', 'E5', 'F#5'],
    'Bm6': ['B4', 'D5', 'F#5', 'G#5'],

    // 9th chords (root, 3rd, 5th, b7, 9)
    'C9': ['C4', 'E4', 'G4', 'Bb4', 'D5'],
    'D9': ['D4', 'F#4', 'A4', 'C5', 'E5'],
    'E9': ['E4', 'G#4', 'B4', 'D5', 'F#5'],
    'F9': ['F4', 'A4', 'C5', 'Eb5', 'G5'],
    'G9': ['G4', 'B4', 'D5', 'F5', 'A5'],
    'A9': ['A4', 'C#5', 'E5', 'G5', 'B5'],
    'B9': ['B4', 'D#5', 'F#5', 'A5', 'C#6'],

    // Major 9th chords (root, 3rd, 5th, 7th, 9)
    'Cmaj9': ['C4', 'E4', 'G4', 'B4', 'D5'],
    'Dmaj9': ['D4', 'F#4', 'A4', 'C#5', 'E5'],
    'Emaj9': ['E4', 'G#4', 'B4', 'D#5', 'F#5'],
    'Fmaj9': ['F4', 'A4', 'C5', 'E5', 'G5'],
    'Gmaj9': ['G4', 'B4', 'D5', 'F#5', 'A5'],
    'Amaj9': ['A4', 'C#5', 'E5', 'G#5', 'B5'],
    'Bmaj9': ['B4', 'D#5', 'F#5', 'A#5', 'C#6'],

    // Minor 9th chords
    'Cm9': ['C4', 'Eb4', 'G4', 'Bb4', 'D5'],
    'Dm9': ['D4', 'F4', 'A4', 'C5', 'E5'],
    'Em9': ['E4', 'G4', 'B4', 'D5', 'F#5'],
    'Fm9': ['F4', 'Ab4', 'C5', 'Eb5', 'G5'],
    'Gm9': ['G4', 'Bb4', 'D5', 'F5', 'A5'],
    'Am9': ['A4', 'C5', 'E5', 'G5', 'B5'],
    'Bm9': ['B4', 'D5', 'F#5', 'A5', 'C#6'],

    // 11th chords (showing just the key tones: root, 7th, 9th, 11th)
    'C11': ['C4', 'Bb4', 'D5', 'F5'],
    'D11': ['D4', 'C5', 'E5', 'G5'],
    'E11': ['E4', 'D5', 'F#5', 'A5'],
    'F11': ['F4', 'Eb5', 'G5', 'Bb5'],
    'G11': ['G4', 'F5', 'A5', 'C6'],
    'A11': ['A4', 'G5', 'B5', 'D6'],
    'B11': ['B4', 'A5', 'C#6', 'E6'],

    // 13th chords (showing key tones: root, 3rd, b7, 13)
    'C13': ['C4', 'E4', 'Bb4', 'A5'],
    'D13': ['D4', 'F#4', 'C5', 'B5'],
    'E13': ['E4', 'G#4', 'D5', 'C#6'],
    'F13': ['F4', 'A4', 'Eb5', 'D6'],
    'G13': ['G4', 'B4', 'F5', 'E6'],
    'A13': ['A4', 'C#5', 'G5', 'F#6'],
    'B13': ['B4', 'D#5', 'A5', 'G#6'],

    // 7sus4 chords
    'C7sus4': ['C4', 'F4', 'G4', 'Bb4'],
    'D7sus4': ['D4', 'G4', 'A4', 'C5'],
    'E7sus4': ['E4', 'A4', 'B4', 'D5'],
    'F7sus4': ['F4', 'Bb4', 'C5', 'Eb5'],
    'G7sus4': ['G4', 'C5', 'D5', 'F5'],
    'A7sus4': ['A4', 'D5', 'E5', 'G5'],
    'B7sus4': ['B4', 'E5', 'F#5', 'A5']
};

// Add these mappings to your existing chordToNotes object
const flatChordMappings = {
    // Basic major chords with flats
    'Db': ['Db4', 'F4', 'Ab4'],
    'Eb': ['Eb4', 'G4', 'Bb4'],
    'Gb': ['Gb4', 'Bb4', 'Db5'],
    'Ab': ['Ab4', 'C5', 'Eb5'],
    'Bb': ['Bb4', 'D5', 'F5'],

    // Basic minor chords with flats
    'Dbm': ['Db4', 'E4', 'Ab4'],
    'Ebm': ['Eb4', 'Gb4', 'Bb4'],
    'Gbm': ['Gb4', 'A4', 'Db5'],
    'Abm': ['Ab4', 'B4', 'Eb5'],
    'Bbm': ['Bb4', 'Db5', 'F5'],

    // Major 7th chords with flats
    'Dbmaj7': ['Db4', 'F4', 'Ab4', 'C5'],
    'Ebmaj7': ['Eb4', 'G4', 'Bb4', 'D5'],
    'Gbmaj7': ['Gb4', 'Bb4', 'Db5', 'F5'],
    'Abmaj7': ['Ab4', 'C5', 'Eb5', 'G5'],
    'Bbmaj7': ['Bb4', 'D5', 'F5', 'A5'],

    // Minor 7th chords with flats
    'Dbm7': ['Db4', 'E4', 'Ab4', 'B4'],
    'Ebm7': ['Eb4', 'Gb4', 'Bb4', 'Db5'],
    'Gbm7': ['Gb4', 'A4', 'Db5', 'E5'],
    'Abm7': ['Ab4', 'B4', 'Eb5', 'Gb5'],
    'Bbm7': ['Bb4', 'Db5', 'F5', 'Ab5'],

    // Dominant 7th chords with flats
    'Db7': ['Db4', 'F4', 'Ab4', 'B4'],
    'Eb7': ['Eb4', 'G4', 'Bb4', 'Db5'],
    'Gb7': ['Gb4', 'Bb4', 'Db5', 'E5'],
    'Ab7': ['Ab4', 'C5', 'Eb5', 'Gb5'],
    'Bb7': ['Bb4', 'D5', 'F5', 'Ab5'],

    // 9th chords with flats
    'Db9': ['Db4', 'F4', 'Ab4', 'B4', 'Eb5'],
    'Eb9': ['Eb4', 'G4', 'Bb4', 'Db5', 'F5'],
    'Gb9': ['Gb4', 'Bb4', 'Db5', 'E5', 'Ab5'],
    'Ab9': ['Ab4', 'C5', 'Eb5', 'Gb5', 'Bb5'],
    'Bb9': ['Bb4', 'D5', 'F5', 'Ab5', 'C6'],

    // Major 9th chords with flats
    'Dbmaj9': ['Db4', 'F4', 'Ab4', 'C5', 'Eb5'],
    'Ebmaj9': ['Eb4', 'G4', 'Bb4', 'D5', 'F5'],
    'Gbmaj9': ['Gb4', 'Bb4', 'Db5', 'F5', 'Ab5'],
    'Abmaj9': ['Ab4', 'C5', 'Eb5', 'G5', 'Bb5'],
    'Bbmaj9': ['Bb4', 'D5', 'F5', 'A5', 'C6'],

    // 11th chords with flats
    'Db11': ['Db4', 'B4', 'Eb5', 'Gb5'],
    'Eb11': ['Eb4', 'Db5', 'F5', 'Ab5'],
    'Gb11': ['Gb4', 'E5', 'Ab5', 'B5'],
    'Ab11': ['Ab4', 'Gb5', 'Bb5', 'Db6'],
    'Bb11': ['Bb4', 'Ab5', 'C6', 'Eb6'],

    // 13th chords with flats
    'Db13': ['Db4', 'F4', 'B4', 'Bb5'],
    'Eb13': ['Eb4', 'G4', 'Db5', 'C6'],
    'Gb13': ['Gb4', 'Bb4', 'E5', 'Eb6'],
    'Ab13': ['Ab4', 'C5', 'Gb5', 'F6'],
    'Bb13': ['Bb4', 'D5', 'Ab5', 'G6'],

    // Sus chords with flats
    'Dbsus4': ['Db4', 'Gb4', 'Ab4'],
    'Ebsus4': ['Eb4', 'Ab4', 'Bb4'],
    'Gbsus4': ['Gb4', 'B4', 'Db5'],
    'Absus4': ['Ab4', 'Db5', 'Eb5'],
    'Bbsus4': ['Bb4', 'Eb5', 'F5'],

    // 7sus4 chords with flats
    'Db7sus4': ['Db4', 'Gb4', 'Ab4', 'B4'],
    'Eb7sus4': ['Eb4', 'Ab4', 'Bb4', 'Db5'],
    'Gb7sus4': ['Gb4', 'B4', 'Db5', 'E5'],
    'Ab7sus4': ['Ab4', 'Db5', 'Eb5', 'Gb5'],
    'Bb7sus4': ['Bb4', 'Eb5', 'F5', 'Ab5']
};

// Merge the flat chord mappings with the existing chordToNotes object
Object.assign(chordToNotes, flatChordMappings);

// Initialize Tone.js instruments
async function initAudio() {
    if (isAudioInitialized) return;
    
    try {
        await Tone.start();
        console.log('Audio is ready');
        
        // Create synth based on selected instrument
        createInstrument(document.getElementById('instrument-select').value);
        
        // Set up reverb for better sound
        const reverb = new Tone.Reverb({
            decay: 2,
            wet: 0.2
        }).toDestination();
        
        // Add compression for better dynamics
        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 4,
            attack: 0.3,
            release: 0.1
        }).toDestination();
        
        // Connect effects
        if (synth) {
            synth.connect(compressor);
            synth.connect(reverb);
        }
        
        // Create the loop but don't start it
        loop = new Tone.Loop(time => {
            if (currentChords.length > 0) {
                const chord = currentChords[currentChordIndex];
                playChord(chord, time);
                updateCurrentChordDisplay(chord);
                currentChordIndex = (currentChordIndex + 1) % currentChords.length;
            }
        }, "1n").start(0);
        
        // Set initial tempo
        Tone.Transport.bpm.value = parseInt(document.getElementById('bpm-input').value);
        isAudioInitialized = true;
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        alert('Failed to initialize audio. Please try again.');
    }
}

function createInstrument(type) {
    if (synth) {
        synth.dispose();
    }

    switch (type) {
        case 'piano':
            synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "triangle",
                    partials: [1, 0.5, 0.25]
                },
                envelope: {
                    attack: 0.02,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 1.5
                },
                volume: -8
            }).toDestination();
            break;
        case 'synth':
            synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "sine",
                    partials: [1, 0.2, 0.1]
                },
                envelope: {
                    attack: 0.05,
                    decay: 0.2,
                    sustain: 0.5,
                    release: 1
                },
                volume: -10
            }).toDestination();
            break;
        case 'electric':
            synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "square",
                    partials: [1, 0.3, 0.1]
                },
                envelope: {
                    attack: 0.05,
                    decay: 0.2,
                    sustain: 0.4,
                    release: 0.8
                },
                volume: -12
            }).toDestination();
            break;
    }
}

function updateCurrentChordDisplay(chord) {
    document.getElementById('current-chord').textContent = chord;
}

function playChord(chord, time) {
    const notes = chordToNotes[chord];
    if (!notes) return;

    // Add slight timing variations for more natural sound
    const duration = "1n";  // one measure
    const velocity = 0.7;   // not too loud

    // Play root note slightly earlier and louder
    synth.triggerAttackRelease(notes[0], duration, time - 0.02, velocity + 0.1);
    
    // Stagger the remaining notes slightly
    for (let i = 1; i < notes.length; i++) {
        const noteTime = time + (i * 0.02);
        const noteVelocity = velocity - (i * 0.05); // decrease velocity for upper notes
        synth.triggerAttackRelease(notes[i], duration, noteTime, noteVelocity);
    }
}

async function togglePlayback() {
    if (!isPlaying) {
        await startPlayback();
    } else {
        stopPlayback();
    }
}

async function startPlayback() {
    if (!currentChords.length) return;
    
    try {
        // Initialize audio if not already done
        if (!isAudioInitialized) {
            await initAudio();
        }
        
        isPlaying = true;
        currentChordIndex = 0;
        document.getElementById('play-btn').textContent = 'Pause';
        document.getElementById('stop-btn').disabled = false;
        
        if (Tone.Transport.state !== 'started') {
            await Tone.start();
            Tone.Transport.start();
        }
    } catch (error) {
        console.error('Playback error:', error);
        alert('Failed to start playback. Please try again.');
    }
}

function stopPlayback() {
    isPlaying = false;
    Tone.Transport.stop();
    document.getElementById('play-btn').textContent = 'Play';
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('current-chord').textContent = '';
}

async function generateChords() {
    const moodInput = document.getElementById('mood-input').value;
    if (!moodInput.trim()) {
        alert('Please enter a mood or scene description');
        return;
    }

    // Show loading state
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const measures = parseInt(document.getElementById('measures-select').value);
        const response = await fetch('/api/generate-chords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                mood: moodInput,
                measures: measures
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate chords');
        }

        const data = await response.json();
        currentChords = data.chords;
        
        // Display chords with measure breaks
        const chordsWithBreaks = currentChords.reduce((acc, chord, index) => {
            if (index > 0 && index % 4 === 0) {
                return acc + ' | ' + chord;
            }
            return acc + (index === 0 ? '' : ' → ') + chord;
        }, '');
        
        document.getElementById('chord-display').textContent = chordsWithBreaks;
        document.getElementById('results-section').style.display = 'block';
        
        // Enable play button
        document.getElementById('play-btn').disabled = false;
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate chord progression. Please try again.');
    } finally {
        // Reset generate button
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Chord Progression';
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn').addEventListener('click', generateChords);
    document.getElementById('play-btn').addEventListener('click', togglePlayback);
    document.getElementById('stop-btn').addEventListener('click', stopPlayback);
    
    // Initially disable play button
    document.getElementById('play-btn').disabled = true;
    
    // Add listeners for settings changes
    document.getElementById('bpm-input').addEventListener('change', (e) => {
        if (isAudioInitialized) {
            Tone.Transport.bpm.value = parseInt(e.target.value);
        }
    });
    
    document.getElementById('instrument-select').addEventListener('change', (e) => {
        if (isAudioInitialized) {
            createInstrument(e.target.value);
        }
    });
});