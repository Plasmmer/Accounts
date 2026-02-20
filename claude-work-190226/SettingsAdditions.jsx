// 🧙‍♀️ SettingsAdditions.jsx
// Novas seções pra SettingsPage:
//   • SectionSubscriptions — assinaturas on-chain como NFTs de acesso
//   • SectionDevices       — dispositivos registrados como NFTs (dGen/ethOS style)
//   • SectionSocialGraph   — integrações: Lens, Farcaster, Fediverse
//
// Como usar: importar e adicionar ao NAV + sectionMap do SettingsPage.jsx
// (ver comentário no final deste arquivo)

'use client'
import { useState } from 'react'
import './settings-additions.css'

// ─── Ícones inline ────────────────────────────────────────────────────────

const Ico = {
  subscriptions: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  devices:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  socialgraph:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  nft:           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 19 6.5 19 17.5 12 22 5 17.5 5 6.5 12 2"/><line x1="12" y1="22" x2="12" y2="12"/><path d="M19 6.5L12 12 5 6.5"/></svg>,
  refresh:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  shield:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z"/></svg>,
  wifi:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  external:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  trash:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  link:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  unlink:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  copy:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
}

// ─── CopyButton (mini, reutilizável) ─────────────────────────────────────

function CopyBtn({ value }) {
  const [ok, setOk] = useState(false)
  const go = async () => {
    await navigator.clipboard.writeText(value)
    setOk(true); setTimeout(() => setOk(false), 1800)
  }
  return (
    <button onClick={go} className={`add-icon-btn ${ok ? 'ok' : ''}`} title={ok ? 'Copiado!' : 'Copiar'}>
      <span className="aib-inner">{ok ? Ico.check : Ico.copy}</span>
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ⭐  SEÇÃO: Subscriptions
//     Assinaturas on-chain — cada sub é um NFT de acesso com data de expiração
// ════════════════════════════════════════════════════════════════════════════

const MOCK_SUBS = [
  {
    id:        'hey-pro',
    name:      'Hey.xyz Pro',
    icon:      '🌿',
    color:     '#10B981',
    desc:      'Publicações ilimitadas, analytics, badge verificado',
    price:     '0.01 ETH/mês',
    token:     'MATIC',
    tokenAmt:  '8 MATIC/mês',
    expiresAt: '2026-04-10',
    nftId:     '4821',
    status:    'active',
    network:   'Polygon',
    contractAddr: '0xHEY...PRO1',
    renewAuto: true,
  },
  {
    id:        'pannet-pro',
    name:      'Pannet Pro',
    icon:      '📡',
    color:     '#6366F1',
    desc:      'Bandwidth aumentada, nós prioritários, zero throttling',
    price:     '5 USDC/mês',
    token:     'USDC',
    tokenAmt:  '5 USDC/mês',
    expiresAt: '2026-03-01',
    nftId:     '0912',
    status:    'expiring', // expira em < 14 dias
    network:   'Arbitrum',
    contractAddr: '0xPAN...NET2',
    renewAuto: false,
  },
  {
    id:        'floflis-pro',
    name:      'Floflis Pro',
    icon:      '🌿',
    color:     '#7C3AED',
    desc:      'Acesso DAO completo, propostas, treasury view, Floflis AI',
    price:     '10 FLF/mês',
    token:     'FLF',
    tokenAmt:  '10 FLF/mês',
    expiresAt: '2026-06-10',
    nftId:     '0001',
    status:    'active',
    network:   'Ethereum',
    contractAddr: '0xFLO...FLF3',
    renewAuto: true,
  },
  {
    id:        'shatty-days',
    name:      'Shatty Days',
    icon:      '☀️',
    color:     '#F59E0B',
    desc:      'Calendário descentralizado com notificações on-chain e sync entre devices',
    price:     '2 DAI/mês',
    token:     'DAI',
    tokenAmt:  '2 DAI/mês',
    expiresAt: '2025-12-31',
    nftId:     '7733',
    status:    'expired',
    network:   'Base',
    contractAddr: '0xSHT...DAY4',
    renewAuto: false,
  },
  // ── Placeholders pra explorar ──
  {
    id:        'explore-1',
    name:      'Gamlr Pro',
    icon:      '🎮',
    color:     '#EC4899',
    desc:      'Salas privadas, torneios, leaderboard DAO, skin NFTs',
    price:     'Em breve',
    status:    'coming',
    network:   'Ethereum',
  },
  {
    id:        'explore-2',
    name:      'Mirror Membership',
    icon:      '📝',
    color:     '#06B6D4',
    desc:      'Publicações tokenizadas, crowdfunds, assinantes on-chain',
    price:     'Variável',
    status:    'coming',
    network:   'Ethereum',
  },
]

const statusMeta = {
  active:   { label: 'Ativa',    cls: 'badge-success'  },
  expiring: { label: 'Expirando',cls: 'badge-warning'  },
  expired:  { label: 'Expirada', cls: 'badge-muted'    },
  coming:   { label: 'Em breve', cls: 'badge-plasma'   },
}

export function SectionSubscriptions() {
  const [subs, setSubs]     = useState(MOCK_SUBS)
  const [expanded, setExp]  = useState(null)

  const toggleRenew = (id) =>
    setSubs(s => s.map(sub => sub.id === id ? { ...sub, renewAuto: !sub.renewAuto } : sub))

  const activeSubs  = subs.filter(s => ['active','expiring'].includes(s.status))
  const expiredSubs = subs.filter(s => s.status === 'expired')
  const comingSubs  = subs.filter(s => s.status === 'coming')

  return (
    <section className="settings-section add-section" id="subscriptions">

      {/* Header */}
      <div className="section-header">
        <div className="section-header-icon" style={{ background: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.2)', color: '#FCD34D' }}>
          <span style={{ width: 20, height: 20, display: 'flex' }}>{Ico.subscriptions}</span>
        </div>
        <div className="section-header-text">
          <div className="section-title-row">
            <h2 className="section-title">Subscriptions</h2>
            <span className="badge badge-onchain">on-chain</span>
          </div>
          <p className="section-subtitle">
            Cada assinatura é um <strong>NFT de acesso</strong> — você o possui, renova on-chain, e pode até revender.
            Sem cartão de crédito, sem intermediário, sem dados bancários. ✊
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="sub-stats-row">
        <div className="sub-stat">
          <span className="sub-stat-num">{activeSubs.length}</span>
          <span className="sub-stat-label">ativas</span>
        </div>
        <div className="sub-stat-div" />
        <div className="sub-stat">
          <span className="sub-stat-num" style={{ color: '#F59E0B' }}>
            {subs.filter(s=>s.status==='expiring').length}
          </span>
          <span className="sub-stat-label">expirando</span>
        </div>
        <div className="sub-stat-div" />
        <div className="sub-stat">
          <span className="sub-stat-num" style={{ color: '#9CA3AF' }}>{expiredSubs.length}</span>
          <span className="sub-stat-label">expiradas</span>
        </div>
        <div className="sub-stat-div" />
        <div className="sub-stat">
          <span className="sub-stat-num sub-stat-spend">
            ~{'\u00A0'}$17/mês
          </span>
          <span className="sub-stat-label">gasto estimado</span>
        </div>
      </div>

      {/* Lista ativa */}
      <div className="setting-card">
        {activeSubs.map(sub => (
          <div key={sub.id} className={`sub-row ${sub.status}`}>
            <div className="sub-icon" style={{ background: `${sub.color}1A`, border: `1px solid ${sub.color}30` }}>
              {sub.icon}
            </div>
            <div className="sub-info">
              <div className="sub-name-row">
                <span className="sub-name">{sub.name}</span>
                <span className={`badge ${statusMeta[sub.status].cls}`}>{statusMeta[sub.status].label}</span>
                <span className="sub-network-chip">{sub.network}</span>
              </div>
              <span className="sub-desc">{sub.desc}</span>
              <div className="sub-meta-row">
                <span className="sub-price">{sub.tokenAmt}</span>
                <span className="sub-dot">·</span>
                <span className="sub-expiry">
                  {sub.status === 'expiring' ? '⚠️ ' : ''}
                  Renova {sub.expiresAt}
                </span>
                <span className="sub-dot">·</span>
                <span className="sub-nft">NFT #{sub.nftId}</span>
              </div>
            </div>
            <div className="sub-actions">
              {/* Toggle auto-renew */}
              <div className="sub-renew">
                <span className="sub-renew-label">Auto</span>
                <button
                  role="switch"
                  aria-checked={sub.renewAuto}
                  onClick={() => toggleRenew(sub.id)}
                  className={`toggle small ${sub.renewAuto ? 'on' : 'off'}`}
                  aria-label={`Auto-renovar ${sub.name}`}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
              <button
                onClick={() => setExp(expanded === sub.id ? null : sub.id)}
                className="btn-ghost-sm"
                aria-expanded={expanded === sub.id}
              >
                {expanded === sub.id ? 'Fechar' : 'Detalhes'}
              </button>
            </div>

            {/* Detalhes expandidos */}
            {expanded === sub.id && (
              <div className="sub-expanded">
                <div className="sub-expanded-row">
                  <span className="sub-exp-label">Contrato</span>
                  <div className="mono-display compact">
                    <span className="mono-text small">{sub.contractAddr}</span>
                    <CopyBtn value={sub.contractAddr} />
                    <a href={`https://etherscan.io/address/${sub.contractAddr}`}
                      target="_blank" rel="noopener noreferrer"
                      className="add-icon-btn" title="Ver no explorer">
                      <span className="aib-inner">{Ico.external}</span>
                    </a>
                  </div>
                </div>
                <div className="sub-expanded-row">
                  <span className="sub-exp-label">NFT de acesso</span>
                  <span className="mono-text small">Token ID #{sub.nftId} · ERC-721</span>
                </div>
                <div className="sub-expanded-actions">
                  <button className="btn-ghost-sm">{Ico.refresh} Renovar agora</button>
                  <button className="btn-danger-ghost-sm">Cancelar assinatura</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expiradas */}
      {expiredSubs.length > 0 && (
        <div className="setting-card faded-card">
          <div className="sub-group-label">Expiradas</div>
          {expiredSubs.map(sub => (
            <div key={sub.id} className="sub-row expired">
              <div className="sub-icon faded">
                {sub.icon}
              </div>
              <div className="sub-info">
                <div className="sub-name-row">
                  <span className="sub-name faded">{sub.name}</span>
                  <span className="badge badge-muted">Expirada</span>
                </div>
                <span className="sub-desc faded">{sub.desc}</span>
                <span className="sub-meta-row">
                  <span className="sub-expiry faded">Expirou em {sub.expiresAt}</span>
                </span>
              </div>
              <button className="btn-ghost-sm">Renovar</button>
            </div>
          ))}
        </div>
      )}

      {/* Em breve / explore */}
      <div className="sub-explore-header">
        <span>Explorar mais serviços Web3</span>
        <span className="sub-explore-hint">Integrações disponíveis via Plasmmer Marketplace</span>
      </div>
      <div className="sub-coming-grid">
        {comingSubs.map(sub => (
          <div key={sub.id} className="sub-coming-card">
            <div className="sub-coming-icon" style={{ background: `${sub.color}15`, color: sub.color }}>
              {sub.icon}
            </div>
            <div>
              <p className="sub-coming-name">{sub.name}</p>
              <p className="sub-coming-desc">{sub.desc}</p>
              <p className="sub-coming-price">{sub.price}</p>
            </div>
            <span className="badge badge-plasma" style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>Em breve</span>
          </div>
        ))}
      </div>

    </section>
  )
}


// ════════════════════════════════════════════════════════════════════════════
// 📱  SEÇÃO: Devices
//     Dispositivos registrados on-chain como NFTs — dGen/ethOS style
//     Cada device é um ERC-721 que prova posse soberana do hardware
// ════════════════════════════════════════════════════════════════════════════

const MOCK_DEVICES = [
  {
    id:           'dgen-001',
    name:         'dGen Phone',
    model:        'dGen One · Freedom Factory',
    icon:         '📱',
    color:        '#7C3AED',
    os:           'ethOS 2.4.1',
    nftId:        '0042',
    nftContract:  '0xFREE...DOM1',
    network:      'Ethereum',
    walletLinked: '0x1a2b...9f0c',
    attestedAt:   '2025-10-12',
    lastSeen:     'Agora mesmo',
    status:       'online',
    trusted:      true,
    features:     ['biometric-auth', 'hardware-wallet', 'enclave-signing'],
  },
  {
    id:           'laptop-001',
    name:         'Laptop pessoal',
    model:        'Genérico · Browser Wallet',
    icon:         '💻',
    color:        '#6366F1',
    os:           'Ubuntu 24.04',
    nftId:        null, // não é um device NFTed — só registrado por software
    nftContract:  null,
    network:      null,
    walletLinked: '0x1a2b...9f0c',
    attestedAt:   '2024-06-10',
    lastSeen:     '3 horas atrás',
    status:       'online',
    trusted:      true,
    features:     ['browser-extension'],
  },
  {
    id:           'tablet-002',
    name:         'Tablet (desconhecido)',
    model:        'Não identificado · Android',
    icon:         '📟',
    color:        '#EF4444',
    os:           'Android 13',
    nftId:        null,
    nftContract:  null,
    network:      null,
    walletLinked: '0x1a2b...9f0c',
    attestedAt:   '2026-01-30',
    lastSeen:     '5 dias atrás',
    status:       'suspicious',
    trusted:      false,
    features:     [],
  },
]

const deviceStatusMeta = {
  online:     { label: 'Online',     color: '#10B981', glow: 'rgba(16,185,129,0.5)' },
  offline:    { label: 'Offline',    color: '#6B7280', glow: 'transparent'           },
  suspicious: { label: 'Suspeito ⚠️', color: '#EF4444', glow: 'rgba(239,68,68,0.5)'  },
}

const featureMeta = {
  'biometric-auth':     { label: 'Biometria',           icon: '🔏' },
  'hardware-wallet':    { label: 'Hardware Wallet',      icon: '🔒' },
  'enclave-signing':    { label: 'Enclave Signing',      icon: '🔐' },
  'browser-extension':  { label: 'Browser Extension',    icon: '🌐' },
}

export function SectionDevices() {
  const [devices, setDevices] = useState(MOCK_DEVICES)
  const [revoking, setRevoking] = useState(null)

  const revoke = (id) => {
    setRevoking(id)
    // → chama DeviceRegistry.revokeDevice(deviceId) on-chain
    setTimeout(() => {
      setDevices(d => d.filter(dev => dev.id !== id))
      setRevoking(null)
    }, 800)
  }

  return (
    <section className="settings-section add-section" id="devices">

      {/* Header */}
      <div className="section-header">
        <div className="section-header-icon" style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>
          <span style={{ width: 20, height: 20, display: 'flex' }}>{Ico.devices}</span>
        </div>
        <div className="section-header-text">
          <div className="section-title-row">
            <h2 className="section-title">Devices</h2>
            <span className="badge badge-onchain">on-chain</span>
          </div>
          <p className="section-subtitle">
            Dispositivos autorizados a assinar com sua identidade Plasmmer.
            Devices NFTed (como o <strong>dGen Phone</strong>) têm attestation verificável on-chain — sem empresa no meio que possa revogar seu hardware.
          </p>
        </div>
      </div>

      {/* Lista de devices */}
      <div className="setting-card">
        {devices.map(dev => {
          const sm = deviceStatusMeta[dev.status]
          return (
            <div key={dev.id} className={`device-row ${dev.status}`}>

              {/* Ícone + indicador de status */}
              <div className="device-icon-wrap">
                <div className="device-icon" style={{ background: `${dev.color}18` }}>
                  {dev.icon}
                </div>
                <div className="device-status-dot" style={{ background: sm.color, boxShadow: `0 0 6px ${sm.glow}` }} />
              </div>

              {/* Infos */}
              <div className="device-info">
                <div className="device-name-row">
                  <span className="device-name">{dev.name}</span>
                  {dev.nftId && (
                    <span className="device-nft-badge">
                      <span style={{ width: 12, height: 12, display: 'inline-flex', opacity: 0.8 }}>{Ico.nft}</span>
                      NFT #{dev.nftId}
                    </span>
                  )}
                  {dev.trusted
                    ? <span className="device-trusted">✓ Confiável</span>
                    : <span className="device-untrusted">⚠ Não confiável</span>
                  }
                </div>
                <span className="device-model">{dev.model} · {dev.os}</span>
                <div className="device-meta">
                  <span className="device-status-label" style={{ color: sm.color }}>{sm.label}</span>
                  <span className="sub-dot">·</span>
                  <span className="device-lastseen">Último acesso: {dev.lastSeen}</span>
                  <span className="sub-dot">·</span>
                  <span className="device-since">Registrado {dev.attestedAt}</span>
                </div>

                {/* Features do device */}
                {dev.features.length > 0 && (
                  <div className="device-features">
                    {dev.features.map(f => (
                      <span key={f} className="device-feature-chip" title={featureMeta[f]?.label}>
                        {featureMeta[f]?.icon} {featureMeta[f]?.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* NFT info (se device NFTed) */}
                {dev.nftId && (
                  <div className="device-nft-info">
                    <span className="device-nft-label">NFT de Device:</span>
                    <div className="mono-display compact">
                      <span className="mono-text small">{dev.nftContract}</span>
                      <CopyBtn value={dev.nftContract} />
                      <a href={`https://etherscan.io/token/${dev.nftContract}?a=${dev.nftId}`}
                        target="_blank" rel="noopener noreferrer"
                        className="add-icon-btn" title="Ver no Etherscan">
                        <span className="aib-inner">{Ico.external}</span>
                      </a>
                    </div>
                    <span className="device-nft-desc">
                      Ownership do hardware verificável on-chain · {dev.network}
                    </span>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="device-actions">
                {dev.status === 'suspicious' && (
                  <button className="btn-danger small" style={{ fontSize: 12, padding: '6px 12px' }}>
                    Investigar
                  </button>
                )}
                <button
                  onClick={() => revoke(dev.id)}
                  disabled={revoking === dev.id}
                  className="btn-danger-ghost-sm red"
                  aria-label={`Revogar acesso de ${dev.name}`}
                >
                  <span style={{ width: 13, height: 13, display: 'inline-flex' }}>{Ico.trash}</span>
                  {revoking === dev.id ? 'Revogando...' : 'Revogar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Adicionar novo device */}
      <div className="setting-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p className="setting-label">Registrar novo device</p>
            <p className="setting-desc">
              Devices NFTed como o <strong>dGen Phone (Freedom Factory)</strong> são registrados via ethOS automaticamente.
              Para outros dispositivos, use a Plasmmer CLI ou o QR Code abaixo.
            </p>
          </div>
          <button className="btn-primary">+ Adicionar device</button>
        </div>
      </div>

      {/* Callout ethOS / dGen */}
      <div className="setting-card onchain-callout dgen-callout">
        <span className="callout-icon">📱</span>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--s-text-1)', fontSize: 13, marginBottom: 6 }}>
            Sobre o dGen Phone + ethOS (Freedom Factory)
          </p>
          <p>
            O <strong>dGen Phone</strong> é um smartphone com <strong>ethOS</strong> — um Android modificado onde
            o hardware é registrado on-chain como NFT ERC-721. Isso significa que a posse do device é verificável
            na blockchain, sem precisar de nenhuma conta Apple ou Google.
            Sua wallet está no enclave de hardware, assinada pelo device NFT.
            Se você perder o telefone, o NFT é seu — não da Freedom Factory.
          </p>
          <a href="https://freedomfactory.xyz" target="_blank" rel="noopener noreferrer"
            className="btn-ghost-sm" style={{ marginTop: 10, display: 'inline-flex', gap: 6 }}>
            {Ico.external} freedomfactory.xyz
          </a>
        </div>
      </div>

    </section>
  )
}


// ════════════════════════════════════════════════════════════════════════════
// 🕸️  SEÇÃO: Social Graph
//     Integrações com Lens, Farcaster e Fediverse
//     Porque a sua rede social não deveria pertencer a uma empresa
// ════════════════════════════════════════════════════════════════════════════

const MOCK_SOCIAL = {
  lens: {
    id:          'lens',
    name:        'Lens Protocol',
    protocol:    'lens',
    icon:        '🌿',
    color:       '#00501E',
    bgColor:     'rgba(0,80,30,0.12)',
    borderColor: 'rgba(0,80,30,0.25)',
    accentColor: '#4ADE80',
    network:     'Polygon',
    description: 'Social graph descentralizado na Polygon. Seus seguidores são NFTs, seu feed é seu.',
    connected:   true,
    handle:      'perla.lens',
    profileId:   '0x0A42',
    followers:   312,
    following:   89,
    publications: 47,
    externalUrl: 'https://hey.xyz/u/perla',
    scopes:      ['read_profile', 'create_publication', 'follow', 'mirror'],
  },
  farcaster: {
    id:          'farcaster',
    name:        'Farcaster',
    protocol:    'farcaster',
    icon:        '🟣',
    color:       '#7C3AED',
    bgColor:     'rgba(124,58,237,0.10)',
    borderColor: 'rgba(124,58,237,0.25)',
    accentColor: '#A78BFA',
    network:     'Optimism',
    description: 'Protocolo social suficientemente descentralizado. Seu FID é seu. Seus casts ficam em Hubs p2p.',
    connected:   true,
    handle:      'perla',
    fid:         '88210',
    custody:     '0x1a2b...9f0c',
    followers:   204,
    following:   71,
    casts:       89,
    externalUrl: 'https://warpcast.com/perla',
    scopes:      ['read_casts', 'create_cast', 'follow', 'reaction'],
  },
  fediverse: {
    id:          'fediverse',
    name:        'Fediverse',
    protocol:    'activitypub',
    icon:        '🐘',
    color:       '#6364FF',
    bgColor:     'rgba(99,100,255,0.10)',
    borderColor: 'rgba(99,100,255,0.25)',
    accentColor: '#818CF8',
    network:     'ActivityPub (p2p)',
    description: 'ActivityPub — o protocolo do Mastodon, Pixelfed, PeerTube, etc. Não é Web3, mas é descentralizado.',
    connected:   false,
    handle:      null,
    instance:    null,
    followers:   0,
    following:   0,
    externalUrl: 'https://mastodon.social',
    scopes:      ['read_profile', 'create_post', 'follow'],
    suggestedInstances: [
      { name: 'mastodon.social', desc: 'A mais popular' },
      { name: 'fosstodon.org',   desc: 'Tech/FOSS friendly' },
      { name: 'kolektiva.social',desc: 'Ativismo e esquerda' },
    ],
  },
}

// Toggle de cross-posting
const CROSS_POST_OPTIONS = [
  { id: 'lens-fc',    label: 'Lens → Farcaster', from: 'lens',      to: 'farcaster' },
  { id: 'fc-lens',    label: 'Farcaster → Lens', from: 'farcaster', to: 'lens'      },
  { id: 'lens-fedi',  label: 'Lens → Fediverse', from: 'lens',      to: 'fediverse' },
  { id: 'fc-fedi',    label: 'Farcaster → Fediverse', from: 'farcaster', to: 'fediverse' },
]

export function SectionSocialGraph() {
  const [socials, setSocials]       = useState(MOCK_SOCIAL)
  const [crossPost, setCrossPost]   = useState({ 'lens-fc': true, 'fc-lens': false, 'lens-fedi': false, 'fc-fedi': false })
  const [fediverseHandle, setFediverseHandle] = useState('')
  const [connectingFedi, setConnectingFedi]   = useState(false)

  const disconnect = (id) => {
    setSocials(s => ({ ...s, [id]: { ...s[id], connected: false, handle: null } }))
  }

  const handleFediConnect = () => {
    if (!fediverseHandle.includes('@')) return
    setConnectingFedi(true)
    setTimeout(() => {
      const [, instance] = fediverseHandle.split('@').filter(Boolean)
      setSocials(s => ({
        ...s,
        fediverse: {
          ...s.fediverse,
          connected: true,
          handle:    fediverseHandle,
          instance:  instance || 'mastodon.social',
          followers: 0,
          following: 0,
        }
      }))
      setConnectingFedi(false)
    }, 1200)
  }

  const social = Object.values(socials)

  return (
    <section className="settings-section add-section" id="socialgraph">

      {/* Header */}
      <div className="section-header">
        <div className="section-header-icon" style={{ background: 'rgba(6,182,212,0.10)', borderColor: 'rgba(6,182,212,0.2)', color: '#67E8F9' }}>
          <span style={{ width: 20, height: 20, display: 'flex' }}>{Ico.socialgraph}</span>
        </div>
        <div className="section-header-text">
          <div className="section-title-row">
            <h2 className="section-title">Social Graph</h2>
            <span className="badge" style={{ background: 'rgba(6,182,212,0.15)', color: '#67E8F9', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.04em' }}>descentralizado</span>
          </div>
          <p className="section-subtitle">
            Lens, Farcaster, Fediverse — seus seguidores <strong>não pertencem a nenhuma empresa</strong>.
            Você exporta, migra, porta. Cross-posting incluído.
          </p>
        </div>
      </div>

      {/* Cards de cada protocolo */}
      {social.map(s => (
        <div key={s.id} className="setting-card sg-card" style={{ borderColor: s.connected ? s.borderColor : 'var(--s-border)' }}>
          {/* Cabeçalho do protocolo */}
          <div className="sg-header" style={{ borderBottom: '1px solid var(--s-border)' }}>
            <div className="sg-protocol-icon" style={{ background: s.bgColor, color: s.accentColor }}>
              {s.icon}
            </div>
            <div className="sg-protocol-info">
              <div className="sg-name-row">
                <span className="sg-name">{s.name}</span>
                <span className="sg-network">{s.network}</span>
                {s.connected
                  ? <span className="badge badge-success">Conectado</span>
                  : <span className="badge badge-muted">Desconectado</span>
                }
              </div>
              <span className="sg-desc">{s.description}</span>
            </div>
            {s.connected
              ? (
                <button onClick={() => disconnect(s.id)} className="btn-danger-ghost-sm" style={{ flexShrink: 0 }}>
                  <span style={{ width: 13, height: 13, display: 'inline-flex' }}>{Ico.unlink}</span>
                  Desconectar
                </button>
              )
              : s.id !== 'fediverse' && (
                <button className="btn-primary small" style={{ flexShrink: 0, fontSize: 12, padding: '7px 14px' }}>
                  <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{Ico.link}</span>
                  Conectar
                </button>
              )
            }
          </div>

          {/* Stats (se conectado e não fediverse) */}
          {s.connected && s.id === 'lens' && (
            <div className="sg-stats">
              <div className="sg-stat">
                <span className="sg-stat-num" style={{ color: s.accentColor }}>{s.followers}</span>
                <span className="sg-stat-label">seguidores</span>
              </div>
              <div className="sg-stat-div" />
              <div className="sg-stat">
                <span className="sg-stat-num">{s.following}</span>
                <span className="sg-stat-label">seguindo</span>
              </div>
              <div className="sg-stat-div" />
              <div className="sg-stat">
                <span className="sg-stat-num">{s.publications}</span>
                <span className="sg-stat-label">posts</span>
              </div>
              <div className="sg-stat-div" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                <div className="mono-display compact" style={{ width: 'fit-content' }}>
                  <span className="mono-text small">{s.handle}</span>
                  <CopyBtn value={s.handle} />
                  <a href={s.externalUrl} target="_blank" rel="noopener noreferrer" className="add-icon-btn">
                    <span className="aib-inner">{Ico.external}</span>
                  </a>
                </div>
                <span className="sg-profile-id">Profile ID: {s.profileId}</span>
              </div>
            </div>
          )}

          {s.connected && s.id === 'farcaster' && (
            <div className="sg-stats">
              <div className="sg-stat">
                <span className="sg-stat-num" style={{ color: s.accentColor }}>{s.followers}</span>
                <span className="sg-stat-label">seguidores</span>
              </div>
              <div className="sg-stat-div" />
              <div className="sg-stat">
                <span className="sg-stat-num">{s.following}</span>
                <span className="sg-stat-label">seguindo</span>
              </div>
              <div className="sg-stat-div" />
              <div className="sg-stat">
                <span className="sg-stat-num">{s.casts}</span>
                <span className="sg-stat-label">casts</span>
              </div>
              <div className="sg-stat-div" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                <div className="mono-display compact" style={{ width: 'fit-content' }}>
                  <span className="mono-text small">!{s.fid}</span>
                  <CopyBtn value={s.fid} />
                  <a href={s.externalUrl} target="_blank" rel="noopener noreferrer" className="add-icon-btn">
                    <span className="aib-inner">{Ico.external}</span>
                  </a>
                </div>
                <span className="sg-profile-id">Custody: {s.custody}</span>
              </div>
            </div>
          )}

          {/* Fediverse — conectado */}
          {s.id === 'fediverse' && s.connected && (
            <div className="sg-stats">
              <div className="sg-stat">
                <span className="sg-stat-num" style={{ color: s.accentColor }}>{s.followers}</span>
                <span className="sg-stat-label">seguidores</span>
              </div>
              <div className="sg-stat-div" />
              <div className="sg-stat">
                <span className="sg-stat-num">{s.following}</span>
                <span className="sg-stat-label">seguindo</span>
              </div>
              <div className="sg-stat-div" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="mono-display compact" style={{ width: 'fit-content' }}>
                  <span className="mono-text small">{s.handle}</span>
                  <CopyBtn value={s.handle} />
                </div>
                <span className="sg-profile-id">Instância: {s.instance}</span>
              </div>
              <button onClick={() => disconnect(s.id)} className="btn-danger-ghost-sm">
                <span style={{ width: 13, height: 13, display: 'inline-flex' }}>{Ico.unlink}</span>
                Desconectar
              </button>
            </div>
          )}

          {/* Fediverse — não conectado */}
          {s.id === 'fediverse' && !s.connected && (
            <div className="sg-fedi-connect">
              <div className="sg-fedi-instances">
                <p className="sg-fedi-hint">Instâncias sugeridas:</p>
                <div className="sg-fedi-chips">
                  {s.suggestedInstances.map(inst => (
                    <button key={inst.name}
                      onClick={() => setFediverseHandle(`@perla@${inst.name}`)}
                      className="sg-fedi-chip" title={inst.desc}>
                      {inst.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sg-fedi-input-row">
                <input
                  className="input-field"
                  placeholder="@seunome@instancia.social"
                  value={fediverseHandle}
                  onChange={e => setFediverseHandle(e.target.value)}
                  aria-label="Seu handle no Fediverse"
                  style={{ flex: 1, width: 'auto' }}
                />
                <button
                  onClick={handleFediConnect}
                  disabled={!fediverseHandle.includes('@') || connectingFedi}
                  className="btn-primary"
                  style={{ fontSize: 13, padding: '8px 16px' }}
                >
                  {connectingFedi ? 'Conectando...' : 'Conectar'}
                </button>
              </div>
              <p className="sg-fedi-note">
                ℹ️ Fediverse usa ActivityPub — não é Web3, mas é descentralizado de verdade.
                Funciona como uma ponte entre identidade Web3 e as redes abertas existentes.
              </p>
            </div>
          )}

          {/* Escopos concedidos */}
          {s.connected && (
            <div className="sg-scopes">
              <span className="sg-scopes-label">Escopos:</span>
              {s.scopes.map(sc => (
                <span key={sc} className="scope-chip">{sc}</span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Cross-posting */}
      <div className="setting-card">
        <div className="section-sub-header">
          <span>Cross-posting</span>
          <span className="sg-cross-hint">Publicar em múltiplas redes automaticamente</span>
        </div>
        {CROSS_POST_OPTIONS.map(opt => {
          const fromConnected = socials[opt.from]?.connected
          const toConnected   = socials[opt.to]?.connected
          const bothConnected = fromConnected && toConnected
          return (
            <div key={opt.id} className="setting-row" style={{ opacity: bothConnected ? 1 : 0.4 }}>
              <div className="setting-row-info">
                <span className="setting-label">
                  {opt.label}
                  {!bothConnected && <span className="setting-desc" style={{ display: 'inline', marginLeft: 6 }}>(conecte ambas as redes primeiro)</span>}
                </span>
              </div>
              <button
                role="switch"
                aria-checked={crossPost[opt.id] && bothConnected}
                onClick={() => bothConnected && setCrossPost(p => ({ ...p, [opt.id]: !p[opt.id] }))}
                className={`toggle ${crossPost[opt.id] && bothConnected ? 'on' : 'off'}`}
                disabled={!bothConnected}
                aria-label={`Cross-posting ${opt.label}`}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Callout */}
      <div className="setting-card onchain-callout" style={{ borderColor: 'rgba(6,182,212,0.15) !important' }}>
        <span className="callout-icon">🕸️</span>
        <p>
          Lens e Farcaster são Social Graphs <strong>portáteis</strong> — você não perde seus seguidores ao trocar de cliente.
          Hey.xyz, Orb, Firefly, Supercast: são apenas interfaces, não jaulas.
          O Fediverse é anterior ao Web3 e prova que descentralização é possível sem blockchain.
          A Plasmmer conecta os dois mundos. <strong>Seus dados. Sua rede. Seu controle.</strong>
        </p>
      </div>

    </section>
  )
}


/*
════════════════════════════════════════════════════════════════════════════
📋  INSTRUÇÕES: Como adicionar ao SettingsPage.jsx
════════════════════════════════════════════════════════════════════════════

1. Importe no topo do SettingsPage.jsx:
   import { SectionSubscriptions, SectionDevices, SectionSocialGraph } from './SettingsAdditions'

2. Adicione ao array NAV (antes do 'danger'):
   { id: 'subscriptions', label: 'Subscriptions',  icon: icons.subscriptions, tag: 'on-chain'  },
   { id: 'devices',       label: 'Devices',         icon: icons.devices,       tag: 'on-chain'  },
   { id: 'socialgraph',   label: 'Social Graph',    icon: icons.socialgraph,   tag: null        },

   Ícones a adicionar no objeto `icons`:
   subscriptions: <svg viewBox="0 0 24 24" ...>⭐ (star svg)</svg>,
   devices:       <svg viewBox="0 0 24 24" ...>📱 (smartphone svg)</svg>,
   socialgraph:   <svg viewBox="0 0 24 24" ...>🕸️ (share-2 svg)</svg>,

3. Adicione ao sectionMap:
   subscriptions: <SectionSubscriptions />,
   devices:       <SectionDevices />,
   socialgraph:   <SectionSocialGraph />,

════════════════════════════════════════════════════════════════════════════
*/
