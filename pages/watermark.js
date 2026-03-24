import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function WatermarkPDF() {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.15);
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

  const addWatermark = async () => {
    if (!file || !watermarkText) return;
    setProcessing(true);

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 8;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity,
          rotate: degrees(-45),
        });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error adding watermark: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `watermarked_${file.name}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="Add Watermark to PDF" description="Add a text watermark to your PDF pages for free. Fast and private.">
      <div className="tool-page">
        <h1>Watermark PDF</h1>
        <p>Add a text watermark to every page of your PDF</p>

        {!done ? (
          <>
            {!file ? (
              <div className="upload-zone" onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
                <div className="icon">💧</div>
                <h3>Drop a PDF file here or click to browse</h3>
                <p>Select a PDF to add a watermark</p>
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
                    Watermark text:
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL"
                      style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, width: 200 }}
                    />
                  </label>
                  <label>
                    Opacity:
                    <select value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}>
                      <option value={0.05}>Very light</option>
                      <option value={0.15}>Light</option>
                      <option value={0.3}>Medium</option>
                      <option value={0.5}>Strong</option>
                    </select>
                  </label>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={addWatermark} disabled={processing || !watermarkText}>
                    {processing ? 'Adding watermark...' : 'Add Watermark'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>Watermark added successfully!</h3>
            <p>"{watermarkText}" has been added to every page</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download watermarked PDF</button>
              <button className="btn btn-outline" onClick={reset}>Watermark another file</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
