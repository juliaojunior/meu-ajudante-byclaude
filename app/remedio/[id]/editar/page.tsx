"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import Toggle from "@/components/ui/Toggle";
import { IcCoffee, IcUtensils, IcSun, IcMoon, IcX, IcPlus, IcBell } from "@/components/icons";
import { getRemedio, saveRemedio } from "@/lib/storage";
import { periodoDeHora } from "@/lib/time";
import type { Horario, MedKind, Remedio } from "@/lib/types";

const OPCOES_REFEICAO = [
  { refeicao: "Café da manhã", horaDefault: "07:30", Icon: IcCoffee   },
  { refeicao: "Almoço",        horaDefault: "12:00", Icon: IcUtensils },
  { refeicao: "Tarde",         horaDefault: "15:30", Icon: IcSun      },
  { refeicao: "Jantar",        horaDefault: "19:00", Icon: IcMoon     },
];

const KINDS: MedKind[] = ["tab1", "tab2", "oval", "cap1", "cap2"];
const KIND_LABELS: Record<MedKind, string> = {
  tab1: "Comp. redondo",
  tab2: "Comp. oval",
  oval: "Cápsula oval",
  cap1: "Cápsula clara",
  cap2: "Cápsula escura",
};

export default function EditarPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [remedio, setRemedio] = useState<Remedio | null>(null);
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dose, setDose] = useState("");
  const [para, setPara] = useState("");
  const [kind, setKind] = useState<MedKind>("tab1");
  const [alarme, setAlarme] = useState(true);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const r = getRemedio(id);
    if (!r) { router.replace("/"); return; }
    setRemedio(r);
    setNome(r.nome);
    setApelido(r.apelido ?? "");
    setDose(r.dose);
    setPara(r.para ?? "");
    setKind(r.kind);
    setAlarme(r.alarmeAtivo);
    setHorarios(r.horarios);
  }, [id, router]);

  if (!remedio) return null;

  function addHorario(opcao: (typeof OPCOES_REFEICAO)[0]) {
    if (horarios.some((h) => h.refeicao === opcao.refeicao)) return;
    const hora = opcao.horaDefault;
    setHorarios([...horarios, { hora, refeicao: opcao.refeicao, periodo: periodoDeHora(hora) }]);
  }

  function removeHorario(refeicao: string) {
    setHorarios(horarios.filter((h) => h.refeicao !== refeicao));
  }

  function updateHora(refeicao: string, hora: string) {
    setHorarios(
      horarios.map((h) =>
        h.refeicao === refeicao ? { ...h, hora, periodo: periodoDeHora(hora) } : h
      )
    );
  }

  function salvar() {
    if (!nome.trim()) { setErro("Informe o nome do remédio."); return; }
    if (!dose.trim()) { setErro("Informe a dose."); return; }
    if (horarios.length === 0) { setErro("Adicione ao menos um horário."); return; }
    setErro("");
    if (!remedio) return;

    saveRemedio({
      ...remedio,
      id: remedio.id,
      tomadas: remedio.tomadas,
      criadoEm: remedio.criadoEm,
      nome: nome.trim(),
      apelido: apelido.trim() || undefined,
      dose: dose.trim(),
      para: para.trim() || undefined,
      kind,
      alarmeAtivo: alarme,
      horarios: [...horarios].sort((a, b) => a.hora.localeCompare(b.hora)),
    });
    router.push(`/remedio/${id}`);
  }

  return (
    <PhoneShell>
      <StatusBar />
      <PageHeader backHref={`/remedio/${id}`} label="Editando" title={remedio.nome} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ marginTop: 8 }}>
          <FormField label="Nome" value={nome} onChange={setNome} placeholder="Nome do remédio" big />
          <FormField label="Dose" value={dose} onChange={setDose} placeholder="Ex: 50 mg · 1 comp." style={{ marginTop: 14 }} />
          <FormField label="Também conhecido como" value={apelido} onChange={setApelido} placeholder="Opcional" style={{ marginTop: 14 }} />
          <FormField label="Para quê serve" value={para} onChange={setPara} placeholder="Opcional" style={{ marginTop: 14 }} />
        </div>

        {/* Tipo */}
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontSize: 12, fontWeight: 700, color: "#57534E",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
            }}
          >
            Tipo
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                style={{
                  padding: "8px 14px", borderRadius: 12,
                  border: kind === k ? "2px solid #C2410C" : "1px solid #EADFCE",
                  background: kind === k ? "#FFF1E7" : "#FFFBF3",
                  color: kind === k ? "#C2410C" : "#57534E",
                  fontWeight: kind === k ? 700 : 500,
                  fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)",
                }}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
        </div>

        {/* Horários */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12, fontWeight: 700, color: "#57534E",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
            }}
          >
            Horários
          </div>

          {horarios.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {horarios.map((h) => {
                const opcao = OPCOES_REFEICAO.find((o) => o.refeicao === h.refeicao) ?? OPCOES_REFEICAO[3];
                return (
                  <div
                    key={h.refeicao}
                    style={{
                      background: "#FFFBF3", border: "1px solid #EADFCE",
                      borderRadius: 16, padding: "12px 14px",
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "#FFF1E7", color: "#C2410C",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <opcao.Icon size={20} stroke={2.3} />
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1C1917" }}>
                      {h.refeicao}
                    </div>
                    <input
                      type="time"
                      value={h.hora}
                      onChange={(e) => updateHora(h.refeicao, e.target.value)}
                      style={{
                        fontSize: 22, fontWeight: 700, color: "#C2410C",
                        fontFamily: "var(--font-serif)", fontVariantNumeric: "tabular-nums",
                        background: "transparent", border: "none", outline: "none",
                        cursor: "pointer", padding: 0,
                      }}
                    />
                    <button
                      onClick={() => removeHorario(h.refeicao)}
                      style={{
                        width: 34, height: 34, borderRadius: 17,
                        background: "transparent", border: "1px solid #EADFCE",
                        color: "#57534E", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <IcX size={16} stroke={2.3} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {OPCOES_REFEICAO.filter(
              (o) => !horarios.some((h) => h.refeicao === o.refeicao)
            ).map((opcao) => (
              <button
                key={opcao.refeicao}
                onClick={() => addHorario(opcao)}
                style={{
                  padding: "10px 14px", borderRadius: 14,
                  border: "1.5px dashed #D6C6AA", background: "transparent",
                  color: "#C2410C", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <IcPlus size={16} stroke={2.5} />
                {opcao.refeicao}
              </button>
            ))}
          </div>
        </div>

        {/* Alarme */}
        <div
          style={{
            marginTop: 22, padding: "14px 16px",
            background: "#FFFBF3", borderRadius: 18, border: "1px solid #EADFCE",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: alarme ? "#F1F8EA" : "#FFF1E7",
              color: alarme ? "#4D7C0F" : "#C2410C",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <IcBell size={20} stroke={2.3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>Tocar alarme</div>
            <div style={{ fontSize: 12, color: "#57534E" }}>Som suave + vibração</div>
          </div>
          <Toggle on={alarme} onClick={() => setAlarme(!alarme)} />
        </div>

        {erro && (
          <div
            style={{
              marginTop: 14, padding: "12px 16px",
              background: "#FEF2F2", borderRadius: 12, border: "1px solid #FCA5A5",
              fontSize: 14, color: "#B91C1C", fontWeight: 600,
            }}
          >
            {erro}
          </div>
        )}
      </div>

      {/* Barra inferior */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "12px 20px 28px",
          background: "#FBF6EE", borderTop: "1px solid #EADFCE",
          display: "flex", gap: 10,
        }}
      >
        <Link
          href={`/remedio/${id}`}
          style={{
            flex: 1, height: 56, borderRadius: 28,
            border: "1px solid #EADFCE", background: "#FFFBF3",
            color: "#57534E", fontWeight: 600, fontSize: 15,
            fontFamily: "var(--font-sans)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Voltar
        </Link>
        <button
          onClick={salvar}
          style={{
            flex: 2, height: 56, borderRadius: 28,
            border: "none", background: "#C2410C", color: "#fff",
            fontWeight: 700, fontSize: 16, cursor: "pointer",
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
