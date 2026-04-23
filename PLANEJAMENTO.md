# Meu Ajudante — Planejamento do PWA

> PWA para ajudar idosos a tomarem medicamentos na hora certa.
> Este documento é a memória do projeto: cole numa nova sessão do Claude Code para retomar o contexto.

---

## Contexto e objetivo

- **Nome**: Meu Ajudante
- **Público**: idosos (acessibilidade e clareza são prioridade)
- **Propósito**: lembrar e registrar a ingestão regular de medicamentos
- **Formato**: PWA instalável (Progressive Web App)
- **Repositório GitHub**: https://github.com/juliaojunior/meu-ajudante-byclaude
- **Deploy**: Vercel (auto-deploy do `main`)
- **Sem backend / sem auth** nesta v1 — dados locais no device

---

## Stack técnica

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS** (tokens da paleta "Rotina Ensolarada")
- **React 18**
- **Fontes**: Fraunces (serif editorial) + Plus Jakarta Sans (sans) via `next/font`
- **PWA**: `next-pwa` ou manifest + service worker manual
- **Persistência local**: `localStorage` para dados estruturados, IndexedDB para fotos

---

## Design system (tokens)

Paleta "Rotina Ensolarada" — terracota + sálvia + creme.
Migrar de `_reference/tokens.js` para `tailwind.config.ts`:

```
brand:         #C2410C   (terracota)
brandSoft:     #EA580C
brandBg:       #FFF1E7
brandBgSoft:   #FFF8F2
accent:        #B45309   (amber ochre)
success:       #4D7C0F   (sálvia)
successBg:     #F1F8EA
successBorder: #BEF264
danger:        #B91C1C
dangerBg:      #FEF2F2
text:          #1C1917
textMuted:     #57534E
textFaint:     #A8A29E
bg:            #FBF6EE   (creme quente)
surface:       #FFFFFF
card:          #FFFBF3
border:        #EADFCE
borderStrong:  #D6C6AA
```

**Tipografia**:
- `font-serif`: Fraunces (títulos editoriais, nomes de remédios, horários grandes)
- `font-sans`: Plus Jakarta Sans (corpo, labels, botões)

---

## Telas (baseadas em `mockups/versao01/`)

| # | Arquivo PNG | Rota | Componente | Descrição |
|---|---|---|---|---|
| 01 | tela01.png | `/` | Home | Saudação, próximo remédio (hero), progresso do dia, lista por refeição |
| 02 | tela02.png | `/adicionar` | NovoRemedio | Form: foto, nome, apelido, horários, botões Cancelar/Guardar |
| 03 | tela03.png | `/remedio/[id]` | DetalhesRemedio | Ficha do remédio, histórico, horários, alarme, sequência |
| 04 | tela04.png | `/remedio/[id]/editar` | EditarRemedio | Form em modo edição |
| 05 | tela05.png | modal | ConfirmarExclusao | Modal sobre Detalhes: "Remover X da lista?" |

**Fidelidade visual**: as telas devem ficar EXATAMENTE iguais aos PNGs (design aprovado). O código em `_reference/b-home.jsx` e `_reference/variation-b.jsx` já implementa essas telas em React inline-style — usar como base do porte.

---

## Estratégia de responsividade

Design original: 390×844 (iPhone 14).

- **Mobile-first**: design fiel aos PNGs em < 480px.
- **Desktop/tablet**: container centralizado com `max-width` ~420px simulando celular. Fundo neutro (ex: `bg` da paleta) ao redor.
- **Unidades**: `rem`/`%` onde possível para respeitar zoom do sistema (crítico para idosos).
- **Viewport**: `width=device-width, initial-scale=1, viewport-fit=cover`.
- **Safe areas**: usar `env(safe-area-inset-*)` para notch/home-indicator.
- **Áreas de toque**: mínimo 48×48 px.

---

## Estrutura de pastas proposta

