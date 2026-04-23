"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getRemedios,
  saveRemedio as storageSave,
  deleteRemedio as storageDelete,
  marcarTomada as storageMarcar,
  desmarcarTomada as storageDesmarcar,
} from "@/lib/storage";
import type { Remedio } from "@/lib/types";

export function useRemedios() {
  const [remedios, setRemedios] = useState<Remedio[]>([]);

  const reload = useCallback(() => setRemedios(getRemedios()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const salvar = useCallback(
    (r: Remedio) => { storageSave(r); reload(); },
    [reload]
  );

  const remover = useCallback(
    (id: string) => { storageDelete(id); reload(); },
    [reload]
  );

  const marcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageMarcar(remedioId, hora, data); reload();
    },
    [reload]
  );

  const desmarcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageDesmarcar(remedioId, hora, data); reload();
    },
    [reload]
  );

  return { remedios, salvar, remover, marcar, desmarcar };
}
