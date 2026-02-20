// 🧙‍♀️ SettingsPage.jsx
// Página de configurações Plasmmer — Web3-oriented
// Design: refined dark luxury, Syne + DM Sans, sidebar + seções
// Cada seção tem seu "contrato" correspondente em PlasmmmerIdentity.sol

'use client'
import { useState, useCallback } from 'react'
import './settings.css'

// ─── Mock de dados do usuário (viriam da sessão/contratos) ─────────────────
const MOCK_USER = {
  did:         'did:plc:abc123xyz789',
  handle:      'perla.bsky.social',
  displayName: 'Perla',
  avatar:      null,
  ethAddress:  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  ensName:     'perla.eth',
  walletId:    'waap-wallet-001',
  joinedAt:    '2024-06-10',
  membership:  ['plasmmer', 'floflis'],
}

const MOCK_APPS = [
  { id: 1, name: 'Gamlr',    icon: '🎮', scope: ['read_profile','create_post'], connectedAt: '2025-11-01', riskLevel: 'low'    },
  { id: 2, name: 'FloflisPay', icon: '💸', scope: ['read_balance','send_tx'],  connectedAt: '2025-12-15', riskLevel: 'medium' },
  { id: 3, name: 'DAOVoter', icon: '🏛️', scope: ['vote','read_dao'],           connectedAt: '2026-01-03', riskLevel: 'low'    },
]

const MOCK_GUARDIANS = [
  { address: '0xDEAD...BEEF', alias: 'Irmã Danielle', status: 'confirmed' },
  { address: '0x1234...5678', alias: 'Áurea (mãe)',   status: 'confirmed' },
  { address: '0xABCD...EF01', alias: 'Guardian 3',    status: 'pending'   },
]

const MOCK_DAOS = [
  { id: 'plasmmer', name: 'Plasmmer',   icon: '🔮', role: 'Core Member', votes: 142, since: '2024-06-10', active: true  },
  { id: 'floflis',  name: 'Floflis',    icon: '🌿', role: 'Member',      votes:  38, since: '2024-08-22', active: true  },
  { id: 'gamlr',    name: 'Gamlr',      icon: '🎮', role: 'Observer',    votes:   0, since: '2025-01-10', active: false },
]

const MOCK_ALERTS = [
  { id: 1, event: 'incoming_tx',        label: 'Transação recebida',       enabled: true  },
  { id: 2, event: 'dao_proposal',       label: 'Nova proposta em DAO',     enabled: true  },
  { id: 3, event: 'guardian_request',   label: 'Pedido de Social Recovery', enabled: true  },
  { id: 4, event: 'app_permission',     label: 'App solicitou permissão',  enabled: true  },
  { id: 5, event: 'acl_change',         label: 'Mudança de privacidade',   enabled: false },
  { id: 6, event: 'outgoing_tx',        label: 'Transação enviada',        enabled: false },
]

// ─── Ícones SVG inline ─────────────────────────────────────────────────────

const icons = {
  identity:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  wallet:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20L16 3z"/><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none"/></svg>,
  privacy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z"/></svg>,
  apps:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>,
  recovery:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  dao:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  alerts:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  data:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  danger:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  copy:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  external:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  trash:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  chain:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  download:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
}

// ─── Nav items da sidebar ─────────────────────────────────────────────────

const NAV = [
  { id: 'identity', label: 'Identity',        icon: icons.identity, tag: null             },
  { id: 'wallet',   label: 'Wallet & Keys',   icon: icons.wallet,   tag: null             },
  { id: 'privacy',  label: 'Privacy & ACL',   icon: icons.privacy,  tag: 'on-chain'       },
  { id: 'apps',     label: 'Connected Apps',  icon: icons.apps,     tag: null             },
  { id: 'recovery', label: 'Social Recovery', icon: icons.recovery, tag: 'on-chain'       },
  { id: 'dao',      label: 'DAO Memberships', icon: icons.dao,      tag: null             },
  { id: 'alerts',   label: 'On-chain Alerts', icon: icons.alerts,   tag: 'on-chain'       },
  { id: 'data',     label: 'Data Sovereignty',icon: icons.data,     tag: 'decentralized'  },
  { id: 'danger',   label: 'Danger Zone',     icon: icons.danger,   tag: null             },
]

