import type { DoseMock } from "@/lib/types";

type Props = {
  doses: DoseMock[];
  streak: number;
};

export default function ProgressoDia({ doses, streak }: Props) {
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
          style={{ fontSize: 13, fontWeight: 700, color: "#57534E", letterSpacing: 0.3 }}
        >
          <span style={{ color: "#C2410C", fontWeight: 800 }}>{done}</span> de{" "}
          {doses.length} tomados hoje
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#57534E",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          sequência{" "}
          <strong style={{ color: "#1C1917" }}>{streak} dias</strong>
        </div>
      </div>

      {/* Barra segmentada */}
      <div style={{ display: "flex", gap: 5 }}>
        {doses.map((d) => (
          <div
            key={d.id}
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
