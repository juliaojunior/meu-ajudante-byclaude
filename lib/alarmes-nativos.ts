import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getRemedios } from "./storage";
import type { Remedio } from "./types";

function notifId(remedioId: string, hora: string): number {
  const str = `${remedioId}|${hora}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2_147_483_647;
}

export async function pedirPermissaoNativa(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const { display } = await LocalNotifications.requestPermissions();
  return display === "granted";
}

export async function reagendarAlarmes(remedio: Remedio): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const idsAntigos = remedio.horarios.map((h) => ({ id: notifId(remedio.id, h.hora) }));
  if (idsAntigos.length > 0) {
    await LocalNotifications.cancel({ notifications: idsAntigos }).catch(() => {});
  }

  if (!remedio.alarmeAtivo) return;

  const notifications = remedio.horarios.map((h) => {
    const [hour, minute] = h.hora.split(":").map(Number);
    return {
      id: notifId(remedio.id, h.hora),
      title: `Hora do ${remedio.apelido || remedio.nome}`,
      body: `${remedio.dose} — ${h.refeicao}`,
      schedule: {
        on: { hour, minute },
        repeats: true,
        allowWhileIdle: true,
      },
    };
  });

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

export async function cancelarAlarmes(remedio: Remedio): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const ids = remedio.horarios.map((h) => ({ id: notifId(remedio.id, h.hora) }));
  if (ids.length > 0) {
    await LocalNotifications.cancel({ notifications: ids }).catch(() => {});
  }
}

export async function reagendarTodosAlarmes(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const remedios = getRemedios();
  for (const rem of remedios) {
    await reagendarAlarmes(rem);
  }
}
