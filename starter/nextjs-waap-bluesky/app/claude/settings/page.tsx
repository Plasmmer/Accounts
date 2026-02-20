import '../../claude-pages.css';

const agents = [
  {
    name: 'OpenClawd Sentinel',
    role: 'Identity guardian',
    status: 'Online',
    model: 'openclawd://sentinel-v3'
  },
  {
    name: 'OpenClawd Treasury Witch',
    role: 'DAO budget and grant reviewer',
    status: 'Monitoring',
    model: 'openclawd://treasury-v1'
  },
  {
    name: 'OpenClawd Moderation Relay',
    role: 'Safety triage + community escalations',
    status: 'Idle',
    model: 'openclawd://relay-v2'
  }
];

export default function ClaudeSettingsPreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude page</p>
        <h1 className="title">Settings Dashboard</h1>
        <p className="subtitle">
          Nova seção de agentes OpenClawd AI conectados à conta Plasmmer, junto com controles essenciais de segurança.
        </p>
      </header>

      <section className="grid">
        <article className="stat">
          <p className="label">Account</p>
          <strong>@perla.bsky.social</strong>
        </article>
        <article className="stat">
          <p className="label">Security</p>
          <strong>2FA enabled</strong>
        </article>
        <article className="stat">
          <p className="label">Session</p>
          <strong>WaaP + Bluesky</strong>
        </article>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="row"><span className="label">Email alerts</span><span className="pill">On</span></div>
        <div className="row"><span className="label">Sign-out everywhere</span><span className="pill">Action</span></div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Your OpenClawd AI agents</h2>
        <p className="section-subtitle">
          Agentes com permissões diferentes para proteger identidade, finanças DAO e moderação de comunidade.
        </p>
        {agents.map((agent) => (
          <article className="agent-card" key={agent.name}>
            <div>
              <p className="agent-name">{agent.name}</p>
              <p className="agent-role">{agent.role}</p>
            </div>
            <div className="agent-meta">
              <span className="pill">{agent.status}</span>
              <code>{agent.model}</code>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
