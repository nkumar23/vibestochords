let currentChords = [];
let isPlaying = false;
let currentChordIndex = 0;
let isAudioInitialized = false;

// Initialize audio
let synth;
let loop;

// Add to the top with other global variables
let leadSynth;
let currentMode = 'chords';

// Add after the global variables at the top
let previousVoicing = null;

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

// Add after the chordToNotes object and before initAudio

function generateChordVoicing(chord) {
    const notes = chordToNotes[chord];
    if (!notes) return null;

    // Get the base notes of the chord
    const baseNotes = notes.map(note => {
        const pitch = Tone.Frequency(note).toMidi();
        return { note, pitch };
    });

    // If we have a previous voicing, try to minimize movement
    if (previousVoicing) {
        // Convert previous voicing to MIDI numbers for comparison
        const prevPitches = previousVoicing.map(note => Tone.Frequency(note).toMidi());
        
        // Find the closest voicing
        let bestVoicing = null;
        let minTotalDistance = Infinity;
        
        // Try different octave adjustments for each note
        const octaveRange = [-1, 0, 1]; // Try one octave up and down
        const maxCombinations = 100; // Limit the number of combinations to try
        let combinations = 0;
        
        function tryVoicing(currentVoicing = [], noteIndex = 0) {
            if (combinations >= maxCombinations) return;
            if (noteIndex === baseNotes.length) {
                // Calculate total distance from previous voicing
                let totalDistance = 0;
                const voicingPitches = currentVoicing.map(n => n.pitch);
                
                // Calculate voice leading distance
                for (let i = 0; i < Math.min(prevPitches.length, voicingPitches.length); i++) {
                    totalDistance += Math.abs(prevPitches[i] - voicingPitches[i]);
                }
                
                // Check range between highest and lowest notes
                const range = Math.max(...voicingPitches) - Math.min(...voicingPitches);
                if (range <= 24) { // Maximum 2 octave spread
                    if (totalDistance < minTotalDistance) {
                        minTotalDistance = totalDistance;
                        bestVoicing = currentVoicing.map(n => n.note);
                    }
                }
                combinations++;
                return;
            }
            
            // Try each octave adjustment for this note
            for (const octave of octaveRange) {
                const pitch = baseNotes[noteIndex].pitch + (octave * 12);
                const note = Tone.Frequency(pitch, 'midi').toNote();
                tryVoicing([...currentVoicing, { note, pitch }], noteIndex + 1);
            }
        }
        
        tryVoicing();
        
        if (bestVoicing) {
            previousVoicing = bestVoicing;
            return bestVoicing;
        }
    }

    // If no previous voicing or couldn't find good voice leading, use standard voicing patterns
    const voicingPatterns = [
        // Root position
        [0, 1, 2, 3, 4],
        // First inversion (third in bass)
        [1, 2, 3, 4, 0],
        // Second inversion (fifth in bass)
        [2, 3, 4, 0, 1],
        // Drop 2 voicing
        [0, 2, 1, 3, 4],
        // Drop 3 voicing
        [0, 3, 1, 2, 4]
    ];

    const pattern = voicingPatterns[Math.floor(Math.random() * voicingPatterns.length)];
    let voicing = pattern.map(i => {
        if (typeof i === 'number' && baseNotes[i]) {
            const octaveAdjust = Math.floor(i / baseNotes.length) * 12;
            return {
                note: Tone.Frequency(baseNotes[i].pitch + octaveAdjust).toNote(),
                pitch: baseNotes[i].pitch + octaveAdjust
            };
        }
        return null;
    }).filter(n => n);

    // Ensure reasonable range
    const range = voicing[voicing.length - 1].pitch - voicing[0].pitch;
    if (range > 24) {
        voicing = voicing.map(n => {
            if (n.pitch - voicing[0].pitch > 24) {
                return {
                    note: Tone.Frequency(n.pitch - 12).toNote(),
                    pitch: n.pitch - 12
                };
            }
            return n;
        });
    }

    const result = voicing.map(n => n.note);
    previousVoicing = result;
    return result;
}

// Modify the playChord function
function playChord(chord, time) {
    if (currentMode === 'chords') {
        const voicing = generateChordVoicing(chord);
        if (!voicing) return;

        const duration = "1n";
        const velocity = 0.7;

        // Play the bass note slightly earlier and louder
        synth.triggerAttackRelease(voicing[0], duration, time - 0.02, velocity + 0.1);
        
        // Stagger the remaining notes
        for (let i = 1; i < voicing.length; i++) {
            const noteTime = time + (i * 0.02);
            const noteVelocity = velocity - (i * 0.05);
            synth.triggerAttackRelease(voicing[i], duration, noteTime, noteVelocity);
        }
    } else {
        // Lead line mode
        const scale = getScaleForChord(chord);
        const density = document.getElementById('density-select').value;
        const melody = generateMelodyForChord(chord, scale, density);

        let noteTime = time;
        melody.forEach(({ note, duration }) => {
            if (note) {
                leadSynth.triggerAttackRelease(note, duration, noteTime, 0.7);
            }
            noteTime += Tone.Time(duration).toSeconds();
        });
    }
}

