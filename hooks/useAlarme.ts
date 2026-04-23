"use client";

import { useEffect, useRef } from "react";
import { getRemedios } from "@/lib/storage";
import { dataHoje, horaAtual } from "@/lib/time";
import {
  pedirPermissao,
  mostrarNotificacao,
  vibrar,
  tocarSom,
} from "@/lib/notificacoes";

export function useAlarme() {
  const disparados = useRef<Set<string>>(new Set());

  useEffect(() => {
    pedirPermissao();

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
          mostrarNotificacao(`Hora do ${rem.nome}`, {
            body: `${rem.dose} — ${h.refeicao}`,
            tag: chave,
            requireInteraction: true,
          } as NotificationOptions);
          vibrar();
          tocarSom();
        }
      }
    }

    verificar();
    const id = setInterval(verificar, 60_000);
    return () => clearInterval(id);
  }, []);
}
