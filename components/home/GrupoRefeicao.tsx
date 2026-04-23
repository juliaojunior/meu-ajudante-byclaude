import { IcCheck } from "@/components/icons";
import CardDose from "@/components/home/CardDose";
import type { GroupMock } from "@/lib/types";

type Props = { group: GroupMock };

export default function GrupoRefeicao({ group: g }: Props) {
  const allDone = g.items.length > 0 && g.items.every((i) => i.tomado);
  const someDone = g.items.filter((i) => i.tomado).length;
  const plural = g.items.length === 1 ? "remédio" : "remédios";

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Cabeçalho do grupo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          padding: "0 2px",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            background: g.acento + "18",
            color: g.acento,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <g.Icon size={20} stroke={2.2} />
        </div>

        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 600,
              color: "#1C1917",
              letterSpacing: -0.3,
              display: "block",
              lineHeight: 1.1,
            }}
          >
            {g.label}
          </span>
          <div
            style={{
              fontSize: 12,
              color: "#57534E",
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {g.items.length} {plural}
            {someDone > 0 && !allDone && (
              <>
                {" "}
                ·{" "}
                <span style={{ color: "#4D7C0F", fontWeight: 700 }}>
                  {someDone} tomado
                </span>
              </>
            )}
          </div>
        </div>

        {allDone && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#4D7C0F",
              background: "#F1F8EA",
              padding: "5px 10px",
              borderRadius: 99,
              display: "flex",
              gap: 4,
              alignItems: "center",
              border: "1px solid #BEF264",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              flexShrink: 0,
            }}
          >
            <IcCheck size={12} stroke={3.5} />
            Feito
          </div>
        )}
      </div>

      {/* Cards de dose */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {g.items.map((m) => (
          <CardDose key={m.id} dose={m} acento={g.acento} href={`/remedio/${m.id}`} />
        ))}
      </div>
    </div>
  );
}
