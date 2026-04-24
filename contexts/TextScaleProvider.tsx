"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getPreferencias } from "@/lib/preferencias";

const TextScaleContext = createContext(1);

export function useTextScale() {
  return useContext(TextScaleContext);
}

export default function TextScaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const apply = () =>
      setScale(getPreferencias().textoGrande ? 1.18 : 1);
    apply();
    window.addEventListener("preferencias-changed", apply);
    return () => window.removeEventListener("preferencias-changed", apply);
  }, []);

  return (
    <TextScaleContext.Provider value={scale}>
      {children}
    </TextScaleContext.Provider>
  );
}
