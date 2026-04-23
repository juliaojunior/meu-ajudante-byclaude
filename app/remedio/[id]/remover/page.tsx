"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import { IcAlert } from "@/components/icons";
import { getRemedio, deleteRemedio } from "@/lib/storage";
import { deletarFoto } from "@/lib/fotos";
import { calcularStreak } from "@/lib/streak";
import type { Remedio } from "@/lib/types";

export default function RemoverPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [remedio, setRemedio] = useState<Remedio | null>(null);

  useEffect(() => {
    const r = getRemedio(id);
    if (!r) { router.replace("/"); return; }
    setRemedio(r);
  }, [id, router]);

  if (!remedio) return null;

  const streak = calcularStreak(remedio);

  function confirmarRemocao() {
    if (remedio?.fotoId) deletarFoto(remedio.fotoId);
    deleteRemedio(id);
    router.replace("/");
  }

  return (
    <PhoneShell>
      <StatusBar />

      {/* Fundo simulado */}
      <div
        style={{
          position: "absolute", inset: 0,
          padding: "0 20px", opacity: 0.35,
          pointerEvents: "none", userSelect: "none", overflow: "hidden",
        }}
      >
        <div style={{ marginTop: 100 }}>
          <div style={{ background: "linear-gradient(150deg, #FFF0E5, #FDF7EC)", borderRadius: 28, height: 160, border: "1px solid #EADFCE" }} />
          <div style={{ marginTop: 12, background: "#FFFBF3", borderRadius: 18, height: 70, border: "1px solid #EADFCE" }} />
          <div style={{ marginTop: 8, background: "#FFFBF3", borderRadius: 18, height: 70, border: "1px solid #EADFCE" }} />
        </div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "rgba(28,25,23,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", padding: 18,
        }}
      >
        <div
          style={{
            width: "100%", background: "#FFFFFF",
            borderRadius: 28, padding: "28px 24px 22px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            position: "relative", overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", top: -30, right: -30,
              width: 100, height: 100, borderRadius: 50,
              background: "#FEF2F2", pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 60, height: 60, borderRadius: 30,
                background: "#FEF2F2", color: "#B91C1C",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <IcAlert size={28} stroke={2.2} />
            </div>

            <span
              style={{
                fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600,
                color: "#1C1917", display: "block", letterSpacing: -0.4, lineHeight: 1.15,
              }}
            >
              Remover
              <br />
              <em style={{ color: "#C2410C" }}>{remedio.nome}</em> da lista?
            </span>

            <p
              style={{
                fontSize: 14, color: "#57534E",
                margin: "10px 0 20px", lineHeight: 1.5,
              }}
            >
              {streak > 0
                ? <>O alarme não vai mais tocar e você perde a sua sequência de{" "}<strong style={{ color: "#1C1917" }}>{streak} {streak === 1 ? "dia" : "dias"}</strong>.</>
                : "O alarme não vai mais tocar e o histórico será perdido."
              }
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={confirmarRemocao}
                style={{
                  height: 56, borderRadius: 28, border: "none",
                  background: "#B91C1C", color: "#fff",
                  fontWeight: 700, fontSize: 16,
                  fontFamily: "var(--font-sans)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                Sim, pode remover
              </button>
              <Link
                href={`/remedio/${id}`}
                style={{
                  height: 56, borderRadius: 28,
                  border: "1px solid #EADFCE", background: "#FFFBF3",
                  color: "#1C1917", fontWeight: 600, fontSize: 15,
                  fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                Não, voltar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
