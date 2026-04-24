"use client";

import Link from "next/link";
import { IcCheck } from "@/components/icons";
import { MedIcon } from "@/components/home/MedIcon";
import { useTextScale } from "@/contexts/TextScaleProvider";
import type { DoseMock } from "@/lib/types";

type Props = {
  dose: DoseMock;
  acento: string;
  href?: string;
  onToggle?: () => void;
};

export default function CardDose({ dose: m, acento, href, onToggle }: Props) {
  const s = useTextScale();

  const content = (
    <>
      <div
        style={{
          position: "absolute", left: 0, top: 16, bottom: 16,
          width: 3, borderRadius: 2,
          background: m.tomado ? "#4D7C0F" : acento, opacity: 0.7,
        }}
      />
      <div
        style={{
          width: 52, height: 52, borderRadius: 16,
          background: m.tomado ? "#FFFFFF" : "#FFF8EE",
          border: `1px solid ${m.tomado ? "#E5DCC7" : "#EADFCE"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, filter: m.tomado ? "saturate(0.5)" : "none",
        }}
      >
        <MedIcon kind={m.kind} size={36} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: Math.round(19 * s),
            fontWeight: 600, letterSpacing: -0.2, display: "block",
            color: m.tomado ? "#57534E" : "#1C1917",
            textDecoration: m.tomado ? "line-through" : "none",
            textDecorationColor: "#A8A29E", textDecorationThickness: 1.5,
          }}
        >
          {m.nome}
        </span>
        <div
          style={{
            fontSize: Math.round(12.5 * s),
            color: "#57534E", marginTop: 2,
            display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 600 }}>{m.dose}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ fontStyle: "italic" }}>{m.quando}</span>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="animate-scale-in"
      style={{
        background: m.tomado ? "#F8F5EE" : "#FFFBF3",
        border: `1px solid ${m.tomado ? "#E5DCC7" : "#EADFCE"}`,
        borderRadius: 20, display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {href ? (
        <Link
          href={href}
          aria-label={`Ver detalhes de ${m.nome}`}
          style={{
            flex: 1, padding: "14px 0 14px 16px",
            display: "flex", alignItems: "center", gap: 14,
            textDecoration: "none", color: "inherit", minWidth: 0,
          }}
        >
          {content}
        </Link>
      ) : (
        <div
          style={{
            flex: 1, padding: "14px 0 14px 16px",
            display: "flex", alignItems: "center", gap: 14, minWidth: 0,
          }}
        >
          {content}
        </div>
      )}

      <div style={{ padding: "0 14px 0 0", flexShrink: 0 }}>
        <button
          onClick={onToggle}
          className="check-btn"
          aria-label={m.tomado ? `Desmarcar ${m.nome}` : `Marcar ${m.nome} como tomado`}
          aria-pressed={m.tomado}
          style={{
            width: 54, height: 54, borderRadius: 16, border: "none",
            cursor: "pointer",
            background: m.tomado ? "#4D7C0F" : "#fff",
            color: m.tomado ? "#fff" : "#C2410C",
            boxShadow: m.tomado
              ? "0 2px 6px rgba(77,124,15,0.3)"
              : "inset 0 0 0 1.5px #C2410C",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <IcCheck size={26} stroke={m.tomado ? 3.5 : 3} />
        </button>
      </div>
    </div>
  );
}
