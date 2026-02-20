🌈# 🎨 Sign in with Plasmmer Accounts — Guia UX & GUI Design para Manus AI

🌈## Briefing

Criar a interface de autenticação **"Sign in with Plasmmer Accounts"** — o equivalente Web3 do "Sign in with Google".

O design deve transmitir:
- **Confiança** como a Apple
- **Clareza** como o Google
- **Modernidade** como o Linear / Vercel
- **Identidade própria** — Plasmmer tem personalidade, não é clone de bigtech

A estética é: **sleek, redondo, limpo, com alma Web3 sutil** — sem parecer cripto brega ou NFT de macaco. 🎯

---

🌈## 🎨 Design System

🌈### Paleta de Cores

```
🌈## Primárias
--plasma-purple:    #7C3AED   (Violet-600) — cor principal da marca
--plasma-violet:    #8B5CF6   (Violet-500) — hover/destaque
--plasma-indigo:    #6366F1   (Indigo-500) — gradiente secundário

🌈## Neutros
--plasma-white:     #FFFFFF
--plasma-gray-50:   #F9FAFB   — backgrounds de card
--plasma-gray-100:  #F3F4F6   — borders sutis
--plasma-gray-400:  #9CA3AF   — texto secundário
--plasma-gray-800:  #1F2937   — texto principal
--plasma-black:     #0D0D0D   — fundo dark mode

🌈## Gradiente signature
background: linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #06B6D4 100%);

🌈## Semânticas
--success:  #10B981   (Emerald-500)
--warning:  #F59E0B   (Amber-500)
--error:    #EF4444   (Red-500)
```

🌈### Tipografia

```
Font principal:   Inter (Google Fonts) — ou Geist se for Next.js
Font monospace:   JetBrains Mono — para endereços ETH

Escala:
--text-xs:    12px / 16px line-height
--text-sm:    14px / 20px
--text-base:  16px / 24px
--text-lg:    18px / 28px
--text-xl:    20px / 28px
--text-2xl:   24px / 32px
--text-3xl:   30px / 36px

Pesos:
Regular:    400 — corpo de texto
Medium:     500 — labels, botões secundários
Semibold:   600 — botões, títulos de seção
Bold:       700 — títulos principais
```

🌈### Border Radius

```
--radius-sm:   8px    — inputs, badges
--radius-md:   12px   — cards pequenos, tooltips
--radius-lg:   16px   — cards principais
--radius-xl:   24px   — modais, painéis
--radius-2xl:  32px   — botão principal (pill)
--radius-full: 9999px — avatares, chips, loader
```

🌈### Sombras

```css
/* Card padrão */
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);

/* Card elevado (hover) */
box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.08);

/* Botão primário (glow plasma) */
box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
/* no hover: */
box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);

/* Modal overlay */
box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04);
```

---

🌈## 📱 Componentes — Especificações

🌈### 1. Botão Principal — "Sign in with Plasmmer"

Inspiração: botão "Sign in with Google" mas com personalidade.

```
Tamanho:      height: 52px, min-width: 220px, max-width: 320px
Border-radius: 9999px (pill completo)
Padding:      0 24px
Gap:          12px entre ícone e texto

Estado default:
  background: white
  border: 1.5px solid #E5E7EB
  color: #1F2937
  shadow: 0 1px 3px rgba(0,0,0,0.08)

Estado hover:
  background: #F9FAFB
  border: 1.5px solid #D1D5DB
  shadow: 0 4px 16px rgba(0,0,0,0.10)
  transform: translateY(-1px)
  transition: all 0.2s ease

Estado loading:
  background: #F9FAFB
  border: 1.5px solid #E5E7EB
  cursor: not-allowed
  → Spinner animado substitui ícone (tamanho 20px)

Estado focus (acessibilidade):
  outline: 2px solid #7C3AED
  outline-offset: 2px

Ícone Plasmmer:
  Tamanho: 24x24px
  Formato: SVG inline (evitar flash de carregamento)
  Deve ser reconhecível em 20px

Texto:
  "Continue with Plasmmer" ← preferir sobre "Sign in"
  Font: Inter Semibold (600), 15px
  Color: #1F2937
```

**Variante dark:**
```
background: rgba(255,255,255,0.06)
border: 1px solid rgba(255,255,255,0.12)
color: white
hover: rgba(255,255,255,0.10)
```

---

🌈### 2. Modal de Autenticação

Quando o usuário clica no botão, abre um modal (não redireciona abruptamente).

