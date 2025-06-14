
import React, { useRef } from 'react';
import { ArrowLeft, Printer, Download, Home, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PrintPreviewProps {
  photo: string;
  onBack: () => void;
  onHome: () => void;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ photo, onBack, onHome }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Photo Print</title>
            <style>
              body { margin: 0; padding: 20px; background: white; }
              .print-layout { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                max-width: 800px; 
                margin: 0 auto; 
              }
              .photo-slot { 
                border: 2px dashed #ddd; 
                aspect-ratio: 4/3; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                overflow: hidden;
                border-radius: 8px;
              }
              .photo-slot img { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
              }
              .empty-slot {
                background: #f9f9f9;
                color: #999;
                font-family: Arial, sans-serif;
              }
              @media print {
                body { padding: 0; }
                .print-layout { gap: 10px; }
              }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo;
    link.download = `photobooth-${Date.now()}.jpg`;
    link.click();
    
    toast({
      title: "Photo Downloaded!",
      description: "Your photo has been saved to your device.",
    });
  };

  const copyToClipboard = async () => {
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': blob })
      ]);
      toast({
        title: "Copied to Clipboard!",
        description: "Your photo is ready to paste anywhere.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy photo to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Print Your Photos</h1>
          <Button
            onClick={onHome}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <Home className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Print Preview */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Print Layout Preview</h3>
              <div ref={printRef} className="bg-white p-4 rounded-lg shadow-inner">
                <div className="print-layout grid grid-cols-2 gap-4">
                  <div className="photo-slot border-2 border-dashed border-gray-300 aspect-[4/3] overflow-hidden rounded-lg">
                    <img src={photo} alt="Photo 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="photo-slot border-2 border-dashed border-gray-300 aspect-[4/3] overflow-hidden rounded-lg">
                    <img src={photo} alt="Photo 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="photo-slot border-2 border-dashed border-gray-300 aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-gray-400 text-sm">Empty Slot</span>
                  </div>
                  <div className="photo-slot border-2 border-dashed border-gray-300 aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-gray-400 text-sm">Empty Slot</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Single Photo Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Photo</h3>
              <div className="aspect-[4/3] overflow-hidden rounded-lg border-2 border-gray-200 mb-4">
                <img src={photo} alt="Final Photo" className="w-full h-full object-cover" />
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Photo</h3>
              <div className="space-y-3">
                <Button
                  onClick={handlePrint}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  size="lg"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Print Photos
                </Button>
                
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Photo
                </Button>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  size="lg"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy to Clipboard
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-white/60 backdrop-blur-sm border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-700 mb-3">💡 Printing Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use photo paper for best quality</li>
                <li>• Print at 300 DPI for sharp results</li>
                <li>• Standard 4x6 inch size recommended</li>
                <li>• Check your printer settings before printing</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
