import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import Toggle from "@/components/ui/Toggle";
import { IcCamera, IcCoffee, IcMoon, IcBell } from "@/components/icons";

type Props = { params: Promise<{ id: string }> };

export default async function EditarPage({ params }: Props) {
  const { id } = await params;

  const horarios = [
    { refeicao: "Café da manhã", h: "07:30", Icon: IcCoffee, ativo: true  },
    { refeicao: "Jantar",        h: "19:00", Icon: IcMoon,    ativo: false },
  ];

  return (
    <PhoneShell>
      <StatusBar />
      <PageHeader backHref={`/remedio/${id}`} label="Editando" title="Losartana" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Foto existente */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: 14,
            background: "#FFFBF3",
            borderRadius: 20,
            border: "1px solid #EADFCE",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #C2410C, #B45309)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
              fontSize: 32,
            }}
          >
            ●
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#57534E" }}>Foto da caixa</div>
            <button
              style={{
                marginTop: 4,
                fontSize: 14,
                fontWeight: 700,
                color: "#C2410C",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
                fontFamily: "var(--font-sans)",
              }}
            >
              <IcCamera size={16} stroke={2.4} />
              Tirar nova foto
            </button>
          </div>
        </div>

        {/* Campos */}
        <div style={{ marginTop: 18 }}>
          <FormField label="Nome" value="Losartana" big />
          <FormField
            label="Também conhecido como"
            value="Potássica"
            style={{ marginTop: 14 }}
          />
        </div>

        {/* Horários */}
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#57534E",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Horários
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {horarios.map((h, i) => (
              <div
                key={i}
                style={{
                  background: h.ativo
                    ? "linear-gradient(135deg, #FFF1E7, #FFF8F2)"
                    : "#FFFBF3",
                  border: h.ativo
                    ? "1.5px solid rgba(194,65,12,0.3)"
                    : "1px solid #EADFCE",
                  borderRadius: 16,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: h.ativo ? "#fff" : "#FFF1E7",
                    color: "#C2410C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <h.Icon size={20} stroke={2.3} />
                </div>
                <div
                  style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1C1917" }}
                >
                  {h.refeicao}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: h.ativo ? "#C2410C" : "#1C1917",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {h.h}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle alarme */}
        <div
          style={{
            marginTop: 22,
            padding: "14px 16px",
            background: "#FFFBF3",
            borderRadius: 18,
            border: "1px solid #EADFCE",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "#F1F8EA",
              color: "#4D7C0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IcBell size={20} stroke={2.3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>
              Tocar alarme
            </div>
            <div style={{ fontSize: 12, color: "#57534E" }}>
              Som suave + vibração
            </div>
          </div>
          <Toggle on />
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
          href={`/remedio/${id}`}
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
          Voltar
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
          Salvar mudanças
        </button>
      </div>
    </PhoneShell>
  );
}
