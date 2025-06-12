"use client";

import { Light } from "@/app/page";
import { useEffect, useRef } from "react";

function hexToRGB(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

type Props = {
  image: string;
  lights: Light[];
  onDrop: (id: number, x: number, y: number) => void;
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  showNodes: boolean;
  onRendered: (dataUrl: string) => void;
};

export default function RelitImageRenderer({
  image,
  lights,

  onRendered,
}: Props) {
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_WIDTH = 512;
  const CANVAS_HEIGHT = 512;

  useEffect(() => {
    const canvas = hiddenCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX = CANVAS_WIDTH / img.width;
      const scaleY = CANVAS_HEIGHT / img.height;
      const scale = Math.min(scaleX, scaleY);

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (CANVAS_WIDTH - drawWidth) / 2;
      const offsetY = (CANVAS_HEIGHT - drawHeight) / 2;

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const baseData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const data = new Uint8ClampedArray(baseData.data);

      for (const lt of lights) {
        const { x: lx, y: ly } = lt.pos;
        const b = lt.brightness;
        const r = lt.radius;
        const [lr, lg, lb] = hexToRGB(lt.color);

        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > r) continue;

            const x = lx + dx;
            const y = ly + dy;
            if (x < 0 || y < 0 || x >= CANVAS_WIDTH || y >= CANVAS_HEIGHT)
              continue;

            const idx = (Math.floor(y) * CANVAS_WIDTH + Math.floor(x)) * 4;
            const weight = 1 - dist / r;
            const factor = 1 + (b - 1) * weight;

            data[idx] = Math.min(255, data[idx] * factor * (lr / 255));
            data[idx + 1] = Math.min(255, data[idx + 1] * factor * (lg / 255));
            data[idx + 2] = Math.min(255, data[idx + 2] * factor * (lb / 255));
          }
        }
      }

      const newImage = new ImageData(data, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.putImageData(newImage, 0, 0);

      const url = canvas.toDataURL();
      onRendered(url);
    };
  }, [image, lights]);

  return <canvas ref={hiddenCanvasRef} className="hidden" />;
}
