import { Light } from "@/app/page";

type Props = {
  light: Light;
  updateLight: (updated: Partial<Light>) => void;
};

export default function LightControlPanel({ light, updateLight }: Props) {
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
          className="w-full"
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
          className="w-full"
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
          className="w-full"
        />
      </div>
    </div>
  );
}
