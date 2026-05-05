"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import Toggle from "@/components/ui/Toggle";
import { IcCoffee, IcUtensils, IcSun, IcMoon, IcX, IcPlus, IcBell, IcCamera } from "@/components/icons";
import { saveRemedio, novoId, getRemedios } from "@/lib/storage";
import { salvarFoto } from "@/lib/fotos";
import { ensurePushSubscription, syncSchedules } from "@/lib/push-subscribe";
import { periodoDeHora } from "@/lib/time";
import { Capacitor } from "@capacitor/core";
import type { Horario, MedKind } from "@/lib/types";

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

export default function AdicionarPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dose, setDose] = useState("");
  const [para, setPara] = useState("");
  const [kind, setKind] = useState<MedKind>("tab1");
  const [alarme, setAlarme] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [erro, setErro] = useState("");

  async function toggleAlarme() {
    if (alarme) {
      setAlarme(false);
      setPermissaoNegada(false);
      return;
    }
    if (!Capacitor.isNativePlatform()) {
      const result = await ensurePushSubscription();
      if (!result.ok) {
        setPermissaoNegada(result.reason === "permission-denied");
      } else {
        setPermissaoNegada(false);
        syncSchedules(getRemedios());
      }
    }
    setAlarme(true);
  }
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function addHorario(opcao: (typeof OPCOES_REFEICAO)[0]) {
    const jaExiste = horarios.some((h) => h.refeicao === opcao.refeicao);
    if (jaExiste) return;
    const hora = opcao.horaDefault;
    setHorarios([
      ...horarios,
      { hora, refeicao: opcao.refeicao, periodo: periodoDeHora(hora) },
    ]);
  }

  function removeHorario(refeicao: string) {
    setHorarios(horarios.filter((h) => h.refeicao !== refeicao));
  }

  function updateHora(refeicao: string, hora: string) {
    setHorarios(
      horarios.map((h) =>
        h.refeicao === refeicao
          ? { ...h, hora, periodo: periodoDeHora(hora) }
          : h
      )
    );
  }

  function salvar() {
    if (!nome.trim()) { setErro("Informe o nome do remédio."); return; }
    if (!dose.trim()) { setErro("Informe a dose (ex: 50 mg · 1 comp.)."); return; }
    if (horarios.length === 0) { setErro("Adicione ao menos um horário."); return; }
    if (horarios.some((h) => parseInt(h.hora.split(":")[1]) % 10 !== 0)) { setErro("Use horários de 10 em 10 minutos (ex: 08h00, 08h10)."); return; }
    setErro("");

    const id = novoId();
    saveRemedio({
      id,
      nome: nome.trim(),
      apelido: apelido.trim() || undefined,
      dose: dose.trim(),
      para: para.trim() || undefined,
      kind,
      alarmeAtivo: alarme,
      horarios: [...horarios].sort((a, b) => a.hora.localeCompare(b.hora)),
      tomadas: [],
      criadoEm: new Date().toISOString(),
      fotoId: fotoBlob ? id : undefined,
    });
    if (fotoBlob) salvarFoto(id, fotoBlob);
    syncSchedules(getRemedios());
    router.push("/");
  }

  return (
    <PhoneShell>
      <PageHeader backHref="/" label="Cadastro" title="Novo remédio" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Foto */}
        <input
          ref={inputFotoRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFotoChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            background: "linear-gradient(135deg, #FFF1E7, #FFF8F2)",
            borderRadius: 28,
            padding: 16,
            border: "1px solid #EADFCE",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {fotoPreview ? (
            <img
              src={fotoPreview}
              alt="Foto do remédio"
              style={{
                width: 80,
                height: 80,
                borderRadius: 18,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 18,
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
          )}
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 17,
                fontWeight: 600,
                color: "#1C1917",
                display: "block",
              }}
            >
              {fotoPreview ? "Foto capturada" : "Foto da caixa"}
            </span>
            <div style={{ fontSize: 13, color: "#57534E", marginTop: 2 }}>
              {fotoPreview ? "Toque para trocar" : "Ajuda a reconhecer o remédio"}
            </div>
            <button
              onClick={() => inputFotoRef.current?.click()}
              style={{
                marginTop: 10,
                padding: "8px 16px",
                borderRadius: 20,
                border: "none",
                background: "#C2410C",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IcCamera size={15} stroke={2.4} />
              {fotoPreview ? "Trocar foto" : "Abrir câmera"}
            </button>
          </div>
        </div>

        {/* Campos principais */}
        <div style={{ marginTop: 16 }}>
          <FormField
            label="Nome"
            value={nome}
            onChange={setNome}
            placeholder="Ex: Losartana"
            big
          />
          <FormField
            label="Dose"
            value={dose}
            onChange={setDose}
            placeholder="Ex: 50 mg · 1 comp."
            style={{ marginTop: 14 }}
          />
          <FormField
            label="Também conhecido como (opcional)"
            value={apelido}
            onChange={setApelido}
            placeholder="Apelido ou nome popular"
            style={{ marginTop: 14 }}
          />
          <FormField
            label="Para quê serve (opcional)"
            value={para}
            onChange={setPara}
            placeholder="Ex: Para a pressão"
            style={{ marginTop: 14 }}
          />
        </div>

        {/* Tipo de remédio */}
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#57534E",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
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
                  padding: "8px 14px",
                  borderRadius: 12,
                  border: kind === k ? "2px solid #C2410C" : "1px solid #EADFCE",
                  background: kind === k ? "#FFF1E7" : "#FFFBF3",
                  color: kind === k ? "#C2410C" : "#57534E",
                  fontWeight: kind === k ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
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
          <div style={{ fontSize: 13, color: "#57534E", marginTop: 2 }}>
            Vincule a uma refeição para lembrar melhor
          </div>

          {/* Horários selecionados */}
          {horarios.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {horarios.map((h) => {
                const opcao = OPCOES_REFEICAO.find((o) => o.refeicao === h.refeicao)!;
                return (
                  <div
                    key={h.refeicao}
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
                      <opcao.Icon size={22} stroke={2.2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>
                        {h.refeicao}
                      </div>
                      <input
                        type="time"
                        step={600}
                        value={h.hora}
                        onChange={(e) => updateHora(h.refeicao, e.target.value)}
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#C2410C",
                          fontFamily: "var(--font-serif)",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                          padding: 0,
                          marginTop: -2,
                        }}
                      />
                    </div>
                    <button
                      onClick={() => removeHorario(h.refeicao)}
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
                );
              })}
            </div>
          )}

          {/* Botões para adicionar refeição */}
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {OPCOES_REFEICAO.filter(
              (o) => !horarios.some((h) => h.refeicao === o.refeicao)
            ).map((opcao) => (
              <button
                key={opcao.refeicao}
                onClick={() => addHorario(opcao)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  border: "1.5px dashed #D6C6AA",
                  background: "transparent",
                  color: "#C2410C",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
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
              background: alarme ? "#F1F8EA" : "#FFF1E7",
              color: alarme ? "#4D7C0F" : "#C2410C",
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
            <div style={{ fontSize: 12, color: "#57534E" }}>Som suave + vibração</div>
          </div>
          <Toggle on={alarme} onClick={toggleAlarme} />
        </div>

        {permissaoNegada && (
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "#78716C",
              lineHeight: 1.4,
            }}
          >
            Notificações bloqueadas. Para receber lembretes, ative nas configurações do navegador.
          </div>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              background: "#FEF2F2",
              borderRadius: 12,
              border: "1px solid #FCA5A5",
              fontSize: 14,
              color: "#B91C1C",
              fontWeight: 600,
            }}
          >
            {erro}
          </div>
        )}
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
          onClick={salvar}
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
