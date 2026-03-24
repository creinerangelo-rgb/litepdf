import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const inputRef = useRef();

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setOriginalSize(f.size);
    setDone(false);
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Re-save with optimizations - pdf-lib strips unused objects on save
      const pdfBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100,
      });

      setNewSize(pdfBytes.length);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error compressing PDF: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `compressed_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setResultUrl(null);
  };

  const savings = originalSize > 0 ? Math.max(0, Math.round((1 - newSize / originalSize) * 100)) : 0;

  return (
    <Layout title="Compress PDF" description="Reduce PDF file size for free. Fast compression right in your browser.">
      <div className="tool-page">
        <h1>Compress PDF</h1>
        <p>Reduce your PDF file size by removing unused data</p>

        {!done ? (
          <>
            <div className="upload-zone" onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
              <div className="icon">📦</div>
              <h3>{file ? file.name : 'Drop a PDF file here or click to browse'}</h3>
              <p>{file ? formatSize(file.size) : 'Select a PDF file to compress'}</p>
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={compress} disabled={!file || processing}>
                {processing ? 'Compressing...' : 'Compress PDF'}
              </button>
              {file && <button className="btn btn-outline" onClick={reset}>Clear</button>}
            </div>
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>PDF compressed!</h3>
            <p>
              {formatSize(originalSize)} → {formatSize(newSize)}
              {savings > 0 && <strong> ({savings}% smaller)</strong>}
              {savings === 0 && ' — file was already well optimized'}
            </p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download compressed PDF</button>
              <button className="btn btn-outline" onClick={reset}>Compress another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