// ─── Utilitários ──────────────────────────────────────────────────────────

function truncateAddr(addr, start = 6, end = 4) {
  if (!addr) return '—'
  return `${addr.slice(0, start)}...${addr.slice(-end)}`
}

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false)
  const handle = useCallback(async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])
  return (
    <button onClick={handle} className={`icon-btn ${copied ? 'copied' : ''}`}
      aria-label={copied ? 'Copiado!' : label} title={copied ? 'Copiado! ✅' : label}>
      <span className="icon-btn-inner">
        {copied ? icons.check : icons.copy}
      </span>
    </button>
  )
}

function OnChainBadge({ label = 'on-chain' }) {
  return <span className={`badge badge-onchain badge-${label.replace('-','')}`}>{label}</span>
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`toggle ${checked ? 'on' : 'off'}`}
    >
      <span className="toggle-thumb" />
    </button>
  )
}

function SectionHeader({ icon, title, subtitle, badge }) {
  return (
    <div className="section-header">
      <div className="section-header-icon">{icon}</div>
      <div className="section-header-text">
        <div className="section-title-row">
          <h2 className="section-title">{title}</h2>
          {badge && <OnChainBadge label={badge} />}
        </div>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

function SettingRow({ label, description, children, onchain = false }) {
  return (
    <div className="setting-row">
      <div className="setting-row-info">
        <span className="setting-label">
          {label}
          {onchain && <span className="dot-onchain" title="Controlado por smart contract" />}
        </span>
        {description && <span className="setting-desc">{description}</span>}
      </div>
      <div className="setting-row-control">{children}</div>
    </div>
  )
}

// ─── SEÇÃO: Identity ──────────────────────────────────────────────────────

function SectionIdentity({ user }) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [ensName, setEnsName]         = useState(user.ensName || '')
  const [saved, setSaved]             = useState(false)

  const handleSave = () => {
    // → chama contrato: PlasmmmerIdentity.updateProfile(displayName, ensName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = displayName?.slice(0, 2).toUpperCase() || '?'

  return (
    <section className="settings-section" id="identity">
      <SectionHeader
        icon={icons.identity}
        title="Identity & Profile"
        subtitle="Sua identidade pública — armazenada on-chain e vinculada ao seu DID Bluesky"
      />

      {/* Avatar */}
      <div className="setting-card">
        <div className="avatar-section">
          <div className="avatar-xl" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            {user.avatar
              ? <img src={user.avatar} alt="avatar" className="avatar-img" />
              : <span className="avatar-initials">{initials}</span>
            }
          </div>
          <div className="avatar-info">
            <p className="avatar-label">Avatar público</p>
            <p className="avatar-hint">Importado do Bluesky · Armazenado em IPFS</p>
            <button className="btn-ghost-sm">Sincronizar do Bluesky</button>
          </div>
        </div>
      </div>

      {/* DID — readonly */}
      <div className="setting-card">
        <SettingRow
          label="Decentralized Identifier (DID)"
          description="Seu ID imutável no AT Protocol. Não pode ser alterado."
          onchain={true}
        >
          <div className="mono-display">
            <span className="mono-text small">{user.did}</span>
            <CopyButton value={user.did} label="Copiar DID" />
          </div>
        </SettingRow>

        <SettingRow
          label="Bluesky Handle"
          description="Seu handle atual no Bluesky"
        >
          <div className="mono-display">
            <span className="mono-text">@{user.handle}</span>
            <a href="https://bsky.app/settings" target="_blank" rel="noopener noreferrer"
              className="icon-btn" aria-label="Alterar no Bluesky">
              <span className="icon-btn-inner">{icons.external}</span>
            </a>
          </div>
        </SettingRow>
      </div>

      {/* Display name + ENS */}
      <div className="setting-card">
        <SettingRow
          label="Display Name"
          description="Nome exibido no seu perfil Plasmmer. Salvo on-chain."
          onchain={true}
        >
          <input
            className="input-field"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            maxLength={32}
            placeholder="Seu nome"
            aria-label="Display name"
          />
        </SettingRow>

        <SettingRow
          label="ENS Name"
          description="Associe um nome .eth ao seu perfil para facilitar identificação"
          onchain={true}
        >
          <div className="input-with-suffix">
            <input
              className="input-field"
              value={ensName}
              onChange={e => setEnsName(e.target.value)}
              placeholder="seunome.eth"
              aria-label="ENS name"
            />
          </div>
        </SettingRow>

        <div className="setting-row-footer">
          <button onClick={handleSave} className={`btn-primary ${saved ? 'btn-success' : ''}`}>
            {saved ? '✓ Salvo on-chain' : 'Salvar alterações'}
          </button>
          <span className="tx-hint">Esta ação gera uma transação on-chain (gas: ~0.001 ETH)</span>
        </div>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Wallet & Keys ─────────────────────────────────────────────────

function SectionWallet({ user }) {
  return (
    <section className="settings-section" id="wallet">
      <SectionHeader
        icon={icons.wallet}
        title="Wallet & Keys"
        subtitle="Sua carteira Ethereum derivada pelo WaaP · Você possui. Ninguém mais."
      />

      <div className="setting-card">
        <SettingRow
          label="Endereço Ethereum"
          description="Derivado do seu DID Bluesky via WaaP 2PC-MPC. Non-custodial."
          onchain={true}
        >
          <div className="mono-display">
            <span className="eth-icon">⬡</span>
            <span className="mono-text">{truncateAddr(user.ethAddress)}</span>
            <CopyButton value={user.ethAddress} label="Copiar endereço completo" />
            <a href={`https://etherscan.io/address/${user.ethAddress}`}
              target="_blank" rel="noopener noreferrer"
              className="icon-btn" aria-label="Ver no Etherscan">
              <span className="icon-btn-inner">{icons.external}</span>
            </a>
          </div>
        </SettingRow>
      </div>

      <div className="setting-card">
        <div className="waap-info-box">
          <div className="waap-info-icon">🔐</div>
          <div>
            <p className="waap-info-title">Como sua chave é protegida pelo WaaP</p>
            <p className="waap-info-desc">
              Sua chave privada é dividida em dois fragmentos via <strong>2PC-MPC</strong>:
              um fragmento fica no seu dispositivo, outro na rede descentralizada Ika (Sui).
              A chave completa <strong>jamais é reconstruída</strong> — nem pela Plasmmer, nem pelo WaaP.
            </p>
            <div className="waap-shards">
              <div className="shard user-shard">🗝️ User shard<br/><span>Seu dispositivo</span></div>
              <div className="shard-plus">+</div>
              <div className="shard network-shard">🌐 Network shard<br/><span>Ika Network (Sui)</span></div>
              <div className="shard-eq">=</div>
              <div className="shard result-shard">✅ Assinatura<br/><span>Nunca a chave toda</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="setting-card">
        <SettingRow
          label="Redes suportadas"
          description="Sua wallet deriva o mesmo endereço em todas as redes EVM"
        >
          <div className="network-chips">
            {['Ethereum', 'Polygon', 'Arbitrum', 'Base', 'Optimism'].map(n => (
              <span key={n} className="network-chip">{n}</span>
            ))}
          </div>
        </SettingRow>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Privacy & ACL ────────────────────────────────────────────────

function SectionPrivacy() {
  const [visibility, setVisibility] = useState('public')
  const [allowlist,  setAllowlist]  = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  return (
    <section className="settings-section" id="privacy">
      <SectionHeader
        icon={icons.privacy}
        title="Privacy & ACL"
        subtitle="Controle de acesso armazenado on-chain. Só você pode alterar."
        badge="on-chain"
      />

      <div className="setting-card">
        <div className="setting-row">
          <div className="setting-row-info">
            <span className="setting-label">Visibilidade do perfil <span className="dot-onchain" /></span>
            <span className="setting-desc">Quem pode ver seu perfil completo</span>
          </div>
          <div className="radio-group" role="radiogroup" aria-label="Visibilidade do perfil">
            {[
              { val: 'public',    label: '🌍 Público',      desc: 'Todos'               },
              { val: 'followers', label: '👥 Seguidores',   desc: 'Quem você segue'     },
              { val: 'private',   label: '🔒 Privado',      desc: 'Ninguém (apenas vc)' },
            ].map(opt => (
              <label key={opt.val} className={`radio-option ${visibility === opt.val ? 'selected' : ''}`}>
                <input type="radio" name="visibility" value={opt.val}
                  checked={visibility === opt.val}
                  onChange={() => setVisibility(opt.val)}
                  className="sr-only"
                />
                <span className="radio-label">{opt.label}</span>
                <span className="radio-desc">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="setting-card">
        <SettingRow
          label="Lista de endereços bloqueados"
          description="Endereços ETH/DIDs que não podem interagir com seu perfil on-chain"
          onchain={true}
        >
          <button className="btn-ghost-sm">Gerenciar blocklist ({'>'}0)</button>
        </SettingRow>

        <SettingRow
          label="Modo allowlist"
          description="Somente endereços aprovados por você podem te enviar mensagens ou transações"
          onchain={true}
        >
          <Toggle checked={allowlist} onChange={setAllowlist} label="Ativar allowlist" />
        </SettingRow>

        <SettingRow
          label="Compartilhar dados com DAOs"
          description="Permite que DAOs das quais você participa vejam seus dados de atividade"
          onchain={true}
        >
          <Toggle checked={dataSharing} onChange={setDataSharing} label="Compartilhar com DAOs" />
        </SettingRow>
      </div>

      <div className="setting-card onchain-callout">
        <span className="callout-icon">⛓️</span>
        <p>Cada alteração de privacidade gera uma transação no contrato <code>PlasmmmerACL</code>.
        Seu histórico de preferências é <strong>auditável e imutável</strong> — nenhuma empresa pode reverter suas escolhas silenciosamente.</p>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Connected Apps ────────────────────────────────────────────────

function SectionApps() {
  const [apps, setApps] = useState(MOCK_APPS)

  const revoke = (id) => {
    // → chama PlasmmmerACL.revokeAppPermission(appId)
    setApps(prev => prev.filter(a => a.id !== id))
  }

  const riskColor = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' }

  return (
    <section className="settings-section" id="apps">
      <SectionHeader
        icon={icons.apps}
        title="Connected Apps"
        subtitle="Apps com acesso à sua identidade Plasmmer. Revogue com um clique — on-chain."
      />

      <div className="setting-card">
        {apps.length === 0 && (
          <div className="empty-state">Nenhum app conectado 🎉</div>
        )}
        {apps.map(app => (
          <div key={app.id} className="app-row">
            <div className="app-icon">{app.icon}</div>
            <div className="app-info">
              <span className="app-name">{app.name}</span>
              <div className="app-scopes">
                {app.scope.map(s => (
                  <span key={s} className="scope-chip">{s}</span>
                ))}
              </div>
              <span className="app-meta">
                Conectado em {app.connectedAt} ·
                <span style={{ color: riskColor[app.riskLevel] }}> risco {app.riskLevel}</span>
              </span>
            </div>
            <button
              onClick={() => revoke(app.id)}
              className="btn-danger-ghost"
              aria-label={`Revogar acesso de ${app.name}`}
            >
              <span className="icon-btn-inner">{icons.trash}</span>
              Revogar
            </button>
          </div>
        ))}
      </div>

      <div className="setting-card">
        <SettingRow label="Aprovar novos apps automaticamente" description="Não recomendado — preferir aprovação manual por transação">
          <Toggle checked={false} onChange={() => {}} label="Auto-aprovar apps" />
        </SettingRow>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Social Recovery ───────────────────────────────────────────────

function SectionRecovery() {
  const [guardians, setGuardians] = useState(MOCK_GUARDIANS)
  const [threshold, setThreshold] = useState(2)

  return (
    <section className="settings-section" id="recovery">
      <SectionHeader
        icon={icons.recovery}
        title="Social Recovery"
        subtitle="Recupere sua conta sem seed phrase — via aprovação de guardiões de confiança"
        badge="on-chain"
      />

      <div className="setting-card recovery-info-box">
        <div className="recovery-diagram">
          <div className="rd-center">🪪<br/><small>Você</small></div>
          <div className="rd-arrow">se perder acesso</div>
          <div className="rd-threshold">
            <span className="rd-num">{threshold}</span>
            <small>de {guardians.length} guardiões</small>
            <small>aprovam a recuperação</small>
          </div>
          <div className="rd-arrow">→</div>
          <div className="rd-center">✅<br/><small>Acesso restaurado</small></div>
        </div>
        <p className="recovery-hint">
          Funciona como um multisig: sem seed phrase, sem suporte humano, sem empresa no meio.
          O contrato <code>SocialRecovery</code> executa automaticamente com o quórum atingido.
        </p>
      </div>

      <div className="setting-card">
        <div className="section-sub-header">
          <span>Guardiões ({guardians.length}/5)</span>
          <button className="btn-ghost-sm">+ Adicionar guardião</button>
        </div>
        {guardians.map((g, i) => (
          <div key={i} className="guardian-row">
            <div className={`guardian-status ${g.status}`} title={g.status} />
            <div className="guardian-info">
              <span className="guardian-alias">{g.alias}</span>
              <span className="mono-text small">{g.address}</span>
            </div>
            <span className={`badge ${g.status === 'confirmed' ? 'badge-success' : 'badge-pending'}`}>
              {g.status}
            </span>
            <button className="icon-btn danger" aria-label={`Remover guardião ${g.alias}`}>
              <span className="icon-btn-inner">{icons.trash}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="setting-card">
        <SettingRow
          label={`Quórum mínimo: ${threshold} guardiões`}
          description="Quantidade mínima de aprovações para recuperação ser executada"
          onchain={true}
        >
          <input type="range" min={1} max={guardians.length}
            value={threshold} onChange={e => setThreshold(+e.target.value)}
            className="range-input" aria-label="Quórum de recuperação"
          />
        </SettingRow>
      </div>
    </section>
  )
}

// ─── SEÇÃO: DAO Memberships ───────────────────────────────────────────────

function SectionDAO() {
  return (
    <section className="settings-section" id="dao">
      <SectionHeader
        icon={icons.dao}
        title="DAO Memberships"
        subtitle="Suas participações em organizações autônomas descentralizadas"
      />
      <div className="setting-card">
        {MOCK_DAOS.map(dao => (
          <div key={dao.id} className="dao-row">
            <div className="dao-icon">{dao.icon}</div>
            <div className="dao-info">
              <span className="dao-name">{dao.name}</span>
              <span className="dao-role">{dao.role} · membro desde {dao.since}</span>
            </div>
            <div className="dao-stats">
              <span className="votes-count">{dao.votes}</span>
              <span className="votes-label">votos</span>
            </div>
            <span className={`badge ${dao.active ? 'badge-success' : 'badge-muted'}`}>
              {dao.active ? 'ativa' : 'inativa'}
            </span>
            <button className="icon-btn" aria-label={`Ver ${dao.name} no explorer`}>
              <span className="icon-btn-inner">{icons.external}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="setting-card">
        <SettingRow label="Delegação de votos" description="Delegue seu poder de voto a outro endereço em DAOs específicas" onchain={true}>
          <button className="btn-ghost-sm">Configurar delegação</button>
        </SettingRow>
        <SettingRow label="Notificações de proposta" description="Ser alertada quando nova proposta for criada em suas DAOs" onchain={false}>
          <Toggle checked={true} onChange={() => {}} label="Notificações de proposta" />
        </SettingRow>
      </div>
    </section>
  )
}

// ─── SEÇÃO: On-chain Alerts ───────────────────────────────────────────────

function SectionAlerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)

  const toggle = (id) => {
    // → chama PlasmmmerAlerts.setAlertPrefs(...)
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  return (
    <section className="settings-section" id="alerts">
      <SectionHeader
        icon={icons.alerts}
        title="On-chain Alerts"
        subtitle="Notificações disparadas por eventos reais de smart contracts — não por servidor"
        badge="on-chain"
      />
      <div className="setting-card">
        {alerts.map(alert => (
          <SettingRow key={alert.id} label={alert.label} onchain={true}>
            <Toggle
              checked={alert.enabled}
              onChange={() => toggle(alert.id)}
              label={`Ativar alerta: ${alert.label}`}
            />
          </SettingRow>
        ))}
      </div>
      <div className="setting-card onchain-callout">
        <span className="callout-icon">📡</span>
        <p>Alertas são entregues via push criptografado indexado no <strong>The Graph</strong> + webhook opcional.
        Suas preferências ficam no contrato — nenhuma empresa pode desativar suas notificações.</p>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Data Sovereignty ──────────────────────────────────────────────

function SectionData() {
  return (
    <section className="settings-section" id="data">
      <SectionHeader
        icon={icons.data}
        title="Data Sovereignty"
        subtitle="Seus dados são seus. Armazenados em IPFS + Ceramic. Você controla o acesso."
        badge="decentralized"
      />
      <div className="setting-card">
        <SettingRow label="Exportar dados completos" description="Baixar todos os seus dados: perfil, histórico, preferências, memberships">
          <button className="btn-ghost-sm flex-icon">
            {icons.download} Exportar (JSON)
          </button>
        </SettingRow>
        <SettingRow label="CID IPFS do seu perfil" description="Content ID imutável dos seus dados no IPFS" onchain={true}>
          <div className="mono-display">
            <span className="mono-text small">Qm7X...k3nP</span>
            <CopyButton value="Qm7Xk3nP" label="Copiar CID" />
          </div>
        </SettingRow>
        <SettingRow label="Ceramic Stream ID" description="ID do seu stream de dados mutáveis no Ceramic Network" onchain={true}>
          <div className="mono-display">
            <span className="mono-text small">kjz...9x2</span>
            <CopyButton value="kjz9x2" label="Copiar Stream ID" />
          </div>
        </SettingRow>
      </div>
      <div className="setting-card">
        <SettingRow label="Apps com acesso aos seus dados" description="Ver e revogar acesso de apps ao seu Ceramic stream" onchain={true}>
          <button className="btn-ghost-sm">Gerenciar acessos</button>
        </SettingRow>
        <SettingRow label="Replicação de backup" description="Manter cópias dos seus dados em nós IPFS adicionais">
          <Toggle checked={true} onChange={() => {}} label="Backup em nós IPFS adicionais" />
        </SettingRow>
      </div>
    </section>
  )
}

// ─── SEÇÃO: Danger Zone ───────────────────────────────────────────────────

function SectionDanger() {
  const [confirm, setConfirm] = useState('')
  const [step,    setStep]    = useState('idle') // idle | transfer | burn

  return (
    <section className="settings-section" id="danger">
      <SectionHeader
        icon={icons.danger}
        title="Danger Zone"
        subtitle="Ações irreversíveis. Executadas diretamente no smart contract."
      />

      <div className="setting-card danger-card">
        <div className="danger-row">
          <div>
            <p className="danger-label">Transferir identidade</p>
            <p className="danger-desc">
              Mover sua identidade Plasmmer completa para outro endereço ETH.
              Só pode ser feito <strong>uma vez</strong> — o contrato proíbe reversal.
            </p>
          </div>
          <button className="btn-danger" onClick={() => setStep('transfer')}>
            Transferir
          </button>
        </div>

        {step === 'transfer' && (
          <div className="danger-confirm-box">
            <p className="danger-warning">⚠️ Esta ação é irreversível e gera tx on-chain</p>
            <input className="input-field" placeholder="Novo endereço ETH (0x...)"
              aria-label="Endereço de destino" />
            <input className="input-field" placeholder="Digite 'TRANSFERIR' para confirmar"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              aria-label="Confirmação de transferência" />
            <div className="danger-actions">
              <button className="btn-ghost-sm" onClick={() => setStep('idle')}>Cancelar</button>
              <button className="btn-danger"
                disabled={confirm !== 'TRANSFERIR'}
                aria-disabled={confirm !== 'TRANSFERIR'}>
                Confirmar Transferência
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="setting-card danger-card">
        <div className="danger-row">
          <div>
            <p className="danger-label">Apagar identidade Plasmmer</p>
            <p className="danger-desc">
              Remove permanentemente seu perfil do contrato. Sua wallet ETH permanece intacta,
              mas o vínculo DID ↔ ETH é destruído para sempre. Não há como desfazer.
            </p>
          </div>
          <button className="btn-danger crimson" onClick={() => setStep('burn')}>
            Apagar
          </button>
        </div>

        {step === 'burn' && (
          <div className="danger-confirm-box">
            <p className="danger-warning">☠️ AÇÃO IRREVERSÍVEL — NÃO HÁ COMO RECUPERAR</p>
            <input className="input-field" placeholder="Digite 'APAGAR MINHA IDENTIDADE' para confirmar"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              aria-label="Confirmação de exclusão de identidade" />
            <div className="danger-actions">
              <button className="btn-ghost-sm" onClick={() => setStep('idle')}>Cancelar</button>
              <button className="btn-danger crimson"
                disabled={confirm !== 'APAGAR MINHA IDENTIDADE'}
                aria-disabled={confirm !== 'APAGAR MINHA IDENTIDADE'}>
                Apagar identidade para sempre
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('identity')
  const [sidebarOpen,   setSidebarOpen]   = useState(false)

  const user = MOCK_USER

  const sectionMap = {
    identity: <SectionIdentity user={user} />,
    wallet:   <SectionWallet   user={user} />,
    privacy:  <SectionPrivacy />,
    apps:     <SectionApps />,
    recovery: <SectionRecovery />,
    dao:      <SectionDAO />,
    alerts:   <SectionAlerts />,
    data:     <SectionData />,
    danger:   <SectionDanger />,
  }

  return (
    <div className="settings-page">

      {/* ── Topbar mobile ── */}
      <div className="settings-topbar">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menu de configurações" aria-expanded={sidebarOpen}>
          <span /><span /><span />
        </button>
        <span className="topbar-title">Configurações</span>
      </div>

      {/* ── Sidebar ── */}
      <nav className={`settings-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Navegação de configurações">
        {/* User mini-card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.displayName?.slice(0, 2).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-name">{user.displayName}</span>
            <span className="sidebar-handle">@{user.handle}</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav items */}
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
            className={`nav-item ${activeSection === item.id ? 'active' : ''} ${item.id === 'danger' ? 'danger' : ''}`}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.tag && <span className={`nav-tag tag-${item.tag.replace('-','')}`}>{item.tag}</span>}
          </button>
        ))}

        <div className="sidebar-divider" />
        <div className="sidebar-footer">
          <span className="sidebar-ver">Plasmmer v0.1-alpha</span>
        </div>
      </nav>

      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* ── Conteúdo ── */}
      <main className="settings-main" id="main-content">
        {sectionMap[activeSection]}
      </main>
    </div>
  )
}
