import Link from "next/link";
import PhoneShell from "@/components/ui/PhoneShell";
import StatusBar from "@/components/ui/StatusBar";
import HeroProximo from "@/components/home/HeroProximo";
import ProgressoDia from "@/components/home/ProgressoDia";
import GrupoRefeicao from "@/components/home/GrupoRefeicao";
import { IcUser, IcCalendar, IcPlus } from "@/components/icons";
import { IcCoffee, IcUtensils, IcMoon } from "@/components/icons";
import type { DoseMock, GroupMock } from "@/lib/types";

const doses: DoseMock[] = [
  { id: 1, nome: "Losartana",  dose: "50 mg · 1 comp.",  h: "07:30", periodo: "manha",  tomado: true,  kind: "tab1", quando: "em jejum"       },
  { id: 2, nome: "Omeprazol", dose: "20 mg · 1 cáps.",  h: "07:30", periodo: "manha",  tomado: true,  kind: "cap1", quando: "antes de comer"  },
  { id: 3, nome: "AAS",       dose: "100 mg · 1 comp.", h: "12:30", periodo: "almoco", tomado: false, kind: "tab2", quando: "após almoçar"    },
  { id: 4, nome: "Metformina",dose: "850 mg · 1 comp.", h: "19:00", periodo: "noite",  tomado: false, kind: "oval", quando: "com o jantar"    },
  { id: 5, nome: "Atenolol",  dose: "25 mg · 1 cáps.", h: "22:00", periodo: "noite",  tomado: false, kind: "cap2", quando: "antes de dormir" },
];

const groups: GroupMock[] = [
  { key: "manha",  label: "Café da manhã", h: "07:30", acento: "#D97706", Icon: IcCoffee,   items: doses.filter((d) => d.periodo === "manha")  },
  { key: "almoco", label: "Almoço",         h: "12:30", acento: "#C2410C", Icon: IcUtensils, items: doses.filter((d) => d.periodo === "almoco") },
  { key: "noite",  label: "Jantar & noite", h: "19:00", acento: "#6D8B47", Icon: IcMoon,     items: doses.filter((d) => d.periodo === "noite")  },
];

const nextDose = doses.find((d) => !d.tomado);
const proxGrupo = groups.find((g) => g.items.some((i) => !i.tomado));

export default function Home() {
  return (
    <PhoneShell>
      <StatusBar time="07:48" />

      {/* Cabeçalho editorial */}
      <div style={{ padding: "10px 24px 16px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#57534E",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Terça · 21 Abr
            </div>
            <h1
              style={{ margin: "10px 0 0", lineHeight: 0.98, letterSpacing: -1.2 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 38,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#C2410C",
                  display: "block",
                }}
              >
                Bom dia,
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 38,
                  fontWeight: 600,
                  color: "#1C1917",
                  display: "block",
                  marginTop: 2,
                }}
              >
                Dona Neusa.
              </span>
            </h1>
          </div>

          {/* Avatar / perfil */}
          <button
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: "#FFFBF3",
              border: "1px solid #EADFCE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1C1917",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <IcUser size={22} stroke={2} />
            <div
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#C2410C",
                border: "2px solid #FFFBF3",
              }}
            />
          </button>
        </div>
      </div>

      {/* Hero: próximo remédio */}
      {nextDose && proxGrupo && (
        <HeroProximo
          dose={nextDose}
          labelGrupo={proxGrupo.label}
          tempoRestante="em 4h42min"
        />
      )}

      {/* Progresso do dia */}
      <ProgressoDia doses={doses} streak={21} />

      {/* Lista de grupos — área scrollável */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 20px 130px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {groups.map((g) => (
          <GrupoRefeicao key={g.key} group={g} />
        ))}

        {/* Mensagem de fim do dia */}
        <div
          style={{
            marginTop: 6,
            padding: "16px 18px",
            borderRadius: 20,
            border: "1.5px dashed #D6C6AA",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#57534E",
              fontStyle: "italic",
              fontFamily: "var(--font-serif)",
            }}
          >
            Terminou o dia. Boa noite, Dona Neusa. 🌙
          </div>
        </div>
      </div>

      {/* Barra inferior flutuante */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px 28px",
          background:
            "linear-gradient(to top, #FBF6EE 60%, rgba(251,246,238,0.93) 85%, transparent)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <button
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            border: "1px solid #EADFCE",
            background: "#FFFBF3",
            color: "#1C1917",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            pointerEvents: "auto",
          }}
        >
          <IcCalendar size={20} stroke={2.2} />
        </button>
        <Link
          href="/adicionar"
          style={{
            flex: 1,
            height: 64,
            borderRadius: 32,
            background: "#C2410C",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow:
              "0 10px 24px rgba(194,65,12,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            pointerEvents: "auto",
            textDecoration: "none",
          }}
        >
          <IcPlus size={24} stroke={2.8} />
          <span>Adicionar remédio</span>
        </Link>
      </div>
    </PhoneShell>
  );
}
