import React from 'react';
import { motion } from 'framer-motion';
import type { MemeTemplate } from '../App';

interface MemeTemplatesProps {
  templates: MemeTemplate[];
  selectedId: string | null;
  onSelect: (template: MemeTemplate) => void;
}

const decorationEmojis: Record<string, string> = {
  crown: '👑',
  sunglasses: '😎',
  wizard: '🧙',
  cowboy: '🤠',
  bowtie: '🎀',
};

export default function MemeTemplates({ templates, selectedId, onSelect }: MemeTemplatesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {templates.map((template, index) => (
        <motion.button
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(template)}
          className={`
            relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 text-left
            transition-all duration-200
            ${selectedId === template.id
              ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black'
              : 'hover:ring-1 hover:ring-white/30'
            }
          `}
          style={{ background: template.bgColor }}
        >
          {/* Decoration badge */}
          {template.decoration && (
            <span className="absolute top-2 right-2 text-lg md:text-xl">
              {decorationEmojis[template.decoration]}
            </span>
          )}

          {/* Template name */}
          <h3 className="font-display text-sm md:text-base font-bold text-white drop-shadow-md mb-1">
            {template.name}
          </h3>

          {/* Preview text */}
          <p className="text-[10px] md:text-xs text-white/70 font-body line-clamp-2 leading-tight">
            "{template.topText}... {template.bottomText}"
          </p>

          {/* Selected indicator */}
          {selectedId === template.id && (
            <motion.div
              layoutId="selected-indicator"
              className="absolute inset-0 border-2 border-yellow-400 rounded-xl md:rounded-2xl pointer-events-none"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
