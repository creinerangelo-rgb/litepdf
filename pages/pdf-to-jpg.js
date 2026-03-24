import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function PdfToJpg() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [images, setImages] = useState([]);
  const inputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setDone(false);
    setImages([]);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const results = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        results.push({ url: dataUrl, page: i });
      }

      setImages(results);
      setDone(true);
    } catch (err) {
      alert('Error converting PDF: ' + err.message);
    }

    setProcessing(false);
  };

  const downloadImage = (img) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `page_${img.page}.jpg`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img), i * 200);
    });
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setImages([]);
  };

  return (
    <Layout title="PDF to JPG" description="Convert PDF pages to JPG images for free. High quality conversion in your browser.">
      <div className="tool-page">
        <h1>PDF to JPG</h1>
        <p>Convert each page of your PDF to a JPG image</p>

        {!done ? (
          <>
            <div className="upload-zone" onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
              <div className="icon">🖼️</div>
              <h3>{file ? file.name : 'Drop a PDF file here or click to browse'}</h3>
              <p>{file ? `Ready to convert` : 'Select a PDF to convert to images'}</p>
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={convert} disabled={!file || processing}>
                {processing ? 'Converting...' : 'Convert to JPG'}
              </button>
              {file && <button className="btn btn-outline" onClick={reset}>Clear</button>}
            </div>
          </>
        ) : (
          <>
            <div className="result-box">
              <div className="check">✅</div>
              <h3>Converted {images.length} page{images.length !== 1 ? 's' : ''} to JPG!</h3>
              <div className="actions">
                <button className="btn btn-success" onClick={downloadAll}>Download all images</button>
                <button className="btn btn-outline" onClick={reset}>Convert another PDF</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
              {images.map((img) => (
                <div key={img.page} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }} onClick={() => downloadImage(img)}>
                  <img src={img.url} alt={`Page ${img.page}`} style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '8px 12px', fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
                    Page {img.page} — click to download
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
