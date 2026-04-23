"use client";

import { useState, useEffect } from "react";
import { getFoto } from "@/lib/fotos";

export function useFoto(fotoId?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fotoId) { setUrl(null); return; }
    let objectUrl: string | null = null;
    getFoto(fotoId).then((u) => {
      objectUrl = u;
      setUrl(u);
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fotoId]);

  return url;
}
