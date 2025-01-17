# Vibes to Chords

A web application that generates chord progressions based on moods or scenes using OpenAI's GPT-3.5 and plays them back using Tone.js.

## Features

- Generate chord progressions from mood descriptions
- Support for 1-4 measures (4-16 chords)
- Playback with different instruments (piano, synth, electric piano)
- Adjustable tempo (BPM)
- Wide variety of chord types supported (major, minor, 7th, 9th, 11th, 13th, etc.)
- Beautiful, responsive UI

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open `http://localhost:3000` in your browser

## Technologies Used

- Node.js & Express
- OpenAI API
- Tone.js for audio synthesis
- HTML/CSS/JavaScript

## License

MIT 