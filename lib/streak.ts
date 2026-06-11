import type { Remedio } from "./types";

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function calcularStreak(remedio: Remedio): number {
  if (remedio.horarios.length === 0) return 0;
  let streak = 0;
  const hoje = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const dataStr = toLocalDateStr(d);
    const tomadasDia = remedio.tomadas.filter((t) => t.data === dataStr);
    const todas = remedio.horarios.every((h) =>
      tomadasDia.some((t) => t.horario === h.hora)
    );
    if (todas) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function calcularStreakGlobal(remedios: Remedio[]): number {
  if (remedios.length === 0) return 0;
  return Math.min(...remedios.map(calcularStreak));
}
