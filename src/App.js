import React, { useState } from 'react';
import './App.css'; 

export default function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Talk directly to your local backend proxy server instead of Google
      const res = await fetch('https://akshat-bot.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResponse(data.text);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-container">
      <header className="gemini-header">
        <h1>Gemini AI Playground</h1>
        <p>Ask anything and get real-time answers powered by Gemini</p>
      </header>

      <main className="gemini-main">
        <form onSubmit={handleSubmit} className="gemini-form">
          <div className="input-group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your prompt here..."
              rows="4"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? <span className="spinner"></span> : 'Submit'}
            </button>
          </div>
        </form>

        <section className="response-section">
          {loading && (
            <div className="status-message loading">
              Thinking...
            </div>
          )}

          {error && (
            <div className="status-message error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {response && !loading && (
            <div className="response-box">
              <h3>Response:</h3>
              <div className="response-text">{response}</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}