// Initialize Tone.js instruments
async function initAudio() {
    if (isAudioInitialized) return;
    
    try {
        await Tone.start();
        console.log('Audio is ready');
        
        createInstrument(document.getElementById('instrument-select').value);
        createLeadInstrument('lead');
        
        const reverb = new Tone.Reverb({
            decay: 2,
            wet: 0.2
        }).toDestination();
        
        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 4,
            attack: 0.3,
            release: 0.1
        }).toDestination();
        
        if (synth) {
            synth.connect(compressor);
            synth.connect(reverb);
        }
        if (leadSynth) {
            leadSynth.connect(compressor);
            leadSynth.connect(reverb);
        }
        
        loop = new Tone.Loop(time => {
            if (currentChords.length > 0) {
                const chord = currentChords[currentChordIndex];
                playChord(chord, time);
                updateCurrentChordDisplay(chord);
                currentChordIndex = (currentChordIndex + 1) % currentChords.length;
            }
        }, "1n").start(0);
        
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

function createLeadInstrument(type) {
    if (leadSynth) {
        leadSynth.dispose();
    }

    const commonSettings = {
        volume: -8,
        envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.4,
            release: 0.5
        }
    };

    switch (type) {
        case 'lead':
            leadSynth = new Tone.Synth({
                oscillator: {
                    type: 'sawtooth',
                    partials: [1, 0.5, 0.3]
                },
                envelope: {
                    ...commonSettings.envelope,
                    sustain: 0.3
                },
                volume: -10
            }).toDestination();
            break;
        case 'flute':
            leadSynth = new Tone.Synth({
                oscillator: {
                    type: 'sine',
                    partials: [1, 0.3, 0.1]
                },
                envelope: {
                    ...commonSettings.envelope,
                    attack: 0.1,
                    sustain: 0.5
                },
                volume: -12
            }).toDestination();
            break;
        default:
            leadSynth = new Tone.Synth(commonSettings).toDestination();
    }
}

function updateCurrentChordDisplay(chord) {
    document.getElementById('current-chord').textContent = chord;
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
    previousVoicing = null; // Reset voice leading when stopping
}

async function generateChords() {
    const moodInput = document.getElementById('mood-input').value;
    const measuresSelect = document.getElementById('measures-select');
    const measures = parseInt(measuresSelect.value);
    const apiKey = document.getElementById('api-key-input').value;

    if (!apiKey) {
        alert('Please enter your OpenAI API key');
        return;
    }

    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const response = await fetch('/.netlify/functions/generate-chords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mood: moodInput,
                measures,
                apiKey
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate chords');
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
        document.getElementById('play-btn').disabled = false;
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate chord progression. Please try again.');
    } finally {
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

    document.getElementById('playback-mode').addEventListener('change', (e) => {
        currentMode = e.target.value;
        document.body.classList.toggle('lead-mode', currentMode === 'lead');
        
        // Update instrument options based on mode
        const instrumentSelect = document.getElementById('instrument-select');
        if (currentMode === 'lead') {
            instrumentSelect.value = 'lead';
            createLeadInstrument('lead');
        } else {
            instrumentSelect.value = 'piano';
            createInstrument('piano');
        }
    });

    document.getElementById('density-select').addEventListener('change', () => {
        if (isPlaying) {
            stopPlayback();
            startPlayback();
        }
    });
});

// Add these utility functions for lead line generation
function getScaleForChord(chord) {
    // Extract root note and chord quality
    const root = chord.replace(/maj7|m7|7|m|aug|dim7|dim|sus[24]|[0-9]/g, '');
    const quality = chord.replace(root, '');
    
    // Define scale patterns (intervals from root)
    const scalePatterns = {
        '': [0, 2, 4, 5, 7, 9, 11], // major
        'm': [0, 2, 3, 5, 7, 8, 10], // minor
        '7': [0, 2, 4, 5, 7, 9, 10], // mixolydian
        'maj7': [0, 2, 4, 5, 7, 9, 11], // major
        'm7': [0, 2, 3, 5, 7, 8, 10], // dorian
        'dim': [0, 2, 3, 5, 6, 8, 9], // diminished
        'aug': [0, 2, 4, 6, 8, 10], // whole tone
    };

    // Get base pattern
    let pattern = scalePatterns[''];
    Object.keys(scalePatterns).forEach(quality => {
        if (chord.includes(quality)) {
            pattern = scalePatterns[quality];
        }
    });

    // Convert root note to MIDI number
    const noteToMidi = {
        'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
        'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
        'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
    };

    const rootMidi = noteToMidi[root];
    
    // Generate scale notes
    return pattern.map(interval => {
        const midiNote = rootMidi + interval;
        return Tone.Frequency(midiNote, 'midi').toNote();
    });
}

