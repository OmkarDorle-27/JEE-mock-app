import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCw, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PdfViewerProps {
  currentQuestion: number;
  onQuestionNavigate: (questionNumber: number) => void;
}

export default function PdfViewer({ currentQuestion, onQuestionNavigate }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20); // Typical exam papers have around 20 pages
  const [pdfKey, setPdfKey] = useState(0); // Force PDF reload
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Get PDF from localStorage
    const storedPdfUrl = localStorage.getItem('mockTestPDF');
    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl);
      setLoading(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevPage();
      } else if (event.key === 'ArrowRight') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Update PDF URL when page changes
  useEffect(() => {
    console.log(`Navigating to page ${currentPage}`);
    if (pdfUrl) {
      const newUrl = `${pdfUrl}#page=${currentPage}&zoom=${Math.round(scale * 100)}&view=FitH&toolbar=1&navpanes=0&scrollbar=1`;
      setCurrentPdfUrl(newUrl);
      setPdfKey(prev => prev + 1);
    }
  }, [currentPage, pdfUrl, scale]);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);
  
  const nextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(newPage);
  };
  const prevPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'question-paper.pdf';
      link.click();
    }
  };

  if (loading || !pdfUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* PDF Controls */}
      <div className="flex justify-between items-center p-3 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} title="Previous Page">
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <span className="text-sm text-gray-600 min-w-20 text-center">
            Page {currentPage} / {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} title="Next Page">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 ml-4">Q: {currentQuestion}</span>
          <Button variant="outline" size="sm" onClick={downloadPdf}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Viewer - Full Height */}
      <div className="flex-1 bg-gray-100 p-2 overflow-auto relative">
        {/* Left Navigation Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Right Navigation Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div 
          className="w-full h-full flex justify-center items-start"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center top',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          <iframe
            key={`pdf-${pdfKey}`}
            src={currentPdfUrl || `${pdfUrl}#page=${currentPage}&zoom=${Math.round(scale * 100)}&view=FitH&toolbar=1`}
            className="w-full h-full-pdf border shadow-lg rounded-lg bg-white"
            title="Question Paper PDF"
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>

      {/* Compact Navigation */}
      <div className="p-2 border-t bg-gray-50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600 mr-2">Pages:</span>
            {[1, 2, 3, 4, 5, 10, 15, 20].map(pageNum => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="w-8 h-6 text-xs"
                disabled={pageNum > totalPages}
              >
                {pageNum}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600 mr-2">Questions:</span>
            {[1, 5, 10, 15, 20, 25, 30].map(qNum => (
              <Button
                key={qNum}
                variant={currentQuestion === qNum ? "default" : "outline"}
                size="sm"
                onClick={() => onQuestionNavigate(qNum)}
                className="w-8 h-6 text-xs"
              >
                {qNum}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">Use ← → arrow keys or buttons to navigate pages</span>
        </div>
      </div>
    </div>
  );
}