```
meu-ajudante-byclaude/
├─ app/                           # App Router (Next.js)
│  ├─ layout.tsx                  # Fontes, metadata PWA, <html lang="pt-BR">
│  ├─ page.tsx                    # Home (tela 01)
│  ├─ adicionar/page.tsx          # Novo remédio (tela 02)
│  ├─ remedio/[id]/page.tsx       # Detalhes (tela 03)
│  ├─ remedio/[id]/editar/page.tsx # Editar (tela 04)
│  └─ globals.css
├─ components/
│  ├─ ui/
│  │  ├─ PhoneShell.tsx           # Container responsivo (max-w em desktop)
│  │  ├─ StatusBar.tsx            # Barra 07:48 • sinal • bateria
│  │  ├─ Serif.tsx                # Wrapper da fonte Fraunces
│  │  └─ Toggle.tsx
│  ├─ icons.tsx                   # Ícones SVG (migrados de icons.jsx)
│  ├─ home/
│  │  ├─ HeroProximo.tsx          # Card grande do próximo remédio
│  │  ├─ ProgressoDia.tsx         # Barra segmentada "X de Y tomados"
│  │  ├─ GrupoRefeicao.tsx        # Seção de café/almoço/jantar
│  │  └─ CardDose.tsx             # Card individual de remédio
│  ├─ remedio/
│  │  ├─ FormRemedio.tsx          # Form compartilhado add/edit
│  │  ├─ CampoFoto.tsx
│  │  ├─ CardHorario.tsx
│  │  └─ MedIcon.tsx              # Ícones de comprimido/cápsula
│  └─ modal/
│     └─ ConfirmarExclusao.tsx
├─ lib/
│  ├─ storage.ts                  # CRUD localStorage/IndexedDB
│  ├─ time.ts                     # "em 4h42min", próximo, saudação
│  ├─ streak.ts                   # Sequência de dias
│  └─ types.ts                    # Remedio, Horario, Tomada
├─ hooks/
│  ├─ useRemedios.ts
│  └─ useRelogio.ts               # Tick de 1 min
├─ public/
│  ├─ manifest.webmanifest
│  ├─ icons/                      # 192, 512, maskable, apple-touch-icon
│  └─ (service worker se manual)
├─ mockups/versao01/              # PNGs de referência (tela01-05)
├─ _reference/                    # JSX/tokens antigos (descartar depois)
├─ tailwind.config.ts
├─ next.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## Modelo de dados (draft)

```ts
type Periodo = 'manha' | 'almoco' | 'tarde' | 'noite';

type Horario = {
  hora: string;         // "07:30"
  refeicao: string;     // "Café da manhã"
  periodo: Periodo;
};

type Tomada = {
  data: string;         // "2026-04-22"
  horario: string;      // "07:30"
  tomadoEm: string;     // ISO
};

type Remedio = {
  id: string;
  nome: string;
  apelido?: string;
  dose: string;         // "50 mg · 1 comp."
  para?: string;        // "Para a pressão"
  kind: 'cap1' | 'cap2' | 'tab1' | 'tab2' | 'oval';
  fotoId?: string;      // ref pro IndexedDB
  horarios: Horario[];
  alarmeAtivo: boolean;
  tomadas: Tomada[];
  criadoEm: string;
};
```

---

## Fases de implementação

### Fase 0 — Setup (feito pelo usuário, fora do Claude Code)

1. Criar diretório `D:\Apps\MeuAjudante\versao_Claude_pwa`
2. Clonar repo vazio do GitHub
3. `npx create-next-app@latest . --typescript --tailwind --app --eslint --import-alias "@/*"`
4. Copiar `mockups/` e `_reference/` do diretório antigo
5. Primeiro commit + push
6. Conectar Vercel ao repo

### Fase 1 — Telas estáticas responsivas (fidelidade visual)

1. Configurar tokens no `tailwind.config.ts` (paleta completa)
2. Configurar fontes via `next/font` (Fraunces + Plus Jakarta Sans)
3. Criar `PhoneShell` (container responsivo)
4. Migrar ícones de `icons.jsx` → `components/icons.tsx` (TypeScript)
5. Portar Home (tela 01) pixel-próxima ao PNG, com dados mockados
6. Portar Adicionar (tela 02)
7. Portar Detalhes (tela 03)
8. Portar Editar (tela 04)
9. Modal Remover (tela 05) sobre Detalhes
10. Navegação real (`next/link`, `useRouter`)

**Critério de pronto**: as 5 telas idênticas aos PNGs, navegáveis, deploy Vercel funcionando.

### Fase 2 — PWA de verdade

1. `manifest.webmanifest` (nome "Meu Ajudante", theme `#C2410C`, bg `#FBF6EE`, display standalone, orientação portrait)
2. Ícones PWA (192, 512, maskable, apple-touch-icon)
3. Service worker (cache offline) — via `next-pwa`
4. Meta tags iOS (`apple-mobile-web-app-capable` etc.)
5. Testar "Adicionar à tela inicial" em Android + iOS

