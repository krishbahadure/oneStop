import { useState, useEffect } from "react";

export function useComparison() {
  const [compared, setCompared] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("onestop_comparison") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("onestop_comparison", JSON.stringify(compared));
  }, [compared]);

  const addToComparison = (collegeId) => {
    if (compared.length >= 3) return false;
    if (compared.includes(collegeId)) return false;
    setCompared((prev) => [...prev, collegeId]);
    return true;
  };

  const removeFromComparison = (collegeId) => {
    setCompared((prev) => prev.filter((id) => id !== collegeId));
  };

  const isInComparison = (collegeId) => compared.includes(collegeId);

  const clearComparison = () => setCompared([]);

  return { compared, addToComparison, removeFromComparison, isInComparison, clearComparison };
}
