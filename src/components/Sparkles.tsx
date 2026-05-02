import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Sparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 8,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      emoji: ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute opacity-30"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: sparkle.size,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
        >
          {sparkle.emoji}
        </motion.span>
      ))}
    </div>
  );
}
