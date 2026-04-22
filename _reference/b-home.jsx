// Home polida — Rotina Ensolarada
const B = window.B_TOKENS;

const BStatus = ({ time = "07:48" }) => (
  <div style={{
    height: 44, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: 15, fontWeight: 600, color: B.text, fontVariantNumeric: 'tabular-nums',
  }}>
    <span>{time}</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M1 7.5h2v3H1zM5 5.5h2v5H5zM9 3h2v7.5H9zM13 0h2v10.5h-2z"/></svg>
      <div style={{ width: 24, height: 11, border: '1px solid currentColor', borderRadius: 3, padding: 1, opacity: .9 }}>
        <div style={{ width: '80%', height: '100%', background: 'currentColor', borderRadius: 1 }}/>
      </div>
    </div>
  </div>
);

const BShell = ({ children, bg = B.bg }) => (
  <div style={{ width: '100%', height: '100%', background: bg, fontFamily: B.fontBody, color: B.text, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
    {children}
  </div>
);

const Serif = ({ children, style, as = 'span' }) => {
  const Tag = as;
  return <Tag style={{ fontFamily: B.font, ...style }}>{children}</Tag>;
};

// Saudação dinâmica — hora "simulada" 07:48 → bom dia
const saudacao = () => "Bom dia";

// Pílula visual — capsule com duas metades, bem mais "remédio" que o símbolo ●
const Capsule = ({ a = '#C2410C', b = '#FDBA74', size = 48, rot = -30 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <defs>
      <clipPath id={`cap-${a}-${b}`}><rect x="8" y="18" width="32" height="12" rx="6"/></clipPath>
    </defs>
    <g transform={`rotate(${rot} 24 24)`}>
      <rect x="8" y="18" width="16" height="12" rx="6" fill={a}/>
      <rect x="24" y="18" width="16" height="12" rx="6" fill={b}/>
      <rect x="8" y="18" width="32" height="12" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      <ellipse cx="14" cy="22" rx="3" ry="1.2" fill="rgba(255,255,255,0.45)"/>
    </g>
  </svg>
);

// Comprimido redondo
const Tablet = ({ c = '#fff', ring = '#A16207', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="13" fill={c} stroke={ring} strokeWidth="1.5"/>
    <line x1="12" y1="24" x2="36" y2="24" stroke={ring} strokeWidth="1.2" opacity="0.6"/>
    <ellipse cx="20" cy="20" rx="3" ry="1.5" fill="rgba(255,255,255,0.6)"/>
  </svg>
);

// Comprimido em "drágea" oval
const Oval = ({ c = '#4D7C0F', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <g transform="rotate(-20 24 24)">
      <ellipse cx="24" cy="24" rx="14" ry="8" fill={c}/>
      <ellipse cx="19" cy="21" rx="3" ry="1.3" fill="rgba(255,255,255,0.45)"/>
    </g>
  </svg>
);

const medIcon = (kind) => {
  if (kind === 'cap1') return <Capsule a="#C2410C" b="#FDBA74"/>;
  if (kind === 'cap2') return <Capsule a="#9A3412" b="#FED7AA" rot={-12}/>;
  if (kind === 'tab1') return <Tablet c="#FEF3C7" ring="#92400E"/>;
  if (kind === 'tab2') return <Tablet c="#FFFFFF" ring="#78716C"/>;
  if (kind === 'oval') return <Oval c="#4D7C0F"/>;
  return <Tablet/>;
};

const BHome = () => {
  const doses = [
    { id: 1, nome: 'Losartana', dose: '50 mg · 1 comp.', h: '07:30', periodo: 'manha', tomado: true,  kind: 'tab1', quando: 'em jejum' },
    { id: 2, nome: 'Omeprazol', dose: '20 mg · 1 cáps.', h: '07:30', periodo: 'manha', tomado: true,  kind: 'cap1', quando: 'antes de comer' },
    { id: 3, nome: 'AAS',       dose: '100 mg · 1 comp.', h: '12:30', periodo: 'almoco', tomado: false, kind: 'tab2', quando: 'após almoçar' },
    { id: 4, nome: 'Metformina',dose: '850 mg · 1 comp.', h: '19:00', periodo: 'noite',  tomado: false, kind: 'oval', quando: 'com o jantar' },
    { id: 5, nome: 'Atenolol',  dose: '25 mg · 1 cáps.',  h: '22:00', periodo: 'noite',  tomado: false, kind: 'cap2', quando: 'antes de dormir' },
  ];

  const groups = [
    { key: 'manha',  label: 'Café da manhã',  h: '07:30', Icon: IcCoffee,   acento: '#D97706', items: doses.filter(m => m.periodo === 'manha') },
    { key: 'almoco', label: 'Almoço',          h: '12:30', Icon: IcUtensils, acento: '#C2410C', items: doses.filter(m => m.periodo === 'almoco') },
    { key: 'noite',  label: 'Jantar & noite',  h: '19:00', Icon: IcMoon,     acento: '#6D8B47', items: doses.filter(m => m.periodo === 'noite') },
  ];
  const done = doses.filter(d => d.tomado).length;
  const nextDose = doses.find(d => !d.tomado);
  const proxGrupo = groups.find(g => g.items.some(i => !i.tomado));

  return (
    <BShell>
      <BStatus />

      {/* Editorial header */}
      <div style={{ padding: '10px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>
              Terça · 21 Abr
            </div>
            <h1 style={{ margin: '10px 0 0', lineHeight: 0.98, letterSpacing: -1.2 }}>
              <Serif style={{ fontSize: 38, fontWeight: 400, fontStyle: 'italic', color: B.brand, display: 'block' }}>{saudacao()},</Serif>
              <Serif style={{ fontSize: 38, fontWeight: 600, color: B.text, display: 'block', marginTop: 2 }}>Dona Neusa.</Serif>
            </h1>
          </div>
          <button style={{
            width: 48, height: 48, borderRadius: 24, background: B.card, border: `1px solid ${B.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.text, cursor: 'pointer', position: 'relative',
          }}>
            <IcUser size={22} stroke={2}/>
            <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: 5, background: B.brand, border: '2px solid #fff' }}/>
          </button>
        </div>
      </div>

      {/* "Próximo" hero — grande, orientador, o item mais importante da tela */}
      {nextDose && (
        <div style={{
          margin: '0 20px 18px',
          background: `linear-gradient(145deg, #FFF2E6 0%, #FDF5E7 100%)`,
          borderRadius: 28,
          border: `1px solid ${B.border}`,
          padding: '18px 20px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, background: B.brand + '10' }}/>
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: 40, background: B.accent + '14' }}/>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: B.brand, textTransform: 'uppercase', letterSpacing: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: B.brand, boxShadow: `0 0 0 4px ${B.brand}30` }}/>
              Próximo · em 4h42min
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: '#fff', border: `1px solid ${B.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
                {medIcon(nextDose.kind)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Serif style={{ fontSize: 28, fontWeight: 600, color: B.text, letterSpacing: -0.6, lineHeight: 1, display: 'block' }}>{nextDose.nome}</Serif>
                <div style={{ fontSize: 13, color: B.textMuted, marginTop: 4, fontWeight: 500 }}>{nextDose.dose}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Serif style={{ fontSize: 32, fontWeight: 600, color: B.brand, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', display: 'block', lineHeight: 1 }}>{nextDose.h}</Serif>
                <div style={{ fontSize: 11, color: B.textMuted, marginTop: 2, fontWeight: 600 }}>{proxGrupo?.label.toLowerCase()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progresso do dia — barra segmentada por dose */}
      <div style={{ margin: '0 20px 16px', padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.textMuted, letterSpacing: 0.3 }}>
            <span style={{ color: B.brand, fontWeight: 800 }}>{done}</span> de {doses.length} tomados hoje
          </div>
          <div style={{ fontSize: 12, color: B.textMuted, fontVariantNumeric: 'tabular-nums' }}>
            sequência <strong style={{ color: B.text }}>21 dias</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {doses.map(d => (
            <div key={d.id} style={{
              flex: 1, height: 8, borderRadius: 4,
              background: d.tomado ? B.success : '#EADFCE',
              transition: 'background .2s',
            }}/>
          ))}
        </div>
      </div>

      {/* Grupos */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 20px 130px' }}>
        {groups.map((g) => {
          const allDone = g.items.every(i => i.tomado) && g.items.length > 0;
          const someDone = g.items.filter(i => i.tomado).length;
          return (
            <div key={g.key} style={{ marginBottom: 22 }}>
              {/* Header do grupo — divisor editorial */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '0 2px' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 19,
                  background: g.acento + '18', color: g.acento,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <g.Icon size={20} stroke={2.2}/>
                </div>
                <div style={{ flex: 1 }}>
                  <Serif style={{ fontSize: 20, fontWeight: 600, color: B.text, letterSpacing: -0.3, display: 'block', lineHeight: 1.1 }}>
                    {g.label}
                  </Serif>
                  <div style={{ fontSize: 12, color: B.textMuted, marginTop: 2, fontWeight: 500 }}>
                    {g.items.length} {g.items.length === 1 ? 'remédio' : 'remédios'}
                    {someDone > 0 && !allDone && <> · <span style={{ color: B.success, fontWeight: 700 }}>{someDone} tomado</span></>}
                  </div>
                </div>
                {allDone && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: B.success, background: B.successBg, padding: '5px 10px', borderRadius: 99, display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${B.successBorder}`, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    <IcCheck size={12} stroke={3.5}/> Feito
                  </div>
                )}
              </div>

              {/* Cards de dose */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map((m) => (
                  <div key={m.id} style={{
                    background: m.tomado ? '#F8F5EE' : B.card,
                    border: `1px solid ${m.tomado ? '#E5DCC7' : B.border}`,
                    borderRadius: 20,
                    padding: '14px 14px 14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    position: 'relative',
                  }}>
                    {/* Indicador lateral de cor/status */}
                    <div style={{
                      position: 'absolute', left: 0, top: 16, bottom: 16, width: 3, borderRadius: 2,
                      background: m.tomado ? B.success : g.acento, opacity: 0.7,
                    }}/>

                    {/* Ícone do remédio */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: m.tomado ? '#FFFFFF' : '#FFF8EE',
                      border: `1px solid ${m.tomado ? '#E5DCC7' : B.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, filter: m.tomado ? 'saturate(0.5)' : 'none',
                    }}>
                      {medIcon(m.kind)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Serif style={{
                        fontSize: 19, fontWeight: 600, letterSpacing: -0.2, display: 'block',
                        color: m.tomado ? B.textMuted : B.text,
                        textDecoration: m.tomado ? 'line-through' : 'none',
                        textDecorationColor: m.tomado ? B.textFaint : 'none',
                        textDecorationThickness: 1.5,
                      }}>
                        {m.nome}
                      </Serif>
                      <div style={{ fontSize: 12.5, color: B.textMuted, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600 }}>{m.dose}</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span style={{ fontStyle: 'italic' }}>{m.quando}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button aria-label={m.tomado ? 'Desmarcar' : 'Marcar como tomado'} style={{
                      width: 54, height: 54, borderRadius: 16, border: 'none', flexShrink: 0, cursor: 'pointer',
                      background: m.tomado ? B.success : '#fff',
                      color: m.tomado ? '#fff' : B.brand,
                      boxShadow: m.tomado ? `0 2px 6px ${B.success}30` : `inset 0 0 0 1.5px ${B.brand}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .15s',
                    }}>
                      <IcCheck size={26} stroke={m.tomado ? 3.5 : 3}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 6, padding: '16px 18px', borderRadius: 20, border: `1.5px dashed ${B.borderStrong}`, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: B.textMuted, fontStyle: 'italic', fontFamily: B.font }}>
            Terminou o dia. Boa noite, Dona Neusa. 🌙
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 20px',
        background: `linear-gradient(to top, ${B.bg} 60%, ${B.bg}ee 85%, transparent)`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button style={{
          width: 56, height: 56, borderRadius: 28,
          border: `1px solid ${B.border}`, background: B.card, color: B.text,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IcCalendar size={20} stroke={2.2}/>
        </button>
        <button style={{
          flex: 1, height: 64, borderRadius: 32, border: 'none',
          background: B.brand, color: '#fff', fontWeight: 700, fontSize: 17,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: `0 10px 24px ${B.brand}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}>
          <IcPlus size={24} stroke={2.8}/>
          <span>Adicionar remédio</span>
        </button>
      </div>
    </BShell>
  );
};

Object.assign(window, { BStatus, BShell, Serif, BHome, medIcon });
