import '../../claude-pages.css';

const requestedScopes = ['name', 'email', 'avatar'];

export default function AccessRequestPreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Consent mock</p>
        <h1 className="title">App is requesting access to your Plasmmer Account</h1>
        <p className="subtitle">
          Fluxo de consentimento para autorizar leitura limitada de identidade antes de conectar com apps terceiros.
        </p>
      </header>

      <section className="card">
        <div className="row"><span className="label">Requesting app</span><strong>OpenClawd Questboard</strong></div>
        <div className="row"><span className="label">Developer</span><span className="value">Plasmmer Labs DAO</span></div>
        <div className="row"><span className="label">Network</span><span className="value">WaaP Identity + EVM</span></div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">It will see your:</h2>
        <ul className="scope-list">
          {requestedScopes.map((scope) => (
            <li key={scope}><span className="pill">{scope}</span></li>
          ))}
        </ul>
        <p className="section-subtitle" style={{ marginTop: '.75rem' }}>
          Nenhum acesso de escrita, transferências on-chain ou assinatura de transações está sendo solicitado.
        </p>
      </section>

      <section className="action-row">
        <button className="button secondary" type="button">Deny</button>
        <button className="button" type="button">Allow access</button>
      </section>
    </main>
  );
}
