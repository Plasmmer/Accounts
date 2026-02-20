🌈# 🧙‍♀️ Sign in with Plasmmer Accounts — Guia Técnico para Codex

🌈## Objetivo

Criar um fluxo de autenticação Web3 chamado **"Sign in with Plasmmer Accounts"** que:
1. Autentica o usuário via conta **Bluesky** (AT Protocol OAuth)
2. Deriva uma **carteira Ethereum** de forma não-custodial usando o **WaaP.xyz SDK**
3. Retorna uma **Plasmmer Identity** — identidade composta por DID Bluesky + ETH address

Pense nisso como um "Sign in with Google", mas onde o Google é substituído pelo Bluesky descentralizado, e em vez de um ID de sessão, vc recebe uma carteira Ethereum real, que vc realmente possui. 🔐

---

🌈## Stack

- **Next.js** (App Router, `app/`) — compatível com Vercel
- **WaaP.xyz SDK** — derivação de wallet não-custodial
- **AT Protocol** (`@atproto/api`) — login Bluesky + DID resolution
- **jose** — geração e validação de JWT da sessão Plasmmer
- **Tailwind CSS** — estilos rápidos
- **Ethers.js v6** — interações ETH opcionais no frontend

---

🌈## Estrutura de Pastas

```
plasmmer-sign-in/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── bluesky/route.js        🌈# inicia OAuth Bluesky
│   │   │   └── callback/route.js       🌈# callback OAuth, recebe code+DID
│   │   ├── waap/
│   │   │   └── derive/route.js         🌈# deriva wallet via WaaP SDK (server-side)
│   │   └── session/route.js            🌈# valida sessão Plasmmer (JWT)
│   ├── layout.jsx
│   └── page.jsx                        🌈# landing com botão Sign in
├── components/
│   ├── SignInButton.jsx                 🌈# botão principal
│   ├── PlasmmmerProfile.jsx            🌈# card de perfil pós-login
│   └── WalletBadge.jsx                 🌈# exibe ETH address derivada
├── lib/
│   ├── atproto.js                      🌈# helpers AT Protocol
│   ├── waap.js                         🌈# wrapper WaaP SDK
│   └── session.js                      🌈# JWT Plasmmer (sign/verify)
├── .env.local                          🌈# NUNCA commitar
└── middleware.js                       🌈# proteção de rotas privadas
```

---

🌈## .env.local

```env
🌈# 🔐 AT Protocol / Bluesky OAuth
BLUESKY_CLIENT_ID=https://seu-dominio.vercel.app/api/auth/bluesky
BLUESKY_CLIENT_SECRET=seu_client_secret_aqui
BLUESKY_REDIRECT_URI=https://seu-dominio.vercel.app/api/auth/callback

🌈# 🔐 WaaP.xyz
WAAP_API_KEY=sua_waap_api_key_aqui
WAAP_APP_ID=plasmmer

🌈# 🔐 JWT sessão Plasmmer
PLASMMER_JWT_SECRET=string_secreta_muito_longa_e_aleatoria_aqui
PLASMMER_JWT_EXPIRY=7d

🌈# 🌐 URL base
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

---

🌈## Fluxo de Autenticação (passo a passo)

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO COMPLETO                            │
│                                                             │
│  1. User clica em "Sign in with Plasmmer"                   │
│  2. → /api/auth/bluesky → redireciona ao Bluesky OAuth      │
│  3. User loga no Bluesky, autoriza o app                    │
│  4. → /api/auth/callback → recebe `code` + `iss` (DID)     │
│  5. Backend troca code por tokens AT Protocol               │
│  6. Resolve DID → pega handle + avatar + displayName        │
│  7. Chama /api/waap/derive com o DID como identifier        │
│  8. WaaP SDK cria/recupera wallet ETH ligada ao DID         │
│  9. Backend assina JWT Plasmmer com { did, ethAddress }     │
│  10. Cookie seguro é setado                                 │
│  11. Frontend renderiza PlasmmmerProfile 🎉                 │
└─────────────────────────────────────────────────────────────┘
```

---

🌈## lib/atproto.js

