"use client";

import { useTextScale } from "@/contexts/TextScaleProvider";
import type { DoseMock } from "@/lib/types";

type Props = {
  doses: DoseMock[];
  streak: number;
};

export default function ProgressoDia({ doses, streak }: Props) {
  const s = useTextScale();
  const done = doses.filter((d) => d.tomado).length;

  return (
    <div style={{ margin: "0 20px 16px", padding: "0 4px", flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ fontSize: Math.round(13 * s), fontWeight: 700, color: "#57534E", letterSpacing: 0.3 }}
        >
          <span style={{ color: "#C2410C", fontWeight: 800 }}>{done}</span> de{" "}
          {doses.length} tomados hoje
        </div>
        {streak > 0 && (
          <div style={{ fontSize: Math.round(12 * s), color: "#57534E", fontVariantNumeric: "tabular-nums" }}>
            sequência{" "}
            <strong style={{ color: "#1C1917" }}>{streak} dias</strong>
          </div>
        )}
      </div>

      {/* Barra segmentada */}
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={doses.length}
        aria-label={`${done} de ${doses.length} remédios tomados`}
        style={{ display: "flex", gap: 5 }}
      >
        {doses.map((d) => (
          <div
            key={`${d.remedioId}-${d.h}`}
            className="progress-seg"
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: d.tomado ? "#4D7C0F" : "#EADFCE",
            }}
          />
        ))}
      </div>
    </div>
  );
}
