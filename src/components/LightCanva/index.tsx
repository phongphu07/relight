"use client";
import { Light } from "@/app/page";
import React, { useEffect, useRef, useState } from "react";

const ZONE_DEFINITIONS = [
  ["Core", 0.3],
  ["Falloff", 0.6],
  ["Soft Edge", 1.0],
] as const;

type Props = {
  image: string;
  lights: Light[];
  onDrop: (id: number, x: number, y: number) => void;
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  showNodes: boolean;
};

function hexToRGB(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export default function LightCanvas({
  image,
  lights,
  onDrop,
  selectedId,
  setSelectedId,
  showNodes,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const CANVAS_WIDTH = 512;
  const CANVAS_HEIGHT = 512;

  const getRelativeCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDraggingId(id);
    setSelectedId(id);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null) return;
    const { x, y } = getRelativeCoords(e);
    onDrop(draggingId, x, y);
  };

  const handleClickToMoveSelected = (e: React.MouseEvent) => {
    if (!showNodes || selectedId === null) return;
    const { x, y } = getRelativeCoords(e);
    onDrop(selectedId, x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
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
    };
  }, [image, lights]);

  return (
    <div
      ref={containerRef}
      className="relative w-[512px] h-[512px] border border-white rounded-xl shadow-lg bg-black overflow-hidden select-none"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClickToMoveSelected}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0" />

      {lights.map((lt) => {
        const isSelected = lt.id === selectedId;
        return (
          <React.Fragment key={lt.id}>
            {showNodes && (
              <div
                className="absolute w-6 h-6 rounded-full cursor-pointer bg-white/10 border border-blue-500"
                style={{
                  top: lt.pos.y - 12,
                  left: lt.pos.x - 12,
                  zIndex: 10,
                }}
                onMouseDown={(e) => handleMouseDown(e, lt.id)}
              />
            )}

            {isSelected &&
              showNodes &&
              ZONE_DEFINITIONS.map(([, ratio], i) => {
                if (ratio > 1) return null;
                const r = lt.radius * ratio;
                const d = r * 2;
                return (
                  <div
                    key={i}
                    className="absolute border border-dashed border-gray-400"
                    style={{
                      top: lt.pos.y - r,
                      left: lt.pos.x - r,
                      width: d,
                      height: d,
                      borderRadius: "50%",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                );
              })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