```javascript
// 🔵 Helpers AT Protocol — resolve DID e perfil Bluesky
import { AtpAgent } from '@atproto/api'

const BSKY_SERVICE = 'https://bsky.social'

/**
 * Resolve DID → dados do perfil (handle, displayName, avatar)
 * @param {string} did - ex: did:plc:abc123
 */
export async function resolveProfile(did) {
  const agent = new AtpAgent({ service: BSKY_SERVICE })

  const res = await agent.getProfile({ actor: did })
  const { handle, displayName, avatar } = res.data

  return { did, handle, displayName: displayName || handle, avatar: avatar || null }
}

/**
 * Gera URL de autorização OAuth Bluesky
 * Bluesky usa PAR (Pushed Authorization Request) + DPoP
 */
export function buildBlueskyAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.BLUESKY_CLIENT_ID,
    redirect_uri: process.env.BLUESKY_REDIRECT_URI,
    response_type: 'code',
    scope: 'atproto transition:generic',
    state,
  })

  return `${BSKY_SERVICE}/oauth/authorize?${params.toString()}`
}
```

---

🌈## lib/waap.js

```javascript
// 🔮 WaaP SDK wrapper — deriva wallet ETH a partir de um DID
// Ref: https://waap.xyz/docs

/**
 * Deriva ou recupera uma wallet Ethereum para um dado DID Bluesky.
 * WaaP usa 2PC-MPC: a chave NUNCA é reconstruída inteiramente.
 * 
 * @param {string} did - DID do usuário no Bluesky (ex: did:plc:abc123)
 * @returns {Promise<{ ethAddress: string, walletId: string }>}
 */
export async function deriveWalletFromDID(did) {
  // WaaP aceita um identifier externo para criar/recuperar wallets
  // O DID é determinístico: mesmo DID → mesma wallet
  const response = await fetch('https://api.waap.xyz/v1/wallet/derive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.WAAP_API_KEY,
      'x-app-id': process.env.WAAP_APP_ID,
    },
    body: JSON.stringify({
      identifier: did,          // DID como seed de identidade
      identifierType: 'custom', // provider externo (não Google/Twitter)
      chain: 'evm',             // queremos carteira Ethereum
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`WaaP error: ${err.message || response.statusText}`)
  }

  const { walletId, address } = await response.json()
  return { ethAddress: address, walletId }
}
```

---

🌈## lib/session.js

```javascript
// 🔐 JWT de sessão Plasmmer — assina e verifica
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.PLASMMER_JWT_SECRET)

/**
 * Cria um JWT de sessão Plasmmer
 * @param {{ did, ethAddress, handle, displayName, avatar }} payload
 */
export async function createSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.PLASMMER_JWT_EXPIRY || '7d')
    .setIssuer('plasmmer')
    .sign(SECRET)
}

/**
 * Verifica e decodifica um JWT Plasmmer
 * @param {string} token
 */
export async function verifySession(token) {
  const { payload } = await jwtVerify(token, SECRET, { issuer: 'plasmmer' })
  return payload
}
```

---

🌈## app/api/auth/bluesky/route.js

```javascript
// 🟦 Inicia fluxo OAuth Bluesky
import { buildBlueskyAuthUrl } from '@/lib/atproto'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  // Gera state aleatório anti-CSRF
  const state = crypto.randomBytes(16).toString('hex')

  const authUrl = buildBlueskyAuthUrl(state)

  // Salva state num cookie temporário pra validar no callback
  const res = NextResponse.redirect(authUrl)
  res.cookies.set('bsky_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutos pra completar o login
  })

  return res
}
```

---

🌈## app/api/auth/callback/route.js

