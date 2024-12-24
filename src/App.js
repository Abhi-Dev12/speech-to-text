import React, { useState } from 'react';
import axios from 'axios';

const DeepgramSpeechToText = () => {
  const [audioUrl, setAudioUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e) => {
    setAudioUrl(e.target.value);
  };

  const transcribeAudio = async () => {
    if (!audioUrl) {
      alert('Please enter a valid audio URL!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true',
        {
          url: audioUrl,
        },
        {
          headers: {
            'Authorization': `Token ${process.env.REACT_APP_DEEPGRAM_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTranscription(response.data.results.channels[0].alternatives[0].transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('An error occurred while transcribing the audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Deepgram Speech-to-Text</h1>
      <input
        type="text"
        placeholder="Enter audio URL (e.g., https://example.com/audio.mp3)"
        value={audioUrl}
        onChange={handleUrlChange}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={transcribeAudio} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe'}
      </button>
      <div>
        <h2>Transcription:</h2>
        <p>{transcription || 'Your transcription will appear here.'}</p>
      </div>
    </div>
  );
};

export default DeepgramSpeechToText;
