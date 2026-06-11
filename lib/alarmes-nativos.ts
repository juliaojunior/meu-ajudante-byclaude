import { Capacitor, registerPlugin } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getRemedios } from "./storage";

export type TomadaPendente = { remedioId: string; hora: string; data: string };

type AlarmeNativo = {
  id: number;
  remedioId: string;
  nome: string;
  dose: string;
  hora: string;
  refeicao: string;
};

interface AlarmePluginNativo {
  sincronizar(opts: { alarmes: AlarmeNativo[] }): Promise<void>;
  cancelarTodos(): Promise<void>;
  consumirTomadasPendentes(): Promise<{ tomadas: TomadaPendente[] }>;
  suprimirHoje(opts: { id: number }): Promise<void>;
  dessuprimirHoje(opts: { id: number }): Promise<void>;
}

const Alarme = registerPlugin<AlarmePluginNativo>("Alarme");

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
  // POST_NOTIFICATIONS: necessária para a notificação do despertador
  const { display } = await LocalNotifications.requestPermissions();
  return display === "granted";
}

/** Limpa notificações repetitivas do sistema antigo (LocalNotifications). */
async function limparSistemaAntigo(): Promise<void> {
  const { notifications } = await LocalNotifications.getPending().catch(
    () => ({ notifications: [] as { id: number }[] })
  );
  if (notifications.length > 0) {
    await LocalNotifications.cancel({
      notifications: notifications.map((n) => ({ id: n.id })),
    }).catch(() => {});
  }
}

/**
 * Sincronização total: envia a lista completa de alarmes ativos para o
 * nativo, que cancela tudo e reagenda do zero. Chamar após qualquer
 * mudança em remédios (criar, editar, remover, ligar/desligar alarme).
 */
export async function sincronizarAlarmes(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await limparSistemaAntigo();

  const alarmes: AlarmeNativo[] = [];
  for (const rem of getRemedios()) {
    if (!rem.alarmeAtivo) continue;
    for (const h of rem.horarios) {
      alarmes.push({
        id: notifId(rem.id, h.hora),
        remedioId: rem.id,
        nome: rem.apelido || rem.nome,
        dose: rem.dose,
        hora: h.hora,
        refeicao: h.refeicao,
      });
    }
  }
  await Alarme.sincronizar({ alarmes });
}

/** Tomadas marcadas pelo botão "Já tomei" da tela nativa do despertador. */
export async function consumirTomadasPendentes(): Promise<TomadaPendente[]> {
  if (!Capacitor.isNativePlatform()) return [];
  const { tomadas } = await Alarme.consumirTomadasPendentes().catch(() => ({
    tomadas: [] as TomadaPendente[],
  }));
  return tomadas;
}

/** Já tomou antes do alarme tocar: suprime o disparo de hoje. */
export async function suprimirAlarmeHoje(remedioId: string, hora: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Alarme.suprimirHoje({ id: notifId(remedioId, hora) }).catch(() => {});
}

/** Desmarcou a tomada: o alarme de hoje volta a valer. */
export async function reativarAlarmeHoje(remedioId: string, hora: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Alarme.dessuprimirHoje({ id: notifId(remedioId, hora) }).catch(() => {});
}