```javascript
// 🔄 Callback OAuth Bluesky → deriva wallet → cria sessão Plasmmer
import { NextResponse } from 'next/server'
import { resolveProfile } from '@/lib/atproto'
import { deriveWalletFromDID } from '@/lib/waap'
import { createSession } from '@/lib/session'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const iss = searchParams.get('iss') // DID do usuário

  // Valida state anti-CSRF
  const cookieState = req.cookies.get('bsky_oauth_state')?.value
  if (!cookieState || cookieState !== state) {
    return NextResponse.json({ error: 'State inválido ⚠️' }, { status: 400 })
  }

  try {
    // 1️⃣ Troca code por tokens AT Protocol (simplificado)
    const tokenRes = await fetch('https://bsky.social/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.BLUESKY_REDIRECT_URI,
        client_id: process.env.BLUESKY_CLIENT_ID,
        client_secret: process.env.BLUESKY_CLIENT_SECRET,
      }),
    })

    // iss retornado pelo Bluesky é o DID do usuário
    const did = iss || (await tokenRes.json()).sub

    // 2️⃣ Busca perfil Bluesky
    const profile = await resolveProfile(did)

    // 3️⃣ Deriva wallet ETH via WaaP
    const { ethAddress, walletId } = await deriveWalletFromDID(did)

    // 4️⃣ Cria JWT de sessão Plasmmer
    const token = await createSession({
      did: profile.did,
      handle: profile.handle,
      displayName: profile.displayName,
      avatar: profile.avatar,
      ethAddress,
      walletId,
    })

    // 5️⃣ Seta cookie de sessão + redireciona pro dashboard
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
    res.cookies.delete('bsky_oauth_state')
    res.cookies.set('plasmmer_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return res
  } catch (err) {
    console.error('❌ Erro no callback Plasmmer:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
```

---

🌈## app/api/session/route.js

```javascript
// 👤 Retorna dados da sessão atual (pra usar no frontend)
import { verifySession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const token = req.cookies.get('plasmmer_session')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const session = await verifySession(token)
    return NextResponse.json({ authenticated: true, user: session })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
```

---

🌈## components/SignInButton.jsx

```jsx
// 🔵 Botão "Sign in with Plasmmer Accounts"
'use client'
import { useState } from 'react'

export default function SignInButton() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = () => {
    setLoading(true)
    // Redireciona pro flow Bluesky
    window.location.href = '/api/auth/bluesky'
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="plasmmer-signin-btn"
      aria-label="Sign in with Plasmmer Accounts"
    >
      {loading ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        <>
          {/* Logo Plasmmer (SVG inline ou <Image />) */}
          <PlasmmerIcon />
          <span>Sign in with Plasmmer</span>
        </>
      )}
    </button>
  )
}

function PlasmmerIcon() {
  // Substituir pelo logo real da Plasmmer
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  )
}
```

---

🌈## middleware.js

```javascript
// 🛡️ Protege rotas que exigem login Plasmmer
import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'

// Rotas que exigem autenticação
const PROTECTED = ['/dashboard', '/wallet', '/dao']

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('plasmmer_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    await verifySession(token)
    return NextResponse.next()
  } catch {
    // Token inválido/expirado → redireciona pro login
    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.delete('plasmmer_session')
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/wallet/:path*', '/dao/:path*'],
}
```

---

🌈## package.json (dependências relevantes)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@atproto/api": "^0.13.0",
    "jose": "^5.9.0",
    "ethers": "^6.13.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

🌈## Instruções para o Codex

1. **Estruture o projeto** com `npx create-next-app@latest plasmmer-signin --app --tailwind --src-dir=false`
2. **Instale as dependências** acima
3. **Crie os arquivos** exatamente nos caminhos indicados
4. **Preencha .env.local** com as keys reais (NUNCA commitar)
5. **O WaaP SDK** ainda não tem pacote npm oficial — usar o endpoint REST `/v1/wallet/derive` como mostrado em `lib/waap.js`, até o SDK ser publicado
6. **O Bluesky OAuth** usa PAR + DPoP em produção — o trecho de callback é simplificado; para produção, usar a biblioteca oficial `@atproto/oauth-client-node`
7. **Teste localmente** com `next dev` e ngrok para o redirect URI
8. **Deploy** direto no Vercel com as env vars configuradas no painel

---

🌈## Segurança — checklist obrigatório

- [ ] State CSRF validado no callback ✅
- [ ] Cookies com `httpOnly`, `secure`, `sameSite` ✅
- [ ] JWT assinado com secret forte (32+ chars) ✅
- [ ] WaaP key nunca exposta no frontend ✅
- [ ] Middleware protegendo rotas privadas ✅
- [ ] DID validado antes de derivar wallet ✅
- [ ] Rate limiting no `/api/auth/callback` (recomendado: upstash/ratelimit)
