import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PdfViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const pdfBlobUrl = localStorage.getItem("mockTestPDF");
    if (!pdfBlobUrl) return;

    pdfjsLib.getDocument(pdfBlobUrl).promise.then((pdf) => {
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      renderPage(pdf, 1);
    });
  }, []);

  const renderPage = (pdf: any, pageNum: number) => {
    pdf.getPage(pageNum).then((page: any) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      page.render(renderContext);
    });
  };

  const nextPage = () => {
    if (pdfDoc && currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      renderPage(pdfDoc, next);
    }
  };

  const prevPage = () => {
    if (pdfDoc && currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      renderPage(pdfDoc, prev);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4>Question Paper Viewer</h4>
      <canvas ref={canvasRef} style={{ border: "1px solid #aaa" }} />
      <br />
      <button onClick={prevPage}>Previous</button>
      <span style={{ margin: "0 10px" }}>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={nextPage}>Next</button>
    </div>
  );
};

export default PdfViewer;