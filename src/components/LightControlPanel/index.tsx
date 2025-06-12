import { Light } from "@/app/page";

type Props = {
  light: Light;
  updateLight: (updated: Partial<Light>) => void;
  onDelete: () => void;
  showComparison: boolean;
  toggleComparison: () => void;
};

export default function LightControlPanel({
  light,
  updateLight,
  onDelete,
  showComparison,
  toggleComparison,
}: Props) {
  const sliderStyle =
    "w-full h-2 rounded-full bg-gradient-to-r from-blue-200 to-blue-800 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all";
  return (
    <div className="bg-gray-800 p-4 rounded-xl text-white w-full text-sm space-y-4">
      <h2 className="text-lg font-bold">Light Settings</h2>

      {/* Color */}
      <div>
        <label className="block mb-1">Color</label>
        <input
          type="color"
          value={light.color}
          onChange={(e) => updateLight({ color: e.target.value })}
          className="w-12 h-6 rounded"
        />
      </div>

      {/* Brightness */}
      <div>
        <label className="block mb-1">
          Brightness ({light.brightness.toFixed(2)})
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={light.brightness}
          onChange={(e) =>
            updateLight({ brightness: parseFloat(e.target.value) })
          }
          className={sliderStyle}
        />
      </div>

      {/* Distance */}
      <div>
        <label className="block mb-1">
          Distance ({light.distance.toFixed(0)})
        </label>
        <input
          type="range"
          min="10"
          max="2000"
          step="10"
          value={light.distance}
          onChange={(e) =>
            updateLight({ distance: parseFloat(e.target.value) })
          }
          className={sliderStyle}
        />
      </div>

      {/* Radius */}
      <div>
        <label className="block mb-1">Radius ({light.radius.toFixed(0)})</label>
        <input
          type="range"
          min="1"
          max="300"
          step="1"
          value={light.radius}
          onChange={(e) => updateLight({ radius: parseFloat(e.target.value) })}
          className={sliderStyle}
        />
      </div>

      {/* Toggle Comparison */}
      <div>
        <label className="block mb-1">Comparison Mode</label>
        <button
          onClick={toggleComparison}
          className="w-full bg-purple-600 hover:bg-purple-700 py-1 rounded"
        >
          {showComparison ? "Hide Comparison" : "Show Comparison"}
        </button>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="w-full bg-red-600 hover:bg-red-700 py-1 rounded mt-2"
      >
        Delete Light
      </button>
    </div>
  );
}
