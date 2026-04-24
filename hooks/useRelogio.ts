"use client";

import { useState, useEffect } from "react";
import { horaAtual } from "@/lib/time";

export function useRelogio(): string {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const atualizar = () => setHora(horaAtual());
    atualizar();
    const id = setInterval(atualizar, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") atualizar();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return hora;
}
