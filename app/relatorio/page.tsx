"use client";

import { useMemo } from "react";
import PhoneShell from "@/components/ui/PhoneShell";
import PageHeader from "@/components/ui/PageHeader";
import { IcPill } from "@/components/icons";
import { calcularStreak, calcularStreakGlobal } from "@/lib/streak";
import { useRemedios } from "@/hooks/useRemedios";
import { dataHoje } from "@/lib/time";
import type { Remedio } from "@/lib/types";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type DayStatus =
  | "future"
  | "today-ok"
  | "today-partial"
  | "full"
  | "partial"
  | "missed"
  | "empty";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function calcDayStatus(
  dateStr: string,
  hoje: string,
  remedios: Remedio[]
): DayStatus {
  const totalExpected = remedios.reduce((s, r) => s + r.horarios.length, 0);
  if (totalExpected === 0) return "empty";

  const totalTaken = remedios.reduce(
    (s, r) => s + r.tomadas.filter((t) => t.data === dateStr).length,
    0
  );

  if (dateStr > hoje) return "future";
  if (dateStr === hoje) {
    return totalTaken >= totalExpected ? "today-ok" : "today-partial";
  }
  if (totalTaken >= totalExpected) return "full";
  if (totalTaken > 0) return "partial";
  return "missed";
}

const STATUS_STYLE: Record<
  DayStatus,
  { bg: string; color: string; border: string }
> = {
  future:          { bg: "transparent", color: "#C4B8A8", border: "transparent" },
  "today-ok":      { bg: "#4D7C0F",     color: "#fff",    border: "#4D7C0F"     },
  "today-partial": { bg: "#FFF0E5",     color: "#C2410C", border: "#C2410C"     },
  full:            { bg: "#F1F8EA",     color: "#4D7C0F", border: "#BEF264"     },
  partial:         { bg: "#FEF9C3",     color: "#854D0E", border: "#FDE68A"     },
  missed:          { bg: "#FEF2F2",     color: "#B91C1C", border: "#FECACA"     },
  empty:           { bg: "transparent", color: "#D6C6AA", border: "transparent" },
};

export default function RelatorioPage() {
  const { remedios } = useRemedios();
  const hoje = dataHoje();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const streak = calcularStreakGlobal(remedios);

  const { monthCompliance, totalEver } = useMemo(() => {
    const totalPerDay = remedios.reduce((s, r) => s + r.horarios.length, 0);
    let expectedPast = 0;
    let takenPast = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = toDateStr(year, month, d);
      if (ds > hoje) break;
      expectedPast += totalPerDay;
      takenPast += remedios.reduce(
        (s, r) => s + r.tomadas.filter((t) => t.data === ds).length,
        0
      );
    }

    return {
      monthCompliance:
        expectedPast > 0 ? Math.round((takenPast / expectedPast) * 100) : 0,
      totalEver: remedios.reduce((s, r) => s + r.tomadas.length, 0),
    };
  }, [remedios, hoje, year, month, daysInMonth]);

  return (
    <PhoneShell>
      <PageHeader backHref="/" label="Histórico" title="Relatório" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 32px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Sequência"
            value={`${streak}d`}
            sub={streak > 0 ? "🔥 seguidos" : "sem série"}
            accent="#C2410C"
          />
          <StatCard
            label="Este mês"
            value={`${monthCompliance}%`}
            sub="conformidade"
            accent={monthCompliance >= 80 ? "#4D7C0F" : monthCompliance >= 50 ? "#854D0E" : "#B91C1C"}
          />
          <StatCard
            label="Total"
            value={String(totalEver)}
            sub={totalEver === 1 ? "dose" : "doses"}
            accent="#6D8B47"
          />
        </div>

        {/* Calendário */}
        <div
          style={{
            background: "#FFFBF3",
            borderRadius: 20,
            border: "1px solid #EADFCE",
            padding: "16px 14px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            {MESES[month]} {year}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 6,
            }}
          >
            {DIAS_SEMANA.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#A8A29E",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
            }}
          >
            {cells.map((day, i) => {
              if (day === null) return <div key={`pad-${i}`} />;
              const dateStr = toDateStr(year, month, day);
              const isToday = dateStr === hoje;
              const status = calcDayStatus(dateStr, hoje, remedios);
              const s = STATUS_STYLE[status];
              return (
                <div
                  key={day}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    background: s.bg,
                    border: `1.5px solid ${s.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isToday ? 800 : 500,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 14px",
              justifyContent: "center",
            }}
          >
            <LegendItem color="#F1F8EA" border="#BEF264" text="Completo" />
            <LegendItem color="#FEF9C3" border="#FDE68A" text="Parcial" />
            <LegendItem color="#FEF2F2" border="#FECACA" text="Nenhuma dose" />
          </div>
        </div>

        {/* Por remédio */}
        {remedios.length > 0 ? (
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                fontWeight: 600,
                color: "#1C1917",
                marginBottom: 10,
              }}
            >
              Por remédio
            </div>
            {remedios.map((r) => {
              const s = calcularStreak(r);
              const totalPerDay = r.horarios.length;
              let exp = 0;
              let tak = 0;
              for (let d = 1; d <= daysInMonth; d++) {
                const ds = toDateStr(year, month, d);
                if (ds > hoje) break;
                exp += totalPerDay;
                tak += r.tomadas.filter((t) => t.data === ds).length;
              }
              const pct = exp > 0 ? Math.round((tak / exp) * 100) : 0;
              const pctColor =
                pct >= 80 ? "#4D7C0F" : pct >= 50 ? "#854D0E" : "#B91C1C";

              return (
                <div
                  key={r.id}
                  style={{
                    background: "#FFFBF3",
                    borderRadius: 16,
                    border: "1px solid #EADFCE",
                    padding: "14px 16px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "#FFF0E5",
                      color: "#C2410C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #EADFCE",
                      flexShrink: 0,
                    }}
                  >
                    <IcPill size={20} stroke={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1C1917",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.apelido || r.nome}
                    </div>
                    <div style={{ fontSize: 12, color: "#57534E", marginTop: 2 }}>
                      {r.dose}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: "var(--font-serif)",
                        color: pctColor,
                      }}
                    >
                      {pct}%
                    </div>
                    <div style={{ fontSize: 11, color: "#57534E", marginTop: 2 }}>
                      {s > 0 ? `${s}d 🔥` : "sem série"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#A8A29E",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 18,
                marginBottom: 8,
                color: "#78716C",
              }}
            >
              Nenhum remédio ainda
            </div>
            <div style={{ fontSize: 14 }}>
              Adicione remédios para ver seu histórico aqui.
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#FFFBF3",
        borderRadius: 16,
        border: "1px solid #EADFCE",
        padding: "12px 8px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#57534E",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#A8A29E", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function LegendItem({
  color,
  border,
  text,
}: {
  color: string;
  border: string;
  text: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: color,
          border: `1px solid ${border}`,
        }}
      />
      <span style={{ fontSize: 11, color: "#57534E" }}>{text}</span>
    </div>
  );
}
