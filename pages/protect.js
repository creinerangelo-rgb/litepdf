import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function ProtectPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const inputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setDone(false);
  };

  const protect = async () => {
    if (!file || !password) return;
    setProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);

      const pdfBytes = await doc.save({
        userPassword: password,
        ownerPassword: password,
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error encrypting PDF: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `protected_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Password Protect PDF" description="Encrypt your PDF with a password for free. Secure your documents in seconds.">
      <div className="tool-page">
        <h1>Password Protect PDF</h1>
        <p>Encrypt your PDF with a password so only authorized users can open it</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">🔒</div>
                <h3>Drop a PDF file here or click to browse</h3>
                <p>Select a PDF to password protect</p>
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
                    Password:
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a password"
                      style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, width: 200 }}
                    />
                  </label>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={protect} disabled={processing || !password}>
                    {processing ? 'Encrypting...' : 'Protect PDF'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">🔒</div>
            <h3>PDF protected successfully!</h3>
            <p>Your PDF is now encrypted with a password</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download protected PDF</button>
              <button className="btn btn-outline" onClick={reset}>Protect another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
