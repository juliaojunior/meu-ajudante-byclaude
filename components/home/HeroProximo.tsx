"use client";

import { MedIcon } from "@/components/home/MedIcon";
import { useTextScale } from "@/contexts/TextScaleProvider";
import type { DoseMock } from "@/lib/types";

type Props = {
  dose: DoseMock;
  labelGrupo: string;
  tempoRestante: string;
};

export default function HeroProximo({ dose, labelGrupo, tempoRestante }: Props) {
  const s = useTextScale();

  return (
    <div
      className="animate-fade-up"
      style={{
        margin: "0 20px 18px",
        background: "linear-gradient(145deg, #FFF2E6 0%, #FDF5E7 100%)",
        borderRadius: 28,
        border: "1px solid #EADFCE",
        padding: "18px 20px 20px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: 80,
          background: "rgba(194,65,12,0.06)", pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: -30, right: 30,
          width: 80, height: 80, borderRadius: 40,
          background: "rgba(180,83,9,0.08)", pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, fontWeight: 800, color: "#C2410C",
            textTransform: "uppercase", letterSpacing: 2,
          }}
        >
          <div
            className="dot-pulse"
            style={{
              width: 6, height: 6, borderRadius: 3,
              background: "#C2410C",
              boxShadow: "0 0 0 4px rgba(194,65,12,0.18)",
            }}
          />
          Próximo · {tempoRestante}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 20,
              background: "#fff", border: "1px solid #EADFCE",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
            }}
          >
            <MedIcon kind={dose.kind} size={48} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: Math.round(28 * s),
                fontWeight: 600, color: "#1C1917",
                letterSpacing: -0.6, lineHeight: 1, display: "block",
              }}
            >
              {dose.nome}
            </span>
            <div style={{ fontSize: Math.round(13 * s), color: "#57534E", marginTop: 4, fontWeight: 500 }}>
              {dose.dose}
            </div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: Math.round(32 * s),
                fontWeight: 600, color: "#C2410C",
                letterSpacing: -1, fontVariantNumeric: "tabular-nums",
                display: "block", lineHeight: 1,
              }}
            >
              {dose.h}
            </span>
            <div style={{ fontSize: 11, color: "#57534E", marginTop: 2, fontWeight: 600 }}>
              {labelGrupo.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
