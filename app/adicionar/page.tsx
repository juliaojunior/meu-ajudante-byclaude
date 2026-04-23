import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import { IcCamera, IcCoffee, IcMoon, IcX, IcPlus } from "@/components/icons";

const horarios = [
  { refeicao: "Café da manhã", h: "07:30" },
  { refeicao: "Jantar", h: "19:00" },
];

const IconRefeicao = ({ refeicao }: { refeicao: string }) => {
  if (refeicao.startsWith("Café")) return <IcCoffee size={22} stroke={2.2} />;
  if (refeicao === "Almoço") return null; // IcUtensils
  return <IcMoon size={22} stroke={2.2} />;
};

export default function AdicionarPage() {
  return (
    <PhoneShell>
      <StatusBar />
      <PageHeader backHref="/" label="Cadastro" title="Novo remédio" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Card foto */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFF1E7, #FFF8F2)",
            borderRadius: 28,
            padding: 22,
            border: "1px solid #EADFCE",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: 60,
              background: "rgba(194,65,12,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "#fff",
                border: "1.5px dashed rgba(194,65,12,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C2410C",
                flexShrink: 0,
              }}
            >
              <IcCamera size={32} stroke={2.2} />
            </div>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1C1917",
                  display: "block",
                  letterSpacing: -0.2,
                }}
              >
                Tire uma foto
              </span>
              <div
                style={{
                  fontSize: 13,
                  color: "#57534E",
                  marginTop: 2,
                  lineHeight: 1.3,
                }}
              >
                da caixa do remédio — ajuda na hora de reconhecer
              </div>
            </div>
          </div>
          <button
            style={{
              marginTop: 14,
              width: "100%",
              height: 48,
              borderRadius: 24,
              border: "none",
              background: "#C2410C",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IcCamera size={18} stroke={2.4} />
            Abrir câmera
          </button>
        </div>

        {/* Campos */}
        <div style={{ marginTop: 22 }}>
          <FormField label="Nome" value="Losartana" big />
          <FormField
            label="Também conhecido como"
            value="Potássica"
            style={{ marginTop: 14 }}
          />
        </div>

        {/* Horários */}
        <div style={{ marginTop: 24 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 600,
              color: "#1C1917",
              letterSpacing: -0.2,
              display: "block",
            }}
          >
            Quantas vezes por dia?
          </span>
          <div
            style={{ fontSize: 13, color: "#57534E", marginTop: 2 }}
          >
            Vincule a uma refeição para lembrar melhor
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {horarios.map((h, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFBF3",
                  border: "1px solid #EADFCE",
                  borderRadius: 16,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#FFF1E7",
                    color: "#C2410C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconRefeicao refeicao={h.refeicao} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}
                  >
                    {h.refeicao}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#C2410C",
                      fontVariantNumeric: "tabular-nums",
                      fontFamily: "var(--font-serif)",
                      letterSpacing: -0.5,
                      marginTop: -2,
                    }}
                  >
                    {h.h}
                  </div>
                </div>
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: "transparent",
                    border: "1px solid #EADFCE",
                    color: "#57534E",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IcX size={16} stroke={2.3} />
                </button>
              </div>
            ))}

            <button
              style={{
                padding: 14,
                borderRadius: 16,
                border: "1.5px dashed #D6C6AA",
                background: "transparent",
                color: "#C2410C",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <IcPlus size={18} stroke={2.5} />
              Mais um horário
            </button>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 20px 28px",
          background: "#FBF6EE",
          borderTop: "1px solid #EADFCE",
          display: "flex",
          gap: 10,
        }}
      >
        <Link
          href="/"
          style={{
            flex: 1,
            height: 56,
            borderRadius: 28,
            border: "1px solid #EADFCE",
            background: "#FFFBF3",
            color: "#57534E",
            fontWeight: 600,
            fontSize: 15,
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Cancelar
        </Link>
        <button
          style={{
            flex: 2,
            height: 56,
            borderRadius: 28,
            border: "none",
            background: "#C2410C",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 6px 14px rgba(194,65,12,0.4)",
          }}
        >
          Guardar remédio
        </button>
      </div>
    </PhoneShell>
  );
}
