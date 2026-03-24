import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const inputRef = useRef();

  const addFiles = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...newFiles]);
    setDone(false);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setDone(false);
  };

  const moveFile = (idx, dir) => {
    const arr = [...files];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setFiles(arr);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const merge = async () => {
    if (files.length < 2) return;
    setProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(page => merged.addPage(page));
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setDone(true);
    } catch (err) {
      alert('Error merging PDFs: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'merged.pdf';
    a.click();
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Merge PDF" description="Combine multiple PDF files into one document for free. Fast, private, works in your browser.">
      <div className="tool-page">
        <h1>Merge PDF</h1>
        <p>Combine multiple PDF files into one document</p>

        {!done ? (
          <>
            <div className="upload-zone" onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" multiple onChange={addFiles} />
              <div className="icon">📎</div>
              <h3>Drop PDF files here or click to browse</h3>
              <p>Select two or more PDF files to merge</p>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span style={{ color: '#9ca3af', marginRight: 8, fontSize: 12 }}>
                      <button onClick={() => moveFile(i, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>↑</button>
                      <button onClick={() => moveFile(i, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>↓</button>
                    </span>
                    <span className="name">{f.name}</span>
                    <span className="size">{formatSize(f.size)}</span>
                    <button className="remove" onClick={() => removeFile(i)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="actions">
              <button className="btn btn-primary" onClick={merge} disabled={files.length < 2 || processing}>
                {processing ? 'Merging...' : `Merge ${files.length} files`}
              </button>
              {files.length > 0 && (
                <button className="btn btn-outline" onClick={reset}>Clear all</button>
              )}
            </div>
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>PDFs merged successfully!</h3>
            <p>{files.length} files combined into one document</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download merged PDF</button>
              <button className="btn btn-outline" onClick={reset}>Merge more files</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
