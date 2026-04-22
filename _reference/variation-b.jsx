// Variation B — "Rotina Ensolarada": warm terracotta + sage, editorial/human
// NOTE: BStatus, BShell, Serif, BHome now live in b-home.jsx (loaded before this file).
const B = window.B_TOKENS;
const BStatus = window.BStatus;
const BShell = window.BShell;
const Serif = window.Serif;

// ───── HOME lives in b-home.jsx (loaded before this file) ─────
const BHome = window.BHome;
/* eslint-disable */
const _obsoleteHome = () => {
  const doses = [];
  const groups = [
    { key: 'manha', label: 'Café da manhã', h: '07:30', Icon: IcCoffee, acento: '#F4A261', items: doses.filter(m => m.periodo === 'manha') },
    { key: 'almoco', label: 'Almoço', h: '12:30', Icon: IcUtensils, acento: '#E76F51', items: doses.filter(m => m.periodo === 'almoco') },
    { key: 'noite', label: 'Jantar & noite', h: '19:00', Icon: IcMoon, acento: '#6D8B47', items: doses.filter(m => m.periodo === 'noite') },
  ];
  const done = doses.filter(d => d.tomado).length;

  return (
    <BShell>
      <BStatus />
      {/* Editorial header */}
      <div style={{ padding: '8px 24px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>Ter · 21 Abr</div>
            <h1 style={{ margin: '8px 0 0', lineHeight: 1, letterSpacing: -1 }}>
              <Serif style={{ fontSize: 40, fontWeight: 400, fontStyle: 'italic', color: B.brand, display: 'block' }}>Bom dia,</Serif>
              <Serif style={{ fontSize: 40, fontWeight: 600, color: B.text, display: 'block', marginTop: -2 }}>Dona Neusa.</Serif>
            </h1>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: B.brandBg, border: `1.5px solid ${B.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.brand }}>
            <IcUser size={22} stroke={2}/>
          </div>
        </div>
      </div>

      {/* Progress strip */}
      <div style={{ margin: '0 20px 18px', background: B.card, borderRadius: 24, border: `1px solid ${B.border}`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.textMuted, letterSpacing: 0.3 }}>Remédios de hoje</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <Serif style={{ fontSize: 30, fontWeight: 600, color: B.brand }}>{done}</Serif>
            <span style={{ fontSize: 18, fontWeight: 500, color: B.textMuted }}>de {doses.length} tomados</span>
          </div>
          {/* dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {doses.map(d => (
              <div key={d.id} style={{ flex: 1, height: 8, borderRadius: 4, background: d.tomado ? B.success : B.border }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Groups */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>
        {groups.map((g, gi) => (
          <div key={g.key} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 21, background: g.acento + '20', color: g.acento, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${g.acento}40` }}>
                <g.Icon size={22} stroke={2.2}/>
              </div>
              <div style={{ flex: 1 }}>
                <Serif style={{ fontSize: 22, fontWeight: 600, color: B.text, letterSpacing: -0.3, display: 'block' }}>{g.label}</Serif>
                <div style={{ fontSize: 13, color: B.textMuted, fontVariantNumeric: 'tabular-nums' }}>por volta das {g.h}</div>
              </div>
              {g.items.every(i => i.tomado) && g.items.length > 0 && (
                <div style={{ fontSize: 12, fontWeight: 700, color: B.success, background: B.successBg, padding: '5px 10px', borderRadius: 99, display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${B.successBorder}` }}>
                  <IcCheck size={13} stroke={3}/> Pronto
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map(m => (
                <div key={m.id} style={{
                  background: m.tomado ? B.successBg : B.card,
                  border: `1px solid ${m.tomado ? B.successBorder : B.border}`,
                  borderRadius: 18, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: m.tomado ? '#fff' : m.cor + '15', color: m.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${m.cor}30`, fontSize: 26 }}>
                    {m.simbolo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Serif style={{ fontSize: 20, fontWeight: 600, color: m.tomado ? B.textMuted : B.text, letterSpacing: -0.2, display: 'block', textDecoration: m.tomado ? 'line-through' : 'none' }}>{m.nome}</Serif>
                    <div style={{ fontSize: 13, color: B.textMuted, marginTop: 1, display: 'flex', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{m.dose}</span>
                      <span>·</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{m.h}</span>
                    </div>
                  </div>
                  <button style={{
                    width: 52, height: 52, borderRadius: 26, border: 'none', flexShrink: 0,
                    background: m.tomado ? B.success : B.brand,
                    color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: m.tomado ? 'none' : `0 4px 10px ${B.brand}35`,
                  }}>
                    <IcCheck size={24} stroke={3}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar with FAB */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 18px', background: `linear-gradient(to top, ${B.bg}, ${B.bg}dd, transparent)`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ flex: 1, height: 56, borderRadius: 28, border: `1px solid ${B.border}`, background: B.card, color: B.text, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IcCalendar size={18} stroke={2.2}/> Histórico
        </button>
        <button style={{ height: 64, padding: '0 26px', borderRadius: 32, border: 'none', background: B.brand, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 8px 20px ${B.brand}40` }}>
          <IcPlus size={22} stroke={2.8}/> Adicionar
        </button>
      </div>
    </BShell>
  );
};

// ───── ADD ─────
const BAdd = () => {
  const [horarios, setHorarios] = React.useState([
    { h: '07:30', refeicao: 'Café da manhã' },
    { h: '19:00', refeicao: 'Jantar' },
  ]);
  return (
    <BShell>
      <BStatus />
      <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button style={{ width: 44, height: 44, borderRadius: 22, background: B.card, border: `1px solid ${B.border}`, color: B.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcChevronLeft size={22} stroke={2.3}/>
        </button>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Cadastro</div>
          <Serif style={{ fontSize: 24, fontWeight: 600, color: B.text, letterSpacing: -0.4, display: 'block' }}>Novo remédio</Serif>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 120px' }}>
        {/* Hero photo */}
        <div style={{ background: `linear-gradient(135deg, ${B.brandBg}, ${B.brandBgSoft})`, borderRadius: 28, padding: 22, border: `1px solid ${B.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, background: B.brand + '15' }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#fff', border: `1.5px dashed ${B.brand}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.brand, flexShrink: 0 }}>
              <IcCamera size={32} stroke={2.2}/>
            </div>
            <div style={{ flex: 1 }}>
              <Serif style={{ fontSize: 18, fontWeight: 600, color: B.text, display: 'block', letterSpacing: -0.2 }}>Tire uma foto</Serif>
              <div style={{ fontSize: 13, color: B.textMuted, marginTop: 2, lineHeight: 1.3 }}>da caixa do remédio — ajuda na hora de reconhecer</div>
            </div>
          </div>
          <button style={{ marginTop: 14, width: '100%', height: 48, borderRadius: 24, border: 'none', background: B.brand, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <IcCamera size={18} stroke={2.4}/> Abrir câmera
          </button>
        </div>

        {/* Fields */}
        <div style={{ marginTop: 22 }}>
          <BField label="Nome" value="Losartana" big />
          <BField label="Também conhecido como" value="Potássica" style={{ marginTop: 14 }}/>
        </div>

        {/* Doses per day */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <Serif style={{ fontSize: 18, fontWeight: 600, color: B.text, letterSpacing: -0.2, display: 'block' }}>Quantas vezes por dia?</Serif>
              <div style={{ fontSize: 13, color: B.textMuted, marginTop: 2 }}>Vincule a uma refeição para lembrar melhor</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {horarios.map((h, i) => (
              <div key={i} style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: B.brandBg, color: B.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {h.refeicao.startsWith('Café') ? <IcCoffee size={22} stroke={2.2}/> : h.refeicao === 'Almoço' ? <IcUtensils size={22} stroke={2.2}/> : <IcMoon size={22} stroke={2.2}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.text }}>{h.refeicao}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: B.brand, fontVariantNumeric: 'tabular-nums', fontFamily: B.font, letterSpacing: -0.5, marginTop: -2 }}>{h.h}</div>
                </div>
                <button style={{ width: 34, height: 34, borderRadius: 17, background: 'transparent', border: `1px solid ${B.border}`, color: B.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcX size={16} stroke={2.3}/></button>
              </div>
            ))}
            <button style={{ padding: '14px', borderRadius: 16, border: `1.5px dashed ${B.borderStrong}`, background: 'transparent', color: B.brand, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IcPlus size={18} stroke={2.5}/> Mais um horário
            </button>
          </div>
        </div>

        {/* Alarm */}
        <div style={{ marginTop: 20, padding: '14px 16px', background: B.card, borderRadius: 18, border: `1px solid ${B.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: B.successBg, color: B.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcVolume size={22} stroke={2.2}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Tocar alarme na hora</div>
            <div style={{ fontSize: 12, color: B.textMuted }}>Vibra e toca um som suave</div>
          </div>
          <div style={{ width: 52, height: 30, borderRadius: 15, background: B.success, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 3, left: 25, width: 24, height: 24, background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 18px', background: B.bg, borderTop: `1px solid ${B.border}`, display: 'flex', gap: 10 }}>
        <button style={{ flex: 1, height: 56, borderRadius: 28, border: `1px solid ${B.border}`, background: B.card, color: B.textMuted, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
        <button style={{ flex: 2, height: 56, borderRadius: 28, border: 'none', background: B.brand, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 14px ${B.brand}40` }}>Guardar remédio</button>
      </div>
    </BShell>
  );
};

const BField = ({ label, value, big, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    <div style={{ padding: '14px 16px', background: B.card, borderRadius: 14, border: `1px solid ${B.border}`, fontSize: big ? 22 : 16, fontWeight: big ? 700 : 500, color: B.text, fontFamily: big ? B.font : B.fontBody, letterSpacing: big ? -0.3 : 0 }}>
      {value}
    </div>
  </div>
);

// ───── DETAILS ─────
const BDetails = () => (
  <BShell>
    <BStatus />
    <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <button style={{ width: 44, height: 44, borderRadius: 22, background: B.card, border: `1px solid ${B.border}`, color: B.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IcChevronLeft size={22} stroke={2.3}/>
      </button>
      <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Ficha do remédio</div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 24px' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(150deg, #FFF0E5, #FDF7EC)`, borderRadius: 28, padding: '24px 22px', border: `1px solid ${B.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, background: B.brand + '14' }}/>
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 100, height: 100, borderRadius: 50, background: B.accent + '18' }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.brand, textTransform: 'uppercase', letterSpacing: 2 }}>Para a pressão</div>
          <Serif style={{ fontSize: 38, fontWeight: 600, color: B.text, display: 'block', letterSpacing: -1, marginTop: 4, lineHeight: 1 }}>Losartana</Serif>
          <div style={{ fontSize: 16, color: B.textMuted, marginTop: 6, fontStyle: 'italic', fontFamily: B.font }}>50 mg · comprimido</div>

          <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center', background: '#fff', padding: '10px 14px', borderRadius: 16, border: `1px solid ${B.border}`, width: 'fit-content' }}>
            <IcHeart size={18} style={{ color: B.brand }} stroke={2.2}/>
            <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>Já tomou 142 vezes</span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div style={{ marginTop: 16 }}>
        <Serif style={{ fontSize: 16, fontWeight: 600, color: B.text, letterSpacing: -0.2, display: 'block', marginBottom: 10 }}>O que fazer com ele</Serif>
        {[
          { label: 'Café da manhã', h: '07:30', Icon: IcCoffee, done: true, status: 'tomado hoje' },
          { label: 'Jantar', h: '19:00', Icon: IcMoon, done: false, status: 'em 10h42m' },
        ].map((r, i) => (
          <div key={i} style={{ background: B.card, borderRadius: 18, border: `1px solid ${B.border}`, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: r.done ? B.successBg : B.brandBg, color: r.done ? B.success : B.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${r.done ? B.successBorder : B.border}` }}>
              <r.Icon size={22} stroke={2.2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: B.textMuted, fontVariantNumeric: 'tabular-nums' }}>{r.h} · {r.status}</div>
            </div>
            {r.done ? (
              <div style={{ width: 32, height: 32, borderRadius: 16, background: B.success, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={18} stroke={3}/></div>
            ) : (
              <div style={{ fontSize: 22, fontFamily: B.font, fontWeight: 600, color: B.brand, fontVariantNumeric: 'tabular-nums' }}>{r.h}</div>
            )}
          </div>
        ))}
      </div>

      {/* Little info grid */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: B.card, borderRadius: 18, border: `1px solid ${B.border}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Alarme</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: B.success }}/>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.success }}>Ligado</div>
          </div>
        </div>
        <div style={{ background: B.card, borderRadius: 18, border: `1px solid ${B.border}`, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Sequência</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.text, marginTop: 6, fontFamily: B.font }}>21 dias 🔥</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{ height: 56, borderRadius: 28, border: `1.5px solid ${B.borderStrong}`, background: B.card, color: B.text, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <IcEdit size={19} stroke={2.3}/> Alterar informações
        </button>
        <button style={{ height: 56, borderRadius: 28, border: 'none', background: B.dangerBg, color: B.danger, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <IcTrash size={19} stroke={2.3}/> Remover da minha lista
        </button>
      </div>
    </div>
  </BShell>
);

// ───── EDIT ─────
const BEdit = () => (
  <BShell>
    <BStatus />
    <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <button style={{ width: 44, height: 44, borderRadius: 22, background: B.card, border: `1px solid ${B.border}`, color: B.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IcChevronLeft size={22} stroke={2.3}/>
      </button>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Editando</div>
        <Serif style={{ fontSize: 24, fontWeight: 600, color: B.text, letterSpacing: -0.4, display: 'block' }}>Losartana</Serif>
      </div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 120px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, background: B.card, borderRadius: 20, border: `1px solid ${B.border}` }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg, ${B.brand}, ${B.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontSize: 32 }}>●</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: B.textMuted }}>Foto da caixa</div>
          <button style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: B.brand, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, fontFamily: 'inherit' }}>
            <IcCamera size={16} stroke={2.4}/> Tirar nova foto
          </button>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <BField label="Nome" value="Losartana" big />
        <BField label="Também conhecido como" value="Potássica" style={{ marginTop: 14 }}/>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Horários</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: `linear-gradient(135deg, ${B.brandBg}, ${B.brandBgSoft})`, border: `1.5px solid ${B.brand}40`, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', color: B.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCoffee size={20} stroke={2.3}/></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>Café da manhã</div>
            <Serif style={{ fontSize: 24, fontWeight: 600, color: B.brand, fontVariantNumeric: 'tabular-nums' }}>07:30</Serif>
          </div>
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: B.brandBg, color: B.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcMoon size={20} stroke={2.3}/></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>Jantar</div>
            <Serif style={{ fontSize: 24, fontWeight: 600, color: B.text, fontVariantNumeric: 'tabular-nums' }}>19:00</Serif>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22, padding: '14px 16px', background: B.card, borderRadius: 18, border: `1px solid ${B.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: B.successBg, color: B.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={20} stroke={2.3}/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Tocar alarme</div>
          <div style={{ fontSize: 12, color: B.textMuted }}>Som suave + vibração</div>
        </div>
        <div style={{ width: 52, height: 30, borderRadius: 15, background: B.success, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 3, left: 25, width: 24, height: 24, background: '#fff', borderRadius: 12 }}/>
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 18px', background: B.bg, borderTop: `1px solid ${B.border}`, display: 'flex', gap: 10 }}>
      <button style={{ flex: 1, height: 56, borderRadius: 28, border: `1px solid ${B.border}`, background: B.card, color: B.textMuted, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Voltar</button>
      <button style={{ flex: 2, height: 56, borderRadius: 28, border: 'none', background: B.brand, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 14px ${B.brand}40` }}>Salvar mudanças</button>
    </div>
  </BShell>
);

// ───── DELETE MODAL ─────
const BDelete = () => (
  <BShell>
    <BStatus />
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
      <BDetails />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', padding: 18 }}>
      <div style={{ width: '100%', background: B.surface, borderRadius: 28, padding: '28px 24px 22px', boxShadow: '0 20px 60px rgba(0,0,0,.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, background: B.dangerBg }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: B.dangerBg, color: B.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <IcAlert size={28} stroke={2.2}/>
          </div>
          <Serif style={{ fontSize: 26, fontWeight: 600, color: B.text, display: 'block', letterSpacing: -0.4, lineHeight: 1.15 }}>
            Remover<br/><em style={{ color: B.brand }}>Losartana</em> da lista?
          </Serif>
          <p style={{ fontSize: 14, color: B.textMuted, margin: '10px 0 20px', lineHeight: 1.5 }}>
            O alarme não vai mais tocar e você perde a sua sequência de <strong style={{ color: B.text }}>21 dias</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button style={{ height: 56, borderRadius: 28, border: 'none', background: B.danger, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>Sim, pode remover</button>
            <button style={{ height: 56, borderRadius: 28, border: `1px solid ${B.border}`, background: B.card, color: B.text, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Não, voltar</button>
          </div>
        </div>
      </div>
    </div>
  </BShell>
);

Object.assign(window, { BHome, BAdd, BDetails, BEdit, BDelete });
