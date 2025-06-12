"use client";

import { Light } from "@/app/page";
import dynamic from "next/dynamic";
import { useState } from "react";
import RelitImageRenderer from "../RelightImageRender";

const ReactCompareImage = dynamic(() => import("react-compare-image"), {
  ssr: false,
});

type Props = {
  original: string;
  lights: Light[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  onDrop: (id: number, x: number, y: number) => void;
  showNodes: boolean;
};

export default function CompareSlider({
  original,
  lights,
  selectedId,
  setSelectedId,
  onDrop,
}: Props) {
  const [relitUrl, setRelitUrl] = useState<string>("");

  return (
    <div className="relative w-[512px] h-[512px]">
      <RelitImageRenderer
        image={original}
        lights={lights}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onDrop={onDrop}
        showNodes={false}
        onRendered={(url) => setRelitUrl(url)}
      />

      {relitUrl && (
        <ReactCompareImage
          leftImage={original}
          rightImage={relitUrl}
          sliderLineColor="#ffffff"
          sliderPositionPercentage={0.5}
        />
      )}
    </div>
  );
}
