import { useMemo, useRef, useState } from "react";
import type { ResLike } from "../types";

export function useAIDemoSimulation(resources: readonly ResLike[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [classifiedIndex, setClassifiedIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const selected = useMemo(
    () => resources[selectedIndex] ?? resources[0],
    [resources, selectedIndex],
  );

  const classified = useMemo(
    () =>
      classifiedIndex !== null ? resources[classifiedIndex] ?? null : null,
    [classifiedIndex, resources],
  );

  const clearIntervalRef = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onChangeModel = (index: number) => {
    clearIntervalRef();
    setSelectedIndex(index);
    setClassifiedIndex(null);
    setIsClassifying(false);
    setProgress(0);
  };

  const onClassify = () => {
    if (isClassifying) return;

    const durationMs = Math.max(120, selected.time);
    setIsClassifying(true);
    setProgress(0);
    setClassifiedIndex(null);

    const start = performance.now();
    clearIntervalRef();

    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const p = Math.min(1, (now - start) / durationMs);
      setProgress(p);
      if (p >= 1) {
        clearIntervalRef();
        setIsClassifying(false);
        setClassifiedIndex(selectedIndex);
      }
    }, 16);
  };

  const onSkipClassify = () => {
    clearIntervalRef();
    setProgress(1);
    setIsClassifying(false);
    setClassifiedIndex(selectedIndex);
  };

  return {
    selected,
    classified,
    selectedIndex,
    progress,
    isClassifying,
    onChangeModel,
    onClassify,
    onSkipClassify,
  };
}
