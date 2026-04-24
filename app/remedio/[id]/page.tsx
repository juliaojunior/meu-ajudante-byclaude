"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import PageHeader from "@/components/ui/PageHeader";
import { IcCheck, IcHeart, IcEdit, IcTrash, IcCoffee, IcUtensils, IcSun, IcMoon } from "@/components/icons";
import { getRemedio } from "@/lib/storage";
import { useFoto } from "@/hooks/useFoto";
import { dataHoje, tempoRestante, horaAtual } from "@/lib/time";
import { calcularStreak } from "@/lib/streak";
import type { Remedio, Periodo } from "@/lib/types";

function iconePorPeriodo(periodo: Periodo) {
  if (periodo === "manha")  return IcCoffee;
  if (periodo === "almoco") return IcUtensils;
  if (periodo === "tarde")  return IcSun;
  return IcMoon;
}

export default function DetalhesPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [remedio, setRemedio] = useState<Remedio | null>(null);

  useEffect(() => {
    const r = getRemedio(id);
    if (!r) { router.replace("/"); return; }
    setRemedio(r);
  }, [id, router]);

  const fotoUrl = useFoto(remedio?.fotoId);

  if (!remedio) return null;

  const hoje = dataHoje();
  const agora = horaAtual();
  const streak = calcularStreak(remedio);

  return (
    <PhoneShell>
      <PageHeader backHref="/" label="Ficha do remédio" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 32px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(150deg, #FFF0E5, #FDF7EC)",
            borderRadius: 28,
            padding: "24px 22px",
            border: "1px solid #EADFCE",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", top: -30, right: -30,
              width: 140, height: 140, borderRadius: 70,
              background: "rgba(194,65,12,0.08)", pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -40, left: -40,
              width: 100, height: 100, borderRadius: 50,
              background: "rgba(180,83,9,0.1)", pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {fotoUrl && (
                <img
                  src={fotoUrl}
                  alt="Foto do remédio"
                  style={{
                    width: 80, height: 80, borderRadius: 18,
                    objectFit: "cover", flexShrink: 0,
                    border: "1px solid #EADFCE",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                {remedio.para && (
                  <div
                    style={{
                      fontSize: 11, fontWeight: 700, color: "#C2410C",
                      textTransform: "uppercase", letterSpacing: 2,
                    }}
                  >
                    {remedio.para}
                  </div>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: fotoUrl ? 30 : 38,
                    fontWeight: 600, color: "#1C1917",
                    display: "block", letterSpacing: -1, marginTop: 4, lineHeight: 1,
                  }}
                >
                  {remedio.nome}
                </span>
              </div>
            </div>
            {remedio.apelido && (
              <div
                style={{
                  fontSize: 16, color: "#57534E", marginTop: 4,
                  fontStyle: "italic", fontFamily: "var(--font-serif)",
                }}
              >
                {remedio.apelido}
              </div>
            )}
            <div
              style={{
                fontSize: 16, color: "#57534E", marginTop: 6,
                fontStyle: "italic", fontFamily: "var(--font-serif)",
              }}
            >
              {remedio.dose}
            </div>

            <div
              style={{
                marginTop: 18,
                display: "flex", gap: 8, alignItems: "center",
                background: "#fff", padding: "10px 14px",
                borderRadius: 16, border: "1px solid #EADFCE",
                width: "fit-content",
              }}
            >
              <IcHeart size={18} stroke={2.2} style={{ color: "#C2410C" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>
                Já tomou {remedio.tomadas.length} {remedio.tomadas.length === 1 ? "vez" : "vezes"}
              </span>
            </div>
          </div>
        </div>

        {/* Horários */}
        <div style={{ marginTop: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600,
              color: "#1C1917", letterSpacing: -0.2, display: "block", marginBottom: 10,
            }}
          >
            Horários de hoje
          </span>

          {remedio.horarios.map((h, i) => {
            const tomado = remedio.tomadas.some(
              (t) => t.data === hoje && t.horario === h.hora
            );
            const Icon = iconePorPeriodo(h.periodo);
            const status = tomado ? "tomado hoje" : (h.hora > agora ? tempoRestante(h.hora) : "atrasado");

            return (
              <div
                key={i}
                style={{
                  background: "#FFFBF3",
                  borderRadius: 18, border: "1px solid #EADFCE",
                  padding: "14px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <div
                  style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: tomado ? "#F1F8EA" : "#FFF1E7",
                    color: tomado ? "#4D7C0F" : "#C2410C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${tomado ? "#BEF264" : "#EADFCE"}`,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} stroke={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>
                    {h.refeicao}
                  </div>
                  <div style={{ fontSize: 13, color: "#57534E", fontVariantNumeric: "tabular-nums" }}>
                    {h.hora} · {status}
                  </div>
                </div>
                {tomado ? (
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: "#4D7C0F", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IcCheck size={18} stroke={3} />
                  </div>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
                      color: "#C2410C", fontVariantNumeric: "tabular-nums", flexShrink: 0,
                    }}
                  >
                    {h.hora}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Info grid */}
        <div
          style={{
            marginTop: 16, display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: 8,
          }}
        >
          <div
            style={{
              background: "#FFFBF3", borderRadius: 18,
              border: "1px solid #EADFCE", padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 700, color: "#57534E",
                textTransform: "uppercase", letterSpacing: 1,
              }}
            >
              Alarme
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div
                style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: remedio.alarmeAtivo ? "#4D7C0F" : "#D6C6AA",
                }}
              />
              <div
                style={{
                  fontSize: 15, fontWeight: 700,
                  color: remedio.alarmeAtivo ? "#4D7C0F" : "#57534E",
                }}
              >
                {remedio.alarmeAtivo ? "Ligado" : "Desligado"}
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#FFFBF3", borderRadius: 18,
              border: "1px solid #EADFCE", padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 700, color: "#57534E",
                textTransform: "uppercase", letterSpacing: 1,
              }}
            >
              Sequência
            </div>
            <div
              style={{
                fontSize: 15, fontWeight: 700, color: "#1C1917",
                marginTop: 6, fontFamily: "var(--font-serif)",
              }}
            >
              {streak} {streak === 1 ? "dia" : "dias"} {streak > 0 ? "🔥" : ""}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href={`/remedio/${id}/editar`}
            style={{
              height: 56, borderRadius: 28, border: "1.5px solid #D6C6AA",
              background: "#FFFBF3", color: "#1C1917", fontWeight: 700,
              fontSize: 15, fontFamily: "var(--font-sans)",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, textDecoration: "none",
            }}
          >
            <IcEdit size={19} stroke={2.3} />
            Alterar informações
          </Link>
          <Link
            href={`/remedio/${id}/remover`}
            style={{
              height: 56, borderRadius: 28, border: "none",
              background: "#FEF2F2", color: "#B91C1C", fontWeight: 700,
              fontSize: 15, fontFamily: "var(--font-sans)",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, textDecoration: "none",
            }}
          >
            <IcTrash size={19} stroke={2.3} />
            Remover da minha lista
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
