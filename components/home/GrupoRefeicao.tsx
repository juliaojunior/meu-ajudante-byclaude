"use client";

import { IcCheck } from "@/components/icons";
import CardDose from "@/components/home/CardDose";
import { useTextScale } from "@/contexts/TextScaleProvider";
import type { GroupMock } from "@/lib/types";

type Props = {
  group: GroupMock;
  onToggle?: (remedioId: string, hora: string) => void;
};

export default function GrupoRefeicao({ group: g, onToggle }: Props) {
  const s = useTextScale();
  const allDone = g.items.length > 0 && g.items.every((i) => i.tomado);
  const someDone = g.items.filter((i) => i.tomado).length;
  const plural = g.items.length === 1 ? "remédio" : "remédios";

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 12, padding: "0 2px",
        }}
      >
        <div
          style={{
            width: 38, height: 38, borderRadius: 19,
            background: g.acento + "18", color: g.acento,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <g.Icon size={20} stroke={2.2} />
        </div>

        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: Math.round(20 * s),
              fontWeight: 600, color: "#1C1917",
              letterSpacing: -0.3, display: "block", lineHeight: 1.1,
            }}
          >
            {g.label}
          </span>
          <div style={{ fontSize: Math.round(12 * s), color: "#57534E", marginTop: 2, fontWeight: 500 }}>
            {g.items.length} {plural}
            {someDone > 0 && !allDone && (
              <>
                {" "}·{" "}
                <span style={{ color: "#4D7C0F", fontWeight: 700 }}>
                  {someDone} tomado
                </span>
              </>
            )}
          </div>
        </div>

        {allDone && (
          <div
            aria-label="Todos tomados"
            style={{
              fontSize: 11, fontWeight: 800, color: "#4D7C0F",
              background: "#F1F8EA", padding: "5px 10px", borderRadius: 99,
              display: "flex", gap: 4, alignItems: "center",
              border: "1px solid #BEF264",
              textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0,
            }}
          >
            <IcCheck size={12} stroke={3.5} />
            Feito
          </div>
        )}
      </div>

      <div
        role="list"
        aria-label={`Remédios de ${g.label}`}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {g.items.map((m) => (
          <div key={`${m.remedioId}-${m.h}`} role="listitem">
            <CardDose
              dose={m}
              acento={g.acento}
              href={`/remedio?id=${m.remedioId}`}
              onToggle={onToggle ? () => onToggle(m.remedioId, m.h) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
