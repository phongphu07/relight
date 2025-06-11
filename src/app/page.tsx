"use client";
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
  const [showNodes, setShowNodes] = useState(true); // moved here

  const handleAddLight = () => {
    if (!image) return;
    const id = Date.now();
    const newLight: Light = {
      id,
      pos: { x: 256, y: 256 },
      brightness: 1.0,
      distance: 800,
      radius: 100,
      color: "#effdc9",
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

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">AI Relight Tool</h1>

      {/* Review toggle button */}
      <button
        onClick={() => setShowNodes((prev) => !prev)}
        className="px-4 py-1 bg-blue-600 text-white rounded mb-2"
      >
        {showNodes ? "Review" : "Edit"}
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4"
      />

      {image && (
        <div className="flex gap-6">
          <LightCanvas
            image={URL.createObjectURL(image)}
            lights={lights}
            onDrop={handleDrop}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            showNodes={showNodes}
          />

          <div className="w-[300px]">
            {selectedId !== null && (
              <LightControlPanel
                light={lights.find((l) => l.id === selectedId)!}
                updateLight={(upd) => updateLight(selectedId, upd)}
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
