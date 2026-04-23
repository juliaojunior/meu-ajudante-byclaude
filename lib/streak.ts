import type { Remedio } from "./types";

export function calcularStreak(remedio: Remedio): number {
  if (remedio.horarios.length === 0) return 0;
  let streak = 0;
  const hoje = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const dataStr = d.toISOString().slice(0, 10);
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
