"use client";

import { useState, useEffect } from "react";
import { horaAtual } from "@/lib/time";

export function useRelogio(): string {
  const [hora, setHora] = useState("");

  useEffect(() => {
    setHora(horaAtual());
    const id = setInterval(() => setHora(horaAtual()), 60_000);
    return () => clearInterval(id);
  }, []);

  return hora;
}
