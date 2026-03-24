import { useState } from 'react';
import Layout from '../components/Layout';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <Layout title="Word Counter" description="Count words, characters, sentences, and paragraphs instantly for free.">
      <div className="tool-page">
        <h1>Word Counter</h1>
        <p>Count words, characters, sentences, and more</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20, textAlign: 'center' }}>
          {[
            { label: 'Words', value: words },
            { label: 'Characters', value: chars },
            { label: 'No spaces', value: charsNoSpaces },
            { label: 'Sentences', value: sentences },
            { label: 'Paragraphs', value: paragraphs },
            { label: 'Reading time', value: `${readingTime} min` },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#f8f9fb', borderRadius: 10, padding: '16px 12px' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#2563eb' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          style={{
            width: '100%',
            minHeight: 320,
            padding: 20,
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 16,
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.8,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />

        {text.length > 0 && (
          <div className="actions">
            <button className="btn btn-outline" onClick={() => setText('')}>Clear text</button>
            <button className="btn btn-outline" onClick={() => navigator.clipboard?.writeText(text)}>Copy text</button>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
