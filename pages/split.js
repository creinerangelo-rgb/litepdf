import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState('range');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
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
    const count = doc.getPageCount();
    setPageCount(count);
    setRangeStart(1);
    setRangeEnd(count);
  };

  const split = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();

      const start = Math.max(1, rangeStart) - 1;
      const end = Math.min(pageCount, rangeEnd);
      const indices = [];
      for (let i = start; i < end; i++) indices.push(i);

      const pages = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error splitting PDF: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `split_pages_${rangeStart}-${rangeEnd}.pdf`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Split PDF" description="Extract specific pages from a PDF file for free. Fast and private.">
      <div className="tool-page">
        <h1>Split PDF</h1>
        <p>Extract specific pages from your PDF document</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">✂️</div>
                <h3>Drop a PDF file here or click to browse</h3>
                <p>Select a PDF file to split</p>
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
                    From page:
                    <input type="number" min={1} max={pageCount} value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} style={{ width: 70 }} />
                  </label>
                  <label>
                    To page:
                    <input type="number" min={1} max={pageCount} value={rangeEnd} onChange={e => setRangeEnd(Number(e.target.value))} style={{ width: 70 }} />
                  </label>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={split} disabled={processing}>
                    {processing ? 'Splitting...' : `Extract pages ${rangeStart}–${rangeEnd}`}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>PDF split successfully!</h3>
            <p>Extracted pages {rangeStart}–{rangeEnd}</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download split PDF</button>
              <button className="btn btn-outline" onClick={reset}>Split another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
