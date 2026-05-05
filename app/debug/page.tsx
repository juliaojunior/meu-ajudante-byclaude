"use client";

import { useState } from "react";
import { ensurePushSubscription, syncSchedules, getUserId } from "@/lib/push-subscribe";
import { getRemedios } from "@/lib/storage";

export default function DebugPage() {
  const [log, setLog] = useState<string[]>([]);

  function add(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  async function testar() {
    setLog([]);

    add("=== DIAGNÓSTICO DE PUSH ===");
    add(`userId: ${getUserId()}`);

    const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    add(`VAPID key: ${vapid ? vapid.slice(0, 12) + "..." : "❌ NÃO ENCONTRADA"}`);

    add(`serviceWorker suportado: ${"serviceWorker" in navigator}`);
    add(`PushManager suportado: ${"PushManager" in window}`);
    add(`Permissão atual: ${Notification.permission}`);

    add("Chamando ensurePushSubscription...");
    const result = await ensurePushSubscription();
    add(`Resultado: ${JSON.stringify(result.ok ? { ok: true } : result)}`);

    if (result.ok) {
      add(`Endpoint: ${result.subscription.endpoint.slice(0, 40)}...`);
      add("Chamando syncSchedules...");
      const remedios = getRemedios();
      add(`Remédios encontrados: ${remedios.length}`);
      const sync = await syncSchedules(remedios);
      add(`syncSchedules: ${JSON.stringify(sync)}`);
    }

    add("=== FIM ===");
  }

  return (
    <div style={{ padding: 20, fontFamily: "monospace", fontSize: 14 }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>Debug Push</h1>
      <button
        onClick={testar}
        style={{
          padding: "12px 24px",
          background: "#C2410C",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Executar diagnóstico
      </button>
      <div style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {log.length === 0 ? "Toque no botão acima..." : log.join("\n")}
      </div>
    </div>
  );
}