```
Overlay:
  background: rgba(0,0,0,0.5)
  backdrop-filter: blur(4px)
  transition: opacity 0.2s ease

Modal container:
  width: 440px (desktop) / 100% com margin 16px (mobile)
  border-radius: 24px
  background: white (light) / #18181B (dark)
  padding: 32px
  shadow: 0 20px 60px rgba(0,0,0,0.15)
  animation: scale 0.2s ease + fade-in

Estrutura interna (de cima pra baixo):
  1. Ícone Plasmmer centralizado (48x48px)
  2. Título: "Connect your identity" (text-xl, bold)
  3. Subtítulo: "Sign in with Bluesky to get your Plasmmer account" (text-sm, gray-500)
  4. Divider com gap 20px
  5. Botão Bluesky (único provider por ora)
  6. Gap 16px
  7. Texto legal: "By continuing, you agree to Plasmmer's Terms" (text-xs, gray-400, center)
  8. Botão "×" no canto superior direito (40x40px, border-radius: full)
```

---

🌈### 3. Botão Bluesky (dentro do modal)

```
height: 48px
border-radius: 16px
background: #0085FF (azul Bluesky)
color: white
padding: 0 20px
gap: 10px
font: Inter Medium, 14px

Ícone: Butterfly logo do Bluesky, 22x22px, branco

hover:
  background: #0077E6
  transform: translateY(-1px)

Texto: "Continue with Bluesky"
```

---

🌈### 4. Loading State — Derivação da Wallet

Depois que o usuário autoriza no Bluesky, mostrar estado de carregamento enquanto o WaaP deriva a wallet.

```
Layout: mesmo modal, conteúdo substitui botões

Elementos:
  1. Ícone animado — orb plasma girando (SVG animado)
     → Círculo com gradiente plasma: violet → indigo → cyan
     → animation: spin 1.5s linear infinite
     → size: 64x64px

  2. Texto de status (vai mudando a cada etapa):
     "Connecting to Bluesky..."   → azul
     "Resolving your identity..." → violeta
     "Deriving your wallet..."    → indigo
     "Almost there... ✨"         → verde

  3. Progress indicator sutil:
     → 4 dots em linha, o ativo pulsa
     → dot size: 8px, gap: 6px, border-radius: full

Duração média esperada: 2-4 segundos
NÃO usar spinner genérico de OS — criar o orb plasma
```

---

🌈### 5. Card de Perfil Plasmmer (pós-login)

O que aparece quando o usuário já está autenticado.

```
Tamanho: width 100%, max-width 360px
Border-radius: 20px
Background: white / dark #1C1C1E
Border: 1px solid rgba(0,0,0,0.06)
Shadow: card padrão
Padding: 24px

Elementos (de cima pra baixo):

  ┌─────────────────────────────────────┐
  │  [Avatar 48px]  Display Name        │
  │                 @handle.bsky.social  │
  │                                     │
  │  ─────────────────────────────────  │
  │                                     │
  │  🔷 Ethereum Wallet                 │
  │  0x1a2b...9f0c     [Copy] [Etherscan]│
  │                                     │
  │  ─────────────────────────────────  │
  │                                     │
  │  [Sign Out]          [Dashboard →]  │
  └─────────────────────────────────────┘

Avatar:
  → Foto do perfil Bluesky
  → border-radius: full
  → Fallback: initials em fundo plasma-gradient
  → size: 48x48px, border: 2px solid white, shadow sutil

Display Name: text-base bold, gray-800
Handle: text-sm, gray-400, prefixado com @

Ethereum Wallet badge:
  → Label: "Ethereum Wallet" (text-xs, gray-400, uppercase, letter-spacing: 0.05em)
  → Address: font JetBrains Mono, text-sm, gray-700
  → Mostra truncado: 0x1a2b...9f0c (6 chars + ... + 4 chars)
  → Botão Copy: ícone 16px, ghost, tooltip "Copied! ✅" ao clicar
  → Link Etherscan: ícone external-link 14px, ghost

Botões rodapé:
  Sign Out: text-sm, ghost, red-400 no hover
  Dashboard: text-sm, primary, border-radius: full, compact
```

---

🌈### 6. Toast de Sucesso

Aparece quando o login é concluído com sucesso.

