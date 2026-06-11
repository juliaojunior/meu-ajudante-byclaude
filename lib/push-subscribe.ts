import { Capacitor } from "@capacitor/core";
import { pedirPermissao } from "./notificacoes";
import type { Remedio } from "./types";

const USER_ID_KEY = "meu-ajudante-user-id";

type Schedule = {
  remedioId: string;
  nome: string;
  dose: string;
  horario: string;
  refeicao: string;
};

type EnsureResult =
  | { ok: true; subscription: PushSubscription }
  | { ok: false; reason: string };

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export async function ensurePushSubscription(): Promise<EnsureResult> {
  if (typeof window === "undefined") {
    return { ok: false, reason: "unsupported" };
  }
  // No nativo o alarme é do sistema (AlarmManager); web push é só da versão web.
  // Sem este guard, navigator.serviceWorker.ready ficaria pendente para sempre.
  if (Capacitor.isNativePlatform()) {
    return { ok: false, reason: "native" };
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "unsupported" };
  }

  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapid) {
    return { ok: false, reason: "no-vapid" };
  }

  const permitido = await pedirPermissao();
  if (!permitido) {
    return { ok: false, reason: "permission-denied" };
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid),
      });
    }
    return { ok: true, subscription: sub };
  } catch (err) {
    console.error("ensurePushSubscription failed:", err);
    return { ok: false, reason: "error" };
  }
}

export async function syncSchedules(
  remedios: Remedio[],
): Promise<{ ok: boolean; reason?: string }> {
  const ensured = await ensurePushSubscription();
  if (!ensured.ok) {
    return { ok: false, reason: ensured.reason };
  }

  const schedules: Schedule[] = [];
  for (const r of remedios) {
    if (!r.alarmeAtivo) continue;
    for (const h of r.horarios) {
      schedules.push({
        remedioId: r.id,
        nome: r.apelido || r.nome,
        dose: r.dose,
        horario: h.hora,
        refeicao: h.refeicao,
      });
    }
  }

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: getUserId(),
        subscription: ensured.subscription.toJSON(),
        schedules,
      }),
    });
    if (!res.ok) {
      return { ok: false, reason: "network" };
    }
    return { ok: true };
  } catch (err) {
    console.error("syncSchedules failed:", err);
    return { ok: false, reason: "network" };
  }
}

export async function unsubscribePush(): Promise<void> {
  if (Capacitor.isNativePlatform()) return;
  try {
    await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUserId() }),
    });
  } catch (err) {
    console.error("unsubscribePush server call failed:", err);
  }

  try {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
    }
  } catch (err) {
    console.error("unsubscribePush browser call failed:", err);
  }
}
