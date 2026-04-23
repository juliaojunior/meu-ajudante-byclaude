import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import PageHeader from "@/components/ui/PageHeader";
import { IcCheck, IcHeart, IcEdit, IcTrash, IcCoffee, IcMoon } from "@/components/icons";

type Props = { params: Promise<{ id: string }> };

export default async function DetalhesPage({ params }: Props) {
  const { id } = await params;

  const horarios = [
    { label: "Café da manhã", h: "07:30", Icon: IcCoffee, done: true,  status: "tomado hoje"  },
    { label: "Jantar",        h: "19:00", Icon: IcMoon,    done: false, status: "em 10h42m"   },
  ];

  return (
    <PhoneShell>
      <StatusBar />
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
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: 70,
              background: "rgba(194,65,12,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: "rgba(180,83,9,0.1)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#C2410C",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Para a pressão
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 38,
                fontWeight: 600,
                color: "#1C1917",
                display: "block",
                letterSpacing: -1,
                marginTop: 4,
                lineHeight: 1,
              }}
            >
              Losartana
            </span>
            <div
              style={{
                fontSize: 16,
                color: "#57534E",
                marginTop: 6,
                fontStyle: "italic",
                fontFamily: "var(--font-serif)",
              }}
            >
              50 mg · comprimido
            </div>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#fff",
                padding: "10px 14px",
                borderRadius: 16,
                border: "1px solid #EADFCE",
                width: "fit-content",
              }}
            >
              <IcHeart size={18} stroke={2.2} style={{ color: "#C2410C" }} />
              <span
                style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}
              >
                Já tomou 142 vezes
              </span>
            </div>
          </div>
        </div>

        {/* Horários */}
        <div style={{ marginTop: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontWeight: 600,
              color: "#1C1917",
              letterSpacing: -0.2,
              display: "block",
              marginBottom: 10,
            }}
          >
            O que fazer com ele
          </span>

          {horarios.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#FFFBF3",
                borderRadius: 18,
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
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: r.done ? "#F1F8EA" : "#FFF1E7",
                  color: r.done ? "#4D7C0F" : "#C2410C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${r.done ? "#BEF264" : "#EADFCE"}`,
                  flexShrink: 0,
                }}
              >
                <r.Icon size={22} stroke={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#57534E",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {r.h} · {r.status}
                </div>
              </div>
              {r.done ? (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    background: "#4D7C0F",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IcCheck size={18} stroke={3} />
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#C2410C",
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {r.h}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Info grid */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <div
            style={{
              background: "#FFFBF3",
              borderRadius: 18,
              border: "1px solid #EADFCE",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#57534E",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Alarme
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: "#4D7C0F",
                }}
              />
              <div
                style={{ fontSize: 15, fontWeight: 700, color: "#4D7C0F" }}
              >
                Ligado
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#FFFBF3",
              borderRadius: 18,
              border: "1px solid #EADFCE",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#57534E",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Sequência
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1C1917",
                marginTop: 6,
                fontFamily: "var(--font-serif)",
              }}
            >
              21 dias 🔥
            </div>
          </div>
        </div>

        {/* Ações */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Link
            href={`/remedio/${id}/editar`}
            style={{
              height: 56,
              borderRadius: 28,
              border: "1.5px solid #D6C6AA",
              background: "#FFFBF3",
              color: "#1C1917",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <IcEdit size={19} stroke={2.3} />
            Alterar informações
          </Link>
          <Link
            href={`/remedio/${id}/remover`}
            style={{
              height: 56,
              borderRadius: 28,
              border: "none",
              background: "#FEF2F2",
              color: "#B91C1C",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
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
