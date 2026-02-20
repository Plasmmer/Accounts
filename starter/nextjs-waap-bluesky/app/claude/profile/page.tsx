import '../../claude-pages.css';

const subscriptions = [
  { name: 'Plasmmer Pro', status: 'Active', renewal: '2026-03-20' },
  { name: 'DAO Ops Analytics', status: 'Trial', renewal: '2026-02-28' }
];

const humanPassportSignals = [
  { label: 'Human score', value: '93 / 100' },
  { label: 'Verified uniqueness', value: 'Confirmed' },
  { label: 'Sybil risk', value: 'Low' },
  { label: 'Issuing authority', value: 'human.tech passport attestor' }
];

export default function ClaudeProfilePreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude page</p>
        <h1 className="title">Plasmmmer User Dashboard</h1>
        <p className="subtitle">
          Visão unificada de identidade, assinaturas e dados do Human Passport para proteger governança contra sybil.
        </p>
      </header>

      <section className="card">
        <div className="row"><span className="label">Display name</span><strong>Perla Rosa</strong></div>
        <div className="row"><span className="label">Bluesky handle</span><span className="value">@perla.bsky.social</span></div>
        <div className="row"><span className="label">Ethereum Wallet</span><span className="value">0x98f2...d7A4</span></div>
        <div className="row"><span className="label">Status</span><span className="badge">Connected</span></div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Subscriptions</h2>
        {subscriptions.map((subscription) => (
          <div className="row" key={subscription.name}>
            <span className="label">{subscription.name}</span>
            <span>
              <span className="pill">{subscription.status}</span>
              <span className="muted-inline">Renews {subscription.renewal}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Human Passport</h2>
        <p className="section-subtitle">
          Mock inspirado em <code>docs.wallet.human.tech/recipes/human-passport</code> para exibir sinalização de humanidade na dashboard.
        </p>
        {humanPassportSignals.map((signal) => (
          <div className="row" key={signal.label}>
            <span className="label">{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
