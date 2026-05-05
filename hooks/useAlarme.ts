"use client";

import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { getRemedios } from "@/lib/storage";
import { dataHoje, horaAtual } from "@/lib/time";
import { mostrarNotificacao, vibrar, tocarSom } from "@/lib/notificacoes";
import { pedirPermissaoNativa, reagendarTodosAlarmes } from "@/lib/alarmes-nativos";

export function useAlarme() {
  const disparados = useRef<Set<string>>(new Set());

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      pedirPermissaoNativa().then(() => reagendarTodosAlarmes()).catch(() => {});
    }

    function verificar() {
      const agora = horaAtual();
      const hoje = dataHoje();
      const remedios = getRemedios();

      for (const rem of remedios) {
        if (!rem.alarmeAtivo) continue;
        for (const h of rem.horarios) {
          if (h.hora !== agora) continue;
          const chave = `${rem.id}|${h.hora}|${hoje}`;
          if (disparados.current.has(chave)) continue;
          const jaTomou = rem.tomadas.some(
            (t) => t.data === hoje && t.horario === h.hora
          );
          if (jaTomou) continue;
          disparados.current.add(chave);
          if (!isNative) {
            mostrarNotificacao(`Hora do ${rem.nome}`, {
              body: `${rem.dose} — ${h.refeicao}`,
              tag: chave,
              requireInteraction: true,
            } as NotificationOptions);
          }
          vibrar();
          tocarSom();
        }
      }
    }

    verificar();
    const id = setInterval(verificar, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") verificar();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
