"use client";

import CompareSlider from "@/components/Compare";
import LightCanvas from "@/components/LightCanva";
import LightControlPanel from "@/components/LightControlPanel";
import { useState } from "react";

export type Light = {
  id: number;
  pos: { x: number; y: number };
  brightness: number;
  distance: number;
  radius: number;
  color: string;
};

function Relight() {
  const [image, setImage] = useState<File | null>(null);
  const [lights, setLights] = useState<Light[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNodes] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const handleAddLight = () => {
    if (!image) return;
    const id = Date.now();
    const newLight: Light = {
      id,
      pos: { x: 256, y: 256 },
      brightness: 1.7,
      distance: 800,
      radius: 100,
      color: "#ffffff",
    };
    setLights((prev) => [...prev, newLight]);
    setSelectedId(id);
  };

  const updateLight = (id: number, updated: Partial<Light>) => {
    setLights((prev) =>
      prev.map((lt) => (lt.id === id ? { ...lt, ...updated } : lt))
    );
  };

  const handleDrop = (id: number, x: number, y: number) => {
    setLights((prev) =>
      prev.map((lt) => (lt.id === id ? { ...lt, pos: { x, y } } : lt))
    );
  };

  const onDeleteLight = () => {
    if (selectedId !== null) {
      setLights((prev) => prev.filter((lt) => lt.id !== selectedId));
      setSelectedId(null);
    }
  };

  const toggleComparison = () => setShowComparison((prev) => !prev);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">AI Relight Tool</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4"
      />

      {image && (
        <div className="flex gap-6">
          {showComparison ? (
            <CompareSlider
              original={URL.createObjectURL(image)}
              lights={lights}
              selectedId={selectedId}
              showNodes={false}
              onDrop={handleDrop}
              setSelectedId={setSelectedId}
            />
          ) : (
            <LightCanvas
              image={URL.createObjectURL(image)}
              lights={lights}
              onDrop={handleDrop}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              showNodes={showNodes}
              showComparison={false}
            />
          )}

          <div className="w-[300px]">
            {selectedId !== null && (
              <LightControlPanel
                light={lights.find((l) => l.id === selectedId)!}
                updateLight={(upd) => updateLight(selectedId, upd)}
                onDelete={onDeleteLight}
                showComparison={showComparison}
                toggleComparison={toggleComparison}
              />
            )}
            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={handleAddLight}
            >
              + Light
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Relight;
