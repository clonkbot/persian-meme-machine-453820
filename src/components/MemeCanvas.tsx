import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { MemeTemplate } from '../App';

interface MemeCanvasProps {
  uploadedImage: string;
  template: MemeTemplate | null;
}

const MemeCanvas = forwardRef<HTMLCanvasElement, MemeCanvasProps>(
  ({ uploadedImage, template }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 500;
      canvas.width = size;
      canvas.height = size;

      // Draw background
      if (template) {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        // Parse gradient colors from template
        const colors = template.bgColor.match(/#[a-fA-F0-9]{6}/g) || ['#1a1a1a', '#333333'];
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1] || colors[0]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#1a1a2e';
      }
      ctx.fillRect(0, 0, size, size);

      // Load and draw the cat image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const pos = template?.facePosition || { x: 50, y: 50, scale: 1, rotation: 0 };
        const scale = pos.scale * 0.7;
        const imgSize = size * scale;
        const x = (pos.x / 100) * size - imgSize / 2;
        const y = (pos.y / 100) * size - imgSize / 2;

        ctx.save();
        ctx.translate(x + imgSize / 2, y + imgSize / 2);
        ctx.rotate((pos.rotation * Math.PI) / 180);

        // Draw circular mask for cat face
        ctx.beginPath();
        ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();

        // Draw decoration if template has one
        if (template?.decoration) {
          drawDecoration(ctx, template.decoration, x + imgSize / 2, y, imgSize);
        }

        // Draw text
        if (template) {
          drawMemeText(ctx, template.topText, size, 50, size);
          drawMemeText(ctx, template.bottomText, size, size - 40, size);
        } else {
          // Default state text
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = 'bold 24px "Bangers", cursive';
          ctx.textAlign = 'center';
          ctx.fillText('Pick a meme template below!', size / 2, size - 30);
        }
      };
      img.src = uploadedImage;
    }, [uploadedImage, template]);

    const drawDecoration = (
      ctx: CanvasRenderingContext2D,
      type: string,
      x: number,
      y: number,
      faceSize: number
    ) => {
      ctx.save();
      ctx.font = `${faceSize * 0.35}px serif`;
      ctx.textAlign = 'center';

      switch (type) {
        case 'crown':
          ctx.fillText('👑', x, y - 10);
          break;
        case 'sunglasses':
          ctx.fillText('😎', x, y + faceSize * 0.5);
          ctx.globalCompositeOperation = 'source-over';
          break;
        case 'wizard':
          ctx.fillText('🧙‍♂️', x + faceSize * 0.3, y + faceSize * 0.1);
          break;
        case 'cowboy':
          ctx.fillText('🤠', x, y - 5);
          break;
        case 'bowtie':
          ctx.font = `${faceSize * 0.25}px serif`;
          ctx.fillText('🎀', x, y + faceSize * 0.85);
          break;
      }
      ctx.restore();
    };

    const drawMemeText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      canvasSize: number,
      y: number,
      maxWidth: number
    ) => {
      const fontSize = Math.min(42, canvasSize / 12);
      ctx.font = `bold ${fontSize}px "Bangers", cursive`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 8;
      ctx.lineJoin = 'round';

      const x = canvasSize / 2;
      ctx.strokeText(text.toUpperCase(), x, y, maxWidth - 40);
      ctx.fillText(text.toUpperCase(), x, y, maxWidth - 40);
    };

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-auto aspect-square"
        style={{ imageRendering: 'crisp-edges' }}
      />
    );
  }
);

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas;
