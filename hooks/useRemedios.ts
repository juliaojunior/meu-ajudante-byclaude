"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getRemedios,
  getRemedio,
  saveRemedio as storageSave,
  deleteRemedio as storageDelete,
  marcarTomada as storageMarcar,
  desmarcarTomada as storageDesmarcar,
} from "@/lib/storage";
import { reagendarAlarmes, cancelarAlarmes } from "@/lib/alarmes-nativos";
import type { Remedio } from "@/lib/types";

export function useRemedios() {
  const [remedios, setRemedios] = useState<Remedio[]>([]);

  const reload = useCallback(() => setRemedios(getRemedios()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const salvar = useCallback(
    (r: Remedio) => {
      storageSave(r);
      reagendarAlarmes(r).catch(() => {});
      reload();
    },
    [reload]
  );

  const remover = useCallback(
    (id: string) => {
      const rem = getRemedio(id);
      if (rem) cancelarAlarmes(rem).catch(() => {});
      storageDelete(id);
      reload();
    },
    [reload]
  );

  const marcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageMarcar(remedioId, hora, data);
      reload();
    },
    [reload]
  );

  const desmarcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageDesmarcar(remedioId, hora, data);
      reload();
    },
    [reload]
  );

  return { remedios, salvar, remover, marcar, desmarcar };
}
