import type { Remedio } from "./types";

const KEY = "meu-ajudante";

export function getRemedios(): Remedio[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Remedio[]) : [];
  } catch {
    return [];
  }
}

export function getRemedio(id: string): Remedio | null {
  return getRemedios().find((r) => r.id === id) ?? null;
}

export function saveRemedio(remedio: Remedio): void {
  const lista = getRemedios();
  const idx = lista.findIndex((r) => r.id === remedio.id);
  if (idx >= 0) {
    lista[idx] = remedio;
  } else {
    lista.push(remedio);
  }
  localStorage.setItem(KEY, JSON.stringify(lista));
}

export function deleteRemedio(id: string): void {
  const lista = getRemedios().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(lista));
}

export function marcarTomada(remedioId: string, hora: string, data: string): void {
  const rem = getRemedio(remedioId);
  if (!rem) return;
  const jaExiste = rem.tomadas.some((t) => t.data === data && t.horario === hora);
  if (!jaExiste) {
    rem.tomadas.push({ data, horario: hora, tomadoEm: new Date().toISOString() });
    saveRemedio(rem);
  }
}

export function desmarcarTomada(remedioId: string, hora: string, data: string): void {
  const rem = getRemedio(remedioId);
  if (!rem) return;
  rem.tomadas = rem.tomadas.filter((t) => !(t.data === data && t.horario === hora));
  saveRemedio(rem);
}

export function novoId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
