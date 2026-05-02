import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export default function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="w-full max-w-lg"
    >
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative block cursor-pointer group
          rounded-3xl border-3 border-dashed
          p-8 md:p-12 text-center
          transition-all duration-300
          ${isDragging
            ? 'border-yellow-400 bg-yellow-400/10 scale-105'
            : 'border-white/20 bg-white/5 hover:border-pink-400 hover:bg-pink-400/5'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="sr-only"
        />

        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-pink-400/50 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-pink-400/50 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-pink-400/50 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-pink-400/50 rounded-br-lg" />

        <motion.div
          animate={isDragging ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          className="text-6xl md:text-7xl mb-4 md:mb-6 inline-block"
        >
          {isDragging ? '😻' : '📸'}
        </motion.div>

        <p className="font-display text-xl md:text-2xl font-bold text-white/90 mb-2">
          Drop your Persian here
        </p>
        <p className="font-body text-sm md:text-base text-white/50">
          or click to browse your royal archives
        </p>

        {/* Animated sparkle accents */}
        <motion.span
          className="absolute -top-2 -right-2 text-2xl"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute -bottom-2 -left-2 text-xl"
          animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
        >
          ⭐
        </motion.span>
      </label>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <p className="text-white/40 text-sm font-body">
          💡 Tip: Clear front-facing photos work best for maximum meme energy
        </p>
      </motion.div>
    </motion.div>
  );
}
