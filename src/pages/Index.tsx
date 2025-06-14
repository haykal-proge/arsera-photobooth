
import React, { useState } from 'react';
import { Camera, Image, Printer, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotoCapture from '@/components/PhotoCapture';
import PhotoEditor from '@/components/PhotoEditor';
import PrintPreview from '@/components/PrintPreview';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'home' | 'capture' | 'edit' | 'print'>('home');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [editedPhoto, setEditedPhoto] = useState<string | null>(null);

  const handlePhotoCapture = (photoDataUrl: string) => {
    setCapturedPhoto(photoDataUrl);
    setCurrentStep('edit');
  };

  const handlePhotoEdit = (editedPhotoDataUrl: string) => {
    setEditedPhoto(editedPhotoDataUrl);
    setCurrentStep('print');
  };

  const resetToHome = () => {
    setCurrentStep('home');
    setCapturedPhoto(null);
    setEditedPhoto(null);
  };

  if (currentStep === 'capture') {
    return <PhotoCapture onCapture={handlePhotoCapture} onBack={() => setCurrentStep('home')} />;
  }

  if (currentStep === 'edit' && capturedPhoto) {
    return <PhotoEditor photo={capturedPhoto} onSave={handlePhotoEdit} onBack={() => setCurrentStep('capture')} />;
  }

  if (currentStep === 'print' && editedPhoto) {
    return <PrintPreview photo={editedPhoto} onBack={() => setCurrentStep('edit')} onHome={resetToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                PhotoBooth
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-5 w-5 text-pink-500 animate-pulse" />
              <span className="text-sm text-gray-600">Capture Magic Moments</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Arsera Photo Booth
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ciptakan kenangan indah dengan garis tepi yang lucu, efek yang mengagumkan, dan pencetakan instan. 
            Sempurna untuk pesta, acara, dan momen istimewamu!
          </p>
          <Button
            onClick={() => setCurrentStep('capture')}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Camera className="mr-2 h-6 w-6" />
            Mulai sesi foto
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/60 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-pink-400 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-pink-600">Instant Capture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Mengambil foto yang sempurna secara instan dengan antarmuka kamera yang mudah digunakan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-purple-600">Cute Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Tambahkan batas, filter, dan efek yang menggemaskan untuk membuat foto Anda menjadi ajaib
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-indigo-400 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-indigo-600">Print & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Cetak foto Anda secara instan atau unduh untuk dibagikan dengan teman
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sample Gallery */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Contoh Style Foto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="absolute inset-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Image className="h-12 w-12 text-pink-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                    <Sparkles className="h-4 w-4 text-yellow-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-pink-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Siap Menciptakan Keajaiban?</h2>
          <p className="text-gray-600 mb-8">Bergabunglah dengan ribuan pengguna yang bahagia menciptakan kenangan indah</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setCurrentStep('capture')}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
            >
              <Camera className="mr-2 h-5 w-5" />
              Mulai Sekarang
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full"
            >
              <Download className="mr-2 h-5 w-5" />
              Lihat Sampel
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
