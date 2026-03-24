import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function PageNumbersPDF() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState('bottom-center');
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

  const addPageNumbers = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1} / ${total}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x, y;
        if (position === 'bottom-center') { x = (width - textWidth) / 2; y = 30; }
        else if (position === 'bottom-left') { x = 40; y = 30; }
        else if (position === 'bottom-right') { x = width - textWidth - 40; y = 30; }
        else if (position === 'top-center') { x = (width - textWidth) / 2; y = height - 30; }
        else if (position === 'top-left') { x = 40; y = height - 30; }
        else if (position === 'top-right') { x = width - textWidth - 40; y = height - 30; }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error adding page numbers: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `numbered_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Add Page Numbers to PDF" description="Add page numbers to your PDF document for free. Choose position and format.">
      <div className="tool-page">
        <h1>Add Page Numbers</h1>
        <p>Add page numbers to every page of your PDF</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">🔢</div>
                <h3>Drop a PDF file here or click to browse</h3>
                <p>Select a PDF to add page numbers</p>
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
                    Position:
                    <select value={position} onChange={(e) => setPosition(e.target.value)}>
                      <option value="bottom-center">Bottom center</option>
                      <option value="bottom-left">Bottom left</option>
                      <option value="bottom-right">Bottom right</option>
                      <option value="top-center">Top center</option>
                      <option value="top-left">Top left</option>
                      <option value="top-right">Top right</option>
                    </select>
                  </label>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={addPageNumbers} disabled={processing}>
                    {processing ? 'Adding numbers...' : 'Add Page Numbers'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>Page numbers added!</h3>
            <p>Added numbers to all {pageCount} pages</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download numbered PDF</button>
              <button className="btn btn-outline" onClick={reset}>Number another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
