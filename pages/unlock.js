import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setDone(false);
    setError(null);
  };

  const unlock = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
        password: password || undefined,
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      setError('Could not unlock this PDF. Make sure the password is correct.');
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `unlocked_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setDone(false);
    setResultUrl(null);
    setError(null);
  };

  return (
    <Layout title="Unlock PDF" description="Remove password protection from PDF files for free. Fast and private.">
      <div className="tool-page">
        <h1>Unlock PDF</h1>
        <p>Remove password protection from your PDF</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">🔓</div>
                <h3>Drop a protected PDF here or click to browse</h3>
                <p>Select a password-protected PDF to unlock</p>
              </div>
            ) : (
              <>
                <div className="file-list">
                  <div className="file-item">
                    <span className="name">{file.name}</span>
                    <button className="remove" onClick={reset}>×</button>
                  </div>
                </div>

                <div className="options-row">
                  <label>
                    PDF Password:
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the current password"
                      style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, width: 220 }}
                    />
                  </label>
                </div>

                {error && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: '#fef2f2', border: '1px solid #fca5a5', fontSize: 14, color: '#dc2626' }}>
                    {error}
                  </div>
                )}

                <div className="actions">
                  <button className="btn btn-primary" onClick={unlock} disabled={processing}>
                    {processing ? 'Unlocking...' : 'Unlock PDF'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">🔓</div>
            <h3>PDF unlocked successfully!</h3>
            <p>Password protection has been removed</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download unlocked PDF</button>
              <button className="btn btn-outline" onClick={reset}>Unlock another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
