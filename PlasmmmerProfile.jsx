// 🧙‍♀️ PlasmmmerProfile.jsx
// Card de identidade Plasmmer pós-login
// Mostra: avatar Bluesky, handle, ETH address derivada, ações

'use client'
import { useState, useCallback } from 'react'

// ─── Ícones inline (sem dependência extra) ───────────────────────────────────

function IconCopy({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function IconExternalLink({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

function IconLogOut({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function IconArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

// ─── Avatar com fallback em gradiente ────────────────────────────────────────

function Avatar({ src, displayName, size = 48 }) {
  const [imgError, setImgError] = useState(false)

  // Iniciais do nome (até 2 letras)
  const initials = displayName
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={`Avatar de ${displayName}`}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255,255,255,0.8)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'block',
          flexShrink: 0,
        }}
      />
    )
  }

  // Fallback: iniciais em fundo plasma gradient
  return (
    <div
      aria-label={`Avatar de ${displayName}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #06B6D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: size * 0.33,
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}

// ─── Badge da Ethereum Wallet ─────────────────────────────────────────────────

function WalletBadge({ ethAddress }) {
  const [copied, setCopied] = useState(false)

  // Trunca: 0x1a2b...9f0c
  const truncated = ethAddress
    ? `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`
    : '—'

  const handleCopy = useCallback(async () => {
    if (!ethAddress) return
    try {
      await navigator.clipboard.writeText(ethAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback pra browsers sem clipboard API
      const el = document.createElement('textarea')
      el.value = ethAddress
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [ethAddress])

  const etherscanUrl = ethAddress
    ? `https://etherscan.io/address/${ethAddress}`
    : '#'

  return (
    <div style={styles.walletSection}>
      {/* Label */}
      <span style={styles.walletLabel}>Ethereum Wallet</span>

      {/* Address + ações */}
      <div style={styles.walletRow}>
        {/* Ícone ETH */}
        <span style={styles.ethIcon} aria-hidden="true">⬡</span>

        {/* Address truncada */}
        <span
          style={styles.walletAddress}
          title={ethAddress}
          aria-label={`Ethereum address: ${ethAddress}`}
        >
          {truncated}
        </span>

        {/* Botão copiar */}
        <button
          onClick={handleCopy}
          style={{
            ...styles.iconButton,
            color: copied ? '#10B981' : '#9CA3AF',
          }}
          aria-label={copied ? 'Copiado!' : 'Copiar endereço Ethereum'}
          title={copied ? 'Copiado! ✅' : 'Copiar'}
        >
          {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
        </button>

        {/* Link Etherscan */}
        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.iconButton}
          aria-label="Ver no Etherscan"
          title="Ver no Etherscan"
        >
          <IconExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}

// ─── Componente principal: PlasmmmerProfile ───────────────────────────────────

/**
 * @param {object} props
 * @param {object} props.user          - dados da sessão Plasmmer
 * @param {string} props.user.did      - DID Bluesky (did:plc:...)
 * @param {string} props.user.handle   - handle Bluesky (ex: perla.bsky.social)
 * @param {string} props.user.displayName
 * @param {string} [props.user.avatar] - URL do avatar Bluesky
 * @param {string} props.user.ethAddress - endereço ETH derivado pelo WaaP
 * @param {function} [props.onSignOut]   - callback ao fazer sign out
 * @param {function} [props.onDashboard] - callback pro dashboard
 * @param {string} [props.className]
 */
export default function PlasmmmerProfile({
  user,
  onSignOut,
  onDashboard,
  className = '',
}) {
  const [signingOut, setSigningOut] = useState(false)
  const [hoverCard, setHoverCard] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      // Deleta cookie de sessão via API
      await fetch('/api/auth/signout', { method: 'POST' })
      onSignOut?.()
    } catch (err) {
      console.error('❌ Erro ao deslogar:', err)
      setSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <article
      className={className}
      onMouseEnter={() => setHoverCard(true)}
      onMouseLeave={() => setHoverCard(false)}
      style={{
        ...styles.card,
        boxShadow: hoverCard
          ? '0 4px 24px rgba(0,0,0,0.10), 0 12px 40px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        transform: hoverCard ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
      }}
      aria-label={`Perfil Plasmmer de ${user.displayName}`}
    >
      {/* ── Seção: identidade Bluesky ── */}
      <div style={styles.identityRow}>
        <Avatar
          src={user.avatar}
          displayName={user.displayName}
          size={48}
        />

        <div style={styles.identityText}>
          <span style={styles.displayName}>{user.displayName}</span>
          <span style={styles.handle}>
            @{user.handle}
            {/* Badge Bluesky */}
            <span style={styles.bskyBadge} aria-label="Verificado no Bluesky">
              🦋
            </span>
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={styles.divider} role="separator" />

      {/* ── Seção: wallet ETH ── */}
      <WalletBadge ethAddress={user.ethAddress} />

      {/* ── Divider ── */}
      <div style={styles.divider} role="separator" />

      {/* ── Rodapé: ações ── */}
      <div style={styles.footer}>
        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={styles.signOutBtn}
          aria-label="Sair da conta Plasmmer"
          onMouseEnter={e => {
            e.currentTarget.style.color = '#EF4444'
            e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#9CA3AF'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <IconLogOut size={15} />
          {signingOut ? 'Saindo...' : 'Sign out'}
        </button>

        {/* Dashboard */}
        <button
          onClick={onDashboard}
          style={styles.dashboardBtn}
          aria-label="Ir para o Dashboard"
          onMouseEnter={e => {
            e.currentTarget.style.background = '#6D28D9'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#7C3AED'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(124,58,237,0.25)'
          }}
        >
          Dashboard
          <IconArrowRight size={14} />
        </button>
      </div>
    </article>
  )
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = {
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.07)',
    padding: '20px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  // Identidade
  identityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 16,
  },
  identityText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0, // truncamento funcionar
  },
  displayName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  handle: {
    fontSize: 13,
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bskyBadge: {
    fontSize: 12,
  },

  // Divider
  divider: {
    height: 1,
    background: '#F3F4F6',
    marginLeft: -20,
    marginRight: -20,
    marginBottom: 14,
    marginTop: 0,
  },

  // Wallet
  walletSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingBottom: 14,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  walletRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  ethIcon: {
    fontSize: 16,
    color: '#627EEA', // cor do ETH
    lineHeight: 1,
  },
  walletAddress: {
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    flex: 1,
    letterSpacing: '0.02em',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: '#9CA3AF',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    flexShrink: 0,
  },

  // Footer
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  dashboardBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 9999,
    border: 'none',
    background: '#7C3AED',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
    fontFamily: 'inherit',
  },
}
