import { useState, useRef } from 'react';
import Layout from '../components/Layout';

export default function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const inputRef = useRef();

  const addFiles = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...newFiles]);
    setDone(false);
    e.target.value = '';
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const convert = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let image;

        if (file.type === 'image/png') {
          image = await doc.embedPng(bytes);
        } else {
          image = await doc.embedJpg(bytes);
        }

        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch (err) {
      alert('Error converting images: ' + err.message);
    }

    setProcessing(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'images.pdf';
    a.click();
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setResultUrl(null);
  };

  return (
    <Layout title="JPG to PDF" description="Convert JPG and PNG images to PDF for free. Combine multiple images into one PDF.">
      <div className="tool-page">
        <h1>JPG to PDF</h1>
        <p>Convert images to a PDF document</p>

        {!done ? (
          <>
            <div className="upload-zone" onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/jpg" multiple onChange={addFiles} />
              <div className="icon">📄</div>
              <h3>Drop images here or click to browse</h3>
              <p>Supports JPG and PNG files</p>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span className="name">{f.name}</span>
                    <span className="size">{formatSize(f.size)}</span>
                    <button className="remove" onClick={() => removeFile(i)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="actions">
              <button className="btn btn-primary" onClick={convert} disabled={files.length === 0 || processing}>
                {processing ? 'Converting...' : `Convert ${files.length} image${files.length !== 1 ? 's' : ''} to PDF`}
              </button>
              {files.length > 0 && <button className="btn btn-outline" onClick={reset}>Clear all</button>}
            </div>
          </>
        ) : (
          <div className="result-box">
            <div className="check">✅</div>
            <h3>Images converted to PDF!</h3>
            <p>{files.length} image{files.length !== 1 ? 's' : ''} combined into one PDF</p>
            <div className="actions">
              <button className="btn btn-success" onClick={download}>Download PDF</button>
              <button className="btn btn-outline" onClick={reset}>Convert more images</button>
            </div>
          </div>
        )}

        <div className="ad-slot">Advertisement</div>
      </div>
    </Layout>
  );
}
