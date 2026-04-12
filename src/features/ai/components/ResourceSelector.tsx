import { Select } from "@ui/Select";
import { formatTime } from "@utils/formatTime";
import type { ResLike } from "../types";

export function ResourceSelector({
  resources,
  selectedIndex,
  isDisabled,
  onChangeModel,
  selectedTime,
}: {
  resources: readonly ResLike[];
  selectedIndex: number;
  isDisabled: boolean;
  onChangeModel: (index: number) => void;
  selectedTime: number;
}) {
  return (
    <div className="w-full sm:w-[560px]">
      <label className="block text-xs font-medium text-slate-700">Modèle</label>
      <div className="mt-2 flex flex-col gap-3">
        <Select
          value={selectedIndex}
          onChange={(event) => onChangeModel(Number(event.target.value))}
          disabled={isDisabled}
        >
          {resources.map((res, idx) => (
            <option key={`${res.name}-${idx}`} value={idx}>
              {"origin" in res ? `${res.name} (no orphans)` : res.name}
            </option>
          ))}
        </Select>
        <p className="text-xs text-slate-500">
          Chargé actuellement : {resources.length} - Temps simulé: {formatTime(selectedTime)}
        </p>
      </div>
    </div>
  );
}
