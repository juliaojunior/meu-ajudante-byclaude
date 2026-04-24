import type { Periodo } from "./types";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dataHoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function horaAtual(): string {
  const n = new Date();
  return `${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

export function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia,";
  if (h < 18) return "Boa tarde,";
  return "Boa noite,";
}

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function diaFormatado(): string {
  const d = new Date();
  return `${DIAS[d.getDay()]} · ${d.getDate()} ${MESES[d.getMonth()]}`;
}

export function tempoRestante(hora: string): string {
  const [hh, mm] = hora.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diffMin = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diffMin < 60) return `em ${diffMin}min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m > 0 ? `em ${h}h${m}min` : `em ${h}h`;
}

export function periodoDeHora(hora: string): Periodo {
  const hh = parseInt(hora.split(":")[0], 10);
  if (hh >= 5 && hh < 12) return "manha";
  if (hh >= 12 && hh < 15) return "almoco";
  if (hh >= 15 && hh < 18) return "tarde";
  return "noite";
}
