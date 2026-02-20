import '../../claude-pages.css';

export default function ClaudeProfilePreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude page</p>
        <h1 className="title">Plasmmmer Profile</h1>
        <p className="subtitle">Resumo visual do componente <code>PlasmmmerProfile.jsx</code> com card de identidade e wallet badge.</p>
      </header>

      <section className="card">
        <div className="row"><span className="label">Display name</span><strong>Perla Rosa</strong></div>
        <div className="row"><span className="label">Bluesky handle</span><span className="value">@perla.bsky.social</span></div>
        <div className="row"><span className="label">Ethereum Wallet</span><span className="value">0x98f2...d7A4</span></div>
        <div className="row"><span className="label">Status</span><span className="badge">Connected</span></div>
      </section>
    </main>
  );
}
