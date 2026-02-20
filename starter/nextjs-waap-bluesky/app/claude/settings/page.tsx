import '../../claude-pages.css';

export default function ClaudeSettingsPreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude page</p>
        <h1 className="title">Settings Page</h1>
        <p className="subtitle">Layout enxuto das seções Account, Security e Session descritas em <code>SettingsPage.jsx</code>.</p>
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
    </main>
  );
}
