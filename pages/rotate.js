import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function RotatePDF() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setDone(false);

    const { PDFDocument } = await import('pdf-lib');
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const rotate = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);

      doc.getPages().forEach(page => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + rotation));
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error rotating PDF: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `rotated_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Rotate PDF" description="Rotate PDF pages 90°, 180°, or 270° for free. Fast and private.">
      <div className="tool-page">
        <h1>Rotate PDF</h1>
        <p>Rotate all pages of your PDF document</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">🔄</div>
                <h3>Drop a PDF file here or click to browse</h3>
                <p>Select a PDF to rotate</p>
              </div>
            ) : (
              <>
                <div className="file-list">
                  <div className="file-item">
                    <span className="name">{file.name}</span>
                    <span className="size">{pageCount} pages</span>
                    <button className="remove" onClick={reset}>×</button>
                  </div>
                </div>

                <div className="options-row">
                  <label>
                    Rotation:
                    <select value={rotation} onChange={(e) => setRotation(Number(e.target.value))}>
                      <option value={90}>90° clockwise</option>
                      <option value={180}>180°</option>
                      <option value={270}>90° counter-clockwise</option>
                    </select>
                  </label>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={rotate} disabled={processing}>
                    {processing ? 'Rotating...' : 'Rotate PDF'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>PDF rotated successfully!</h3>
            <p>All {pageCount} pages rotated {rotation}°</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download rotated PDF</button>
              <button className="btn btn-outline" onClick={reset}>Rotate another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