### Fase 3 — Estado e lógica real

1. `lib/types.ts` — interfaces do domínio
2. `lib/storage.ts` — CRUD em localStorage
3. `lib/time.ts` — relógio, "próximo", "em Xh Ymin", saudação dinâmica
4. `lib/streak.ts` — sequência de dias
5. Home passa a refletir dados reais
6. Cadastro persiste remédio novo
7. Editar altera; Remover apaga (com confirmação do modal)
8. Marcar/desmarcar dose funcional com persistência
9. Recalcular progresso do dia em tempo real

### Fase 4 — Hardware e notificações

1. Foto da caixa via `<input type="file" capture="environment">`
2. Armazenar fotos em IndexedDB (localStorage não serve para binários)
3. Notifications API para lembretes (ressalva: iOS PWA tem limitações em background)
4. Som suave + vibração quando der a hora (com app aberto)

### Fase 5 — Polimento

1. Microanimações (check ao marcar, modal slide-up, transições)
2. Estados vazios (sem remédios cadastrados ainda)
3. Revisão de acessibilidade (ARIA labels, foco, contrastes AA/AAA)
4. Opção "texto ainda maior" para idosos com baixa visão
5. Teste em dispositivos reais (iOS Safari + Android Chrome)

---

## Decisões já tomadas

- ✅ Next.js 14+ App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Sem backend / sem auth na v1
- ✅ Dados locais (localStorage + IndexedDB para fotos)
- ✅ Deploy Vercel via GitHub
- ✅ Responsivo: mobile-first com container ~420px centralizado em desktop
- ✅ Descartar o "design canvas" antigo (era só para visualização dos mockups)
- ✅ Manter JSX/tokens antigos em `_reference/` apenas como referência durante o porte

---

## Referências no repo

- `mockups/versao01/tela01-05.png` — **fonte da verdade visual**
- `_reference/b-home.jsx` — implementação React da Home (inline styles)
- `_reference/variation-b.jsx` — Add, Details, Edit, DeleteModal
- `_reference/icons.jsx` — set de ícones lucide-like
- `_reference/tokens.js` — tokens B_TOKENS (base do Tailwind config)

---

## Próximo passo

Fase 1 — começar portando:

1. `tailwind.config.ts` com os tokens
2. `app/layout.tsx` com fontes e metadata
3. `components/icons.tsx`
4. `components/ui/PhoneShell.tsx`
5. `app/page.tsx` — Home fiel ao `mockups/versao01/tela01.png`

---

## Prompt para retomar no Claude Code

Cole isto numa nova sessão para o Claude pegar o contexto:

> Estou desenvolvendo o PWA "Meu Ajudante" — um app para ajudar idosos a tomar medicamentos. Stack: Next.js 14 App Router + TypeScript + Tailwind, deploy Vercel, sem backend. Leia o `PLANEJAMENTO.md` na raiz do projeto para contexto completo. As telas devem ficar EXATAMENTE iguais aos PNGs em `mockups/versao01/`. Vamos começar pela Fase 1: configurar tokens do Tailwind, fontes, PhoneShell e portar a Home (tela01). O código de referência está em `_reference/`.
