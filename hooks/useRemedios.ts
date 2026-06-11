"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getRemedios,
  saveRemedio as storageSave,
  deleteRemedio as storageDelete,
  marcarTomada as storageMarcar,
  desmarcarTomada as storageDesmarcar,
} from "@/lib/storage";
import {
  sincronizarAlarmes,
  consumirTomadasPendentes,
  suprimirAlarmeHoje,
  reativarAlarmeHoje,
} from "@/lib/alarmes-nativos";
import { dataHoje } from "@/lib/time";
import type { Remedio } from "@/lib/types";

export function useRemedios() {
  const [remedios, setRemedios] = useState<Remedio[]>([]);

  const reload = useCallback(() => setRemedios(getRemedios()), []);

  useEffect(() => {
    reload();

    // Tomadas confirmadas no botão "Já tomei" do despertador nativo
    async function importarTomadasNativas() {
      const pendentes = await consumirTomadasPendentes();
      if (pendentes.length === 0) return;
      for (const t of pendentes) {
        storageMarcar(t.remedioId, t.hora, t.data);
      }
      reload();
    }

    importarTomadasNativas();
    const onVisible = () => {
      if (document.visibilityState === "visible") importarTomadasNativas();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [reload]);

  const salvar = useCallback(
    (r: Remedio) => {
      storageSave(r);
      sincronizarAlarmes().catch(() => {});
      reload();
    },
    [reload]
  );

  const remover = useCallback(
    (id: string) => {
      storageDelete(id);
      sincronizarAlarmes().catch(() => {});
      reload();
    },
    [reload]
  );

  const marcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageMarcar(remedioId, hora, data);
      // Tomou antes do alarme tocar: não toca mais hoje
      if (data === dataHoje()) suprimirAlarmeHoje(remedioId, hora).catch(() => {});
      reload();
    },
    [reload]
  );

  const desmarcar = useCallback(
    (remedioId: string, hora: string, data: string) => {
      storageDesmarcar(remedioId, hora, data);
      if (data === dataHoje()) reativarAlarmeHoje(remedioId, hora).catch(() => {});
      reload();
    },
    [reload]
  );

  return { remedios, salvar, remover, marcar, desmarcar };
}
