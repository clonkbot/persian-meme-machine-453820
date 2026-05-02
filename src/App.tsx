import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCanvas from './components/MemeCanvas';
import MemeTemplates from './components/MemeTemplates';
import UploadZone from './components/UploadZone';
import Sparkles from './components/Sparkles';

export type MemeTemplate = {
  id: string;
  name: string;
  topText: string;
  bottomText: string;
  bgColor: string;
  facePosition: { x: number; y: number; scale: number; rotation: number };
  decoration?: 'sunglasses' | 'crown' | 'bowtie' | 'wizard' | 'cowboy';
};

const memeTemplates: MemeTemplate[] = [
  {
    id: 'dramatic',
    name: 'Drama Queen',
    topText: 'when they open a can',
    bottomText: 'but it\'s just corn',
    bgColor: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
    facePosition: { x: 50, y: 50, scale: 1.2, rotation: 0 },
    decoration: 'crown',
  },
  {
    id: 'business',
    name: 'CEO Cat',
    topText: 'i would like to discuss',
    bottomText: 'your empty bowl situation',
    bgColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    facePosition: { x: 50, y: 45, scale: 1, rotation: 0 },
    decoration: 'sunglasses',
  },
  {
    id: 'wizard',
    name: 'Wizard Floof',
    topText: 'you shall not pass',
    bottomText: 'without giving treats',
    bgColor: 'linear-gradient(135deg, #7b2cbf 0%, #240046 100%)',
    facePosition: { x: 50, y: 48, scale: 1.1, rotation: -5 },
    decoration: 'wizard',
  },
  {
    id: 'cowboy',
    name: 'Yeehaw Kitty',
    topText: 'this town ain\'t',
    bottomText: 'big enough for both of us',
    bgColor: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
    facePosition: { x: 50, y: 52, scale: 1, rotation: 3 },
    decoration: 'cowboy',
  },
  {
    id: 'fancy',
    name: 'Fancy Floof',
    topText: 'pardon me',
    bottomText: 'do you have any grey poupon',
    bgColor: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
    facePosition: { x: 50, y: 50, scale: 0.95, rotation: 0 },
    decoration: 'bowtie',
  },
  {
    id: 'confused',
    name: 'Confused Persian',
    topText: 'wait what',
    bottomText: 'you\'re going WHERE without me',
    bgColor: 'linear-gradient(135deg, #ff758f 0%, #ff7eb3 100%)',
    facePosition: { x: 50, y: 50, scale: 1.15, rotation: 8 },
  },
];

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setSelectedTemplate(null);
  }, []);

  const handleTemplateSelect = useCallback((template: MemeTemplate) => {
    setIsGenerating(true);
    setSelectedTemplate(template);
    setTimeout(() => setIsGenerating(false), 800);
  }, []);

  const handleRandomize = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * memeTemplates.length);
    handleTemplateSelect(memeTemplates[randomIndex]);
  }, [handleTemplateSelect]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'persian-meme.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setSelectedTemplate(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden relative flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Sparkles />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="relative z-10 py-6 md:py-10 px-4"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-2 md:mb-4"
          >
            <span className="text-4xl md:text-6xl">🐱</span>
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              PERSIAN
            </span>
            <br />
            <span className="text-white/90">MEME MACHINE</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body mt-3 md:mt-4 text-base md:text-lg text-white/60 max-w-md mx-auto px-4"
          >
            Upload your fluffy overlord. Get legendary memes.
            <br />
            <span className="text-pink-400/80 text-sm">(same face, different vibes)</span>
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 pb-8 md:pb-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!uploadedImage ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <UploadZone onImageUpload={handleImageUpload} />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Preview & Controls */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Meme Preview */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative w-full max-w-md mx-auto">
                    <motion.div
                      className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20 border-2 border-white/10"
                      animate={isGenerating ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <MemeCanvas
                        ref={canvasRef}
                        uploadedImage={uploadedImage}
                        template={selectedTemplate}
                      />
                      {isGenerating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                          <div className="text-4xl md:text-6xl animate-bounce">✨</div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRandomize}
                        className="flex-1 py-3 md:py-4 px-6 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-xl md:rounded-2xl font-bold text-base md:text-lg text-black shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow"
                      >
                        🎲 Random Meme
                      </motion.button>
                      {selectedTemplate && (
                        <motion.button
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDownload}
                          className="flex-1 py-3 md:py-4 px-6 bg-white/10 border border-white/20 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 transition-colors"
                        >
                          💾 Download
                        </motion.button>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="mt-3 w-full py-2 text-white/50 hover:text-white/80 text-sm transition-colors"
                    >
                      ← Upload different cat
                    </motion.button>
                  </div>
                </div>

                {/* Template Gallery */}
                <div className="lg:w-96 xl:w-[28rem]">
                  <h2 className="font-display text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center lg:text-left">
                    <span className="text-yellow-300">Pick</span> a vibe
                  </h2>
                  <MemeTemplates
                    templates={memeTemplates}
                    selectedId={selectedTemplate?.id ?? null}
                    onSelect={handleTemplateSelect}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 md:py-6 text-center">
        <p className="text-white/30 text-xs md:text-sm font-body">
          Requested by <span className="text-white/50">@spvce7</span> · Built by <span className="text-white/50">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
