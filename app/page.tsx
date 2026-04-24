"use client";

import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import HeroProximo from "@/components/home/HeroProximo";
import ProgressoDia from "@/components/home/ProgressoDia";
import GrupoRefeicao from "@/components/home/GrupoRefeicao";
import { IcCalendar, IcPlus } from "@/components/icons";
import { IcCoffee, IcUtensils, IcSun, IcMoon } from "@/components/icons";
import { useRemedios } from "@/hooks/useRemedios";
import { useRelogio } from "@/hooks/useRelogio";
import { useAlarme } from "@/hooks/useAlarme";
import { dataHoje, saudacao, diaFormatado, tempoRestante } from "@/lib/time";
import { calcularStreakGlobal } from "@/lib/streak";
import { useTextScale } from "@/contexts/TextScaleProvider";
import { toggleTextoGrande } from "@/lib/preferencias";
import type { DoseMock, GroupMock, Periodo } from "@/lib/types";

const GRUPOS_CONFIG: {
  key: Periodo;
  label: string;
  acento: string;
  Icon: (p: { size?: number; stroke?: number }) => React.ReactNode;
}[] = [
  { key: "manha",  label: "Café da manhã",  acento: "#D97706", Icon: IcCoffee   },
  { key: "almoco", label: "Almoço",          acento: "#C2410C", Icon: IcUtensils },
  { key: "tarde",  label: "Tarde",           acento: "#B45309", Icon: IcSun      },
  { key: "noite",  label: "Jantar & noite",  acento: "#6D8B47", Icon: IcMoon     },
];

export default function Home() {
  const { remedios, marcar, desmarcar } = useRemedios();
  const horaDisplay = useRelogio();
  useAlarme();
  const s = useTextScale();
  const grande = s > 1;
  const hoje = dataHoje();

  const doses: DoseMock[] = [];
  let counter = 0;
  for (const rem of remedios) {
    for (const h of rem.horarios) {
      const tomado = rem.tomadas.some((t) => t.data === hoje && t.horario === h.hora);
      doses.push({
        id: counter++,
        remedioId: rem.id,
        nome: rem.apelido || rem.nome,
        dose: rem.dose,
        h: h.hora,
        periodo: h.periodo,
        tomado,
        kind: rem.kind,
        quando: h.refeicao,
      });
    }
  }
  doses.sort((a, b) => a.h.localeCompare(b.h));

  const groups: GroupMock[] = GRUPOS_CONFIG.map((cfg) => ({
    key: cfg.key,
    label: cfg.label,
    h: doses.find((d) => d.periodo === cfg.key)?.h ?? "",
    acento: cfg.acento,
    Icon: cfg.Icon,
    items: doses.filter((d) => d.periodo === cfg.key),
  })).filter((g) => g.items.length > 0);

  const nextDose = doses.find((d) => !d.tomado);
  const proxGrupo = nextDose
    ? groups.find((g) => g.items.some((i) => i.remedioId === nextDose.remedioId && i.h === nextDose.h))
    : undefined;
  const streak = calcularStreakGlobal(remedios);

  function handleToggle(remedioId: string, hora: string) {
    const dose = doses.find((d) => d.remedioId === remedioId && d.h === hora);
    if (!dose) return;
    if (dose.tomado) {
      desmarcar(remedioId, hora, hoje);
    } else {
      marcar(remedioId, hora, hoje);
    }
  }

  const tudoTomado = doses.length > 0 && doses.every((d) => d.tomado);

  return (
    <PhoneShell>
      <StatusBar time={horaDisplay || "—"} />

      <div style={{ padding: "10px 24px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#57534E",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {diaFormatado()}
            </div>
            <h1 style={{ margin: "10px 0 0", lineHeight: 0.98, letterSpacing: -1.2 }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: Math.round(38 * s),
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#C2410C",
                  display: "block",
                }}
              >
                {saudacao()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: Math.round(38 * s),
                  fontWeight: 600,
                  color: "#1C1917",
                  display: "block",
                  marginTop: 2,
                }}
              >
                {remedios.length > 0 ? "Seus remédios." : "Bem-vindo."}
              </span>
            </h1>
          </div>
          <button
            onClick={toggleTextoGrande}
            aria-label={grande ? "Diminuir texto" : "Aumentar texto"}
            aria-pressed={grande}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: grande ? "#FFF1E7" : "#FFFBF3",
              border: `1.5px solid ${grande ? "#C2410C" : "#EADFCE"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: grande ? "#C2410C" : "#1C1917",
              cursor: "pointer",
              flexShrink: 0,
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Aa
          </button>
        </div>
      </div>

      {nextDose && proxGrupo && (
        <HeroProximo
          dose={nextDose}
          labelGrupo={proxGrupo.label}
          tempoRestante={tempoRestante(nextDose.h)}
        />
      )}

      {doses.length > 0 && <ProgressoDia doses={doses} streak={streak} />}

      <div
        role="main"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {remedios.length === 0 ? (
          /* Estado vazio */
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: "#FFF1E7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                marginBottom: 4,
              }}
            >
              💊
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 600,
                color: "#1C1917",
                letterSpacing: -0.3,
              }}
            >
              Nenhum remédio ainda
            </span>
            <p style={{ fontSize: 14, color: "#57534E", margin: 0, lineHeight: 1.5 }}>
              Toque em "Adicionar remédio" abaixo para cadastrar o primeiro.
            </p>
          </div>
        ) : (
          <>
            {groups.map((g) => (
              <GrupoRefeicao key={g.key} group={g} onToggle={handleToggle} />
            ))}

            {tudoTomado && (
              <div
                style={{
                  marginTop: 6,
                  padding: "16px 18px",
                  borderRadius: 20,
                  border: "1.5px dashed #D6C6AA",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#57534E",
                    fontStyle: "italic",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  Tudo tomado hoje. Muito bem! 🌟
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px 28px",
          background:
            "linear-gradient(to top, #FBF6EE 60%, rgba(251,246,238,0.93) 85%, transparent)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <button
          aria-label="Ver calendário"
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            border: "1px solid #EADFCE",
            background: "#FFFBF3",
            color: "#1C1917",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            pointerEvents: "auto",
          }}
        >
          <IcCalendar size={20} stroke={2.2} />
        </button>
        <Link
          href="/adicionar"
          style={{
            flex: 1,
            height: 64,
            borderRadius: 32,
            background: "#C2410C",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 10px 24px rgba(194,65,12,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            pointerEvents: "auto",
            textDecoration: "none",
          }}
        >
          <IcPlus size={24} stroke={2.8} />
          <span>Adicionar remédio</span>
        </Link>
      </div>
    </PhoneShell>
  );
}