```
Position: top-center, margin-top: 16px
Width: auto, max-width: 360px
Border-radius: 16px
Background: #0D0D0D (dark) / white (light)
Border: 1px solid rgba(255,255,255,0.08)
Shadow: 0 8px 32px rgba(0,0,0,0.12)
Padding: 12px 16px
Gap: 10px

Elementos em linha:
  → Ícone ✅ (20px, emerald-500)
  → Texto: "Welcome, [DisplayName]! Wallet ready 🔮"
  → Font: Inter Medium, 14px
  → Botão × (ghost, 16px)

Animation:
  → Entra: slide-down + fade-in, 0.3s spring
  → Sai: fade-out, 0.2s ease, após 4 segundos
```

---

🌈## 📐 Layout — Página de Login

```
Estrutura (desktop):
┌─────────────────────────────────────────────────────────────┐
│                    Header: Logo Plasmmer                    │
├───────────────────────────┬─────────────────────────────────┤
│                           │                                 │
│    Hero Text (esquerda)   │   Auth Card (direita)           │
│                           │                                 │
│  "Your identity,          │  ┌─────────────────────────┐   │
│   on-chain."              │  │   Continue with         │   │
│                           │  │   Plasmmer Accounts     │   │
│  "Sign in with your       │  │                         │   │
│   Bluesky account and     │  │  [Continue with         │   │
│   get your Ethereum       │  │   Bluesky 🦋]           │   │
│   wallet — derived        │  │                         │   │
│   from your identity."    │  │  Terms · Privacy        │   │
│                           │  └─────────────────────────┘   │
│   [Saiba mais ↓]          │                                 │
│                           │                                 │
└───────────────────────────┴─────────────────────────────────┘

Mobile: coluna única, auth card no topo, hero embaixo
```

---

🌈## ✨ Microinterações — Checklist

Manus deve implementar estas animações sutis:

- [ ] **Botão Sign in**: `transform: translateY(-1px)` no hover (não mais que isso)
- [ ] **Modal**: `scale(0.96) → scale(1)` + `opacity: 0 → 1` em 200ms spring
- [ ] **Orb de loading**: rotation contínua com gradient conic
- [ ] **Texto de status**: fade-in/out suave ao trocar mensagem (150ms)
- [ ] **Copy ETH address**: ícone muda pra ✅ por 2s, depois volta
- [ ] **Toast**: spring bounce na entrada, fade na saída
- [ ] **Avatar fallback**: gradient animado enquanto a imagem carrega (skeleton)
- [ ] **Botão Bluesky**: scale 0.98 no press (active state)

**REGRA DE OURO**: Nenhuma animação deve durar mais de 300ms. Se precisar de mais, revisar o design.

---

🌈## ♿ Acessibilidade — Obrigatório

- Todos os botões com `aria-label` descritivo
- Modal com `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Foco retorna ao botão trigger ao fechar modal
- Tab order lógico dentro do modal
- Contraste mínimo: 4.5:1 pra texto normal, 3:1 pra texto grande
- Loading state com `aria-live="polite"` pra screen readers
- ETH address com `aria-label="Ethereum address: 0x..."` completo

---

🌈## 🌙 Dark Mode

Ativar automaticamente via `prefers-color-scheme`.

```
Tokens de dark mode:
  Background app:     #0D0D0D
  Background card:    #18181B
  Background modal:   #1C1C1E
  Border sutil:       rgba(255,255,255,0.08)
  Texto principal:    #F9FAFB
  Texto secundário:   #9CA3AF
  Botão sign in:      rgba(255,255,255,0.06) borda rgba(255,255,255,0.12)
  Toast bg:           #18181B
```

---

🌈## 📏 Responsividade

```
Breakpoints:
  mobile:  < 640px
  tablet:  640px - 1024px
  desktop: > 1024px

Adaptações mobile:
  → Modal: bottom sheet (desliza de baixo) em vez de centro
  → Botão Sign in: width 100%
  → Card profile: full width, padding reduzido
  → Texto ETH: quebra em duas linhas se necessário
```

---

🌈## 🔮 Referências Visuais — O que estudar

Para o Manus produzir o design correto, estudar estas referências:

| Referência | O que absorver |
|---|---|
| Linear.app | Sidebar, border-radius, shadow sutis |
| Vercel.com | Cards limpos, tipografia Inter |
| Clerk.dev | Flow de autenticação, modal |
| Sign in with Google | Proporção e simplicidade do botão |
| Raycast.app | Dark mode e micro-animações |
| Apple ID login | Confiança, espaço em branco |
| Rainbow Wallet | Identidade forte Web3 sem ser brega |

**Evitar**: Tons de neon exagerado, glassmorphism abusivo, gradientes arco-íris berrantes — a Plasmmer é sofisticada, não uma exchange de 2017.
