
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Sparkles, Heart, Star, Flower } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PhotoEditorProps {
  photo: string;
  onSave: (editedPhoto: string) => void;
  onBack: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onSave, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBorder, setSelectedBorder] = useState<string>('none');
  const [selectedFilter, setSelectedFilter] = useState<string>('none');

  const borders = [
    { id: 'none', name: 'No Border', preview: 'bg-gray-200' },
    { id: 'hearts', name: 'Hearts', preview: 'bg-pink-200', color: '#ec4899' },
    { id: 'stars', name: 'Stars', preview: 'bg-yellow-200', color: '#f59e0b' },
    { id: 'flowers', name: 'Flowers', preview: 'bg-purple-200', color: '#a855f7' },
    { id: 'rainbow', name: 'Rainbow', preview: 'bg-gradient-to-r from-red-200 via-yellow-200 to-blue-200' },
  ];

  const filters = [
    { id: 'none', name: 'Original' },
    { id: 'warm', name: 'Warm' },
    { id: 'cool', name: 'Cool' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'bright', name: 'Bright' },
  ];

  const drawPhoto = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;
      
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw photo with some padding for border
      const padding = selectedBorder !== 'none' ? 40 : 0;
      const photoWidth = canvas.width - (padding * 2);
      const photoHeight = canvas.height - (padding * 2);
      
      // Apply filter
      if (selectedFilter !== 'none') {
        ctx.filter = getFilterCSS(selectedFilter);
      }
      
      ctx.drawImage(img, padding, padding, photoWidth, photoHeight);
      ctx.filter = 'none';
      
      // Draw border
      if (selectedBorder !== 'none') {
        drawBorder(ctx, canvas.width, canvas.height, selectedBorder);
      }
    };
    
    img.src = photo;
  };

  const getFilterCSS = (filter: string): string => {
    switch (filter) {
      case 'warm':
        return 'sepia(0.3) saturate(1.2) hue-rotate(10deg)';
      case 'cool':
        return 'saturate(1.1) hue-rotate(180deg) brightness(1.1)';
      case 'vintage':
        return 'sepia(0.5) contrast(1.2) brightness(0.9)';
      case 'bright':
        return 'brightness(1.2) contrast(1.1) saturate(1.2)';
      default:
        return 'none';
    }
  };

  const drawBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, borderType: string) => {
    const borderWidth = 40;
    
    switch (borderType) {
      case 'hearts':
        drawHeartBorder(ctx, width, height, borderWidth);
        break;
      case 'stars':
        drawStarBorder(ctx, width, height, borderWidth);
        break;
      case 'flowers':
        drawFlowerBorder(ctx, width, height, borderWidth);
        break;
      case 'rainbow':
        drawRainbowBorder(ctx, width, height, borderWidth);
        break;
    }
  };

  const drawHeartBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, borderWidth: number) => {
    ctx.fillStyle = '#ec4899';
    const heartSize = 12;
    const spacing = 25;
    
    // Top and bottom borders
    for (let x = 0; x < width; x += spacing) {
      drawHeart(ctx, x + 10, 15, heartSize);
      drawHeart(ctx, x + 10, height - 25, heartSize);
    }
    
    // Left and right borders
    for (let y = 0; y < height; y += spacing) {
      drawHeart(ctx, 15, y + 10, heartSize);
      drawHeart(ctx, width - 25, y + 10, heartSize);
    }
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 4, y);
    ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
    ctx.quadraticCurveTo(x + size / 2, y, x + size * 3/4, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
    ctx.quadraticCurveTo(x + size, y + size / 2, x + size * 3/4, y + size * 3/4);
    ctx.lineTo(x + size / 2, y + size);
    ctx.lineTo(x + size / 4, y + size * 3/4);
    ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
    ctx.fill();
  };

  const drawStarBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, borderWidth: number) => {
    ctx.fillStyle = '#f59e0b';
    const starSize = 10;
    const spacing = 30;
    
    // Draw stars around the border
    for (let x = 0; x < width; x += spacing) {
      drawStar(ctx, x + 15, 15, starSize);
      drawStar(ctx, x + 15, height - 25, starSize);
    }
    
    for (let y = 0; y < height; y += spacing) {
      drawStar(ctx, 15, y + 15, starSize);
      drawStar(ctx, width - 25, y + 15, starSize);
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5;
      const xPos = x + Math.cos(angle) * size;
      const yPos = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(xPos, yPos);
      else ctx.lineTo(xPos, yPos);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawFlowerBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, borderWidth: number) => {
    ctx.fillStyle = '#a855f7';
    const flowerSize = 8;
    const spacing = 25;
    
    // Draw flowers around the border
    for (let x = 0; x < width; x += spacing) {
      drawFlower(ctx, x + 15, 15, flowerSize);
      drawFlower(ctx, x + 15, height - 25, flowerSize);
    }
    
    for (let y = 0; y < height; y += spacing) {
      drawFlower(ctx, 15, y + 15, flowerSize);
      drawFlower(ctx, width - 25, y + 15, flowerSize);
    }
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Draw 5 petals
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const angle = (i * 2 * Math.PI) / 5;
      const petalX = x + Math.cos(angle) * size;
      const petalY = y + Math.sin(angle) * size;
      ctx.arc(petalX, petalY, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Center
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, size / 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#a855f7';
  };

  const drawRainbowBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, borderWidth: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7'];
    const stripeWidth = borderWidth / colors.length;
    
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      const offset = index * stripeWidth;
      
      // Top border
      ctx.fillRect(0, offset, width, stripeWidth);
      // Bottom border
      ctx.fillRect(0, height - borderWidth + offset, width, stripeWidth);
      // Left border
      ctx.fillRect(offset, 0, stripeWidth, height);
      // Right border
      ctx.fillRect(width - borderWidth + offset, 0, stripeWidth, height);
    });
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const editedPhoto = canvasRef.current.toDataURL('image/jpeg', 0.9);
    onSave(editedPhoto);
  };

  useEffect(() => {
    drawPhoto();
  }, [photo, selectedBorder, selectedFilter]);

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
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Your Photo</h1>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Continue
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Photo Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 p-6">
              <canvas
                ref={canvasRef}
                className="w-full max-w-2xl mx-auto border border-gray-200 rounded-lg shadow-lg"
              />
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Border Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-pink-500" />
                Cute Borders
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {borders.map((border) => (
                  <button
                    key={border.id}
                    onClick={() => setSelectedBorder(border.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedBorder === border.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${border.preview}`}></div>
                    <span className="text-sm font-medium text-gray-700">{border.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Filter Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-purple-500" />
                Photo Filters
              </h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedFilter === filter.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="font-medium text-gray-700">{filter.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