function getPersonaParameters(persona) {
    const params = {
        default: {
            scalePreference: 0.6,    // Probability of using scale tones
            chordPreference: 0.3,    // Probability of using chord tones
            restPreference: 0.1,     // Probability of using rests
            stepwiseMotion: 0.5,     // Preference for stepwise motion
            rhythmicComplexity: 0.5,  // Complexity of rhythmic patterns
            registerPreference: 'mid' // Preferred register
        },
        coltrane: {
            scalePreference: 0.4,
            chordPreference: 0.5,
            restPreference: 0.1,
            stepwiseMotion: 0.3,
            rhythmicComplexity: 0.8,
            registerPreference: 'wide'
        },
        greenwood: {
            scalePreference: 0.7,
            chordPreference: 0.2,
            restPreference: 0.1,
            stepwiseMotion: 0.4,
            rhythmicComplexity: 0.7,
            registerPreference: 'high'
        },
        kennyg: {
            scalePreference: 0.8,
            chordPreference: 0.15,
            restPreference: 0.05,
            stepwiseMotion: 0.8,
            rhythmicComplexity: 0.3,
            registerPreference: 'mid'
        }
    };
    return params[persona] || params.default;
}

function generateRhythmPattern(density) {
    const persona = document.getElementById('persona-select').value;
    const params = getPersonaParameters(persona);
    
    const patterns = {
        sparse: [
            ['4n', '4n', '4n', '4n'],
            ['2n', '2n'],
            ['4n', '4n.', '8n', '4n']
        ],
        medium: params.rhythmicComplexity > 0.6 ? [
            ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n'],
            ['4n', '8n', '8n', '4n', '4n'],
            ['8n', '8n', '4n', '8n', '8n', '4n']
        ] : [
            ['4n', '4n', '8n', '8n', '4n'],
            ['4n.', '8n', '4n', '4n'],
            ['4n', '8n', '8n', '4n', '4n']
        ],
        dense: params.rhythmicComplexity > 0.6 ? [
            ['16n', '16n', '16n', '16n', '8n', '8n', '8n', '8n'],
            ['8t', '8t', '8t', '8t', '8t', '8t', '4n', '4n'],
            ['16n', '16n', '8n', '16n', '16n', '8n', '8n', '8n']
        ] : [
            ['8n', '8n', '8n', '8n', '4n', '4n'],
            ['8n', '8n', '4n', '8n', '8n', '4n'],
            ['8n', '4n', '8n', '4n', '4n']
        ]
    };

    return patterns[density][Math.floor(Math.random() * patterns[density].length)];
}

function generateMelodyForChord(chord, scale, density) {
    const rhythm = generateRhythmPattern(density);
    const melody = [];
    let previousNote = null;
    
    const persona = document.getElementById('persona-select').value;
    const params = getPersonaParameters(persona);

    // Adjust scale notes based on register preference
    const adjustedScale = scale.map(note => {
        const pitch = Tone.Frequency(note).toMidi();
        switch(params.registerPreference) {
            case 'high':
                return Tone.Frequency(pitch + 12, 'midi').toNote();
            case 'wide':
                return Math.random() > 0.5 ? Tone.Frequency(pitch + 12, 'midi').toNote() : note;
            default:
                return note;
        }
    });

    rhythm.forEach((duration) => {
        let note;
        const rand = Math.random();

        if (rand < params.scalePreference) {
            // Use scale tone
            if (params.stepwiseMotion > Math.random() && previousNote) {
                // Generate stepwise motion
                const prevPitch = Tone.Frequency(previousNote).toMidi();
                const step = Math.random() > 0.5 ? 1 : -1;
                note = Tone.Frequency(prevPitch + step, 'midi').toNote();
            } else {
                note = adjustedScale[Math.floor(Math.random() * adjustedScale.length)];
            }
        } else if (rand < params.scalePreference + params.chordPreference) {
            // Use chord tone
            const chordNotes = chordToNotes[chord];
            note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
        } else {
            // Use rest
            note = null;
        }

        // Avoid repeating the same note unless it's Kenny G style
        while (note === previousNote && params.stepwiseMotion < 0.7) {
            note = adjustedScale[Math.floor(Math.random() * adjustedScale.length)];
        }
        previousNote = note;

        melody.push({ note, duration });
    });

    return melody;
}