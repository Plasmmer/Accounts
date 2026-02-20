import '../../claude-pages.css';

const dependants = [
  {
    id: 'dep-01',
    name: 'Lia M.',
    relation: 'Filha',
    ageBand: '13-15',
    mode: 'Teen-safe obrigatório',
    limits: 'R$ 40/dia • sem P2P'
  },
  {
    id: 'dep-02',
    name: 'Noah M.',
    relation: 'Enteado',
    ageBand: '16-17',
    mode: 'Teen-safe + review semanal',
    limits: 'R$ 80/dia • trades whitelist'
  }
];

const guardrails = [
  'Bloquear DM de adultos não verificados',
  'Cooldown para itens recém-listados (anti-rug)',
  'Alertar linguagem de grooming em tempo real',
  'Limite de transações por idade + risco da conta'
];

export default function FamilyManagementPreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Family / Dependants mock</p>
        <h1 className="title">Adicionar e gerenciar familiares/dependentes</h1>
        <p className="subtitle">
          Mock acionável para custody de contas teen, consentimento responsável e trilha de segurança com mínimo de PII.
        </p>
      </header>

      <section className="card">
        <h2 className="section-title">Adicionar dependente</h2>
        <p className="section-subtitle">Fluxo sugerido: vínculo familiar + atestado etário + política de proteção padrão.</p>

        <div className="family-grid">
          <label className="field">
            <span>Nome de exibição</span>
            <input type="text" placeholder="Ex.: Lia M." />
          </label>
          <label className="field">
            <span>Relação</span>
            <select defaultValue="">
              <option value="" disabled>Selecione</option>
              <option>Filha(o)</option>
              <option>Enteada(o)</option>
              <option>Sobrinha(o)</option>
              <option>Tutelada(o)</option>
            </select>
          </label>
          <label className="field">
            <span>Faixa etária (atestado)</span>
            <select defaultValue="13-15">
              <option>0-12</option>
              <option>13-15</option>
              <option>16-17</option>
            </select>
          </label>
          <label className="field">
            <span>Wallet/ID de referência</span>
            <input type="text" placeholder="did:plasmmer:child-xxxx" />
          </label>
        </div>

        <div className="row" style={{ marginTop: '.85rem' }}>
          <span className="label">Modo inicial</span>
          <span className="badge">Teen-safe obrigatório</span>
        </div>

        <section className="action-row">
          <button type="button" className="button secondary">Salvar rascunho</button>
          <button type="button" className="button">Criar vínculo + enviar consentimento</button>
        </section>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Dependentes vinculados</h2>
        <p className="section-subtitle">Gestão contínua de limites, permissões e gatilhos de proteção.</p>

        {dependants.map((dependant) => (
          <article className="dependant-card" key={dependant.id}>
            <div>
              <p className="agent-name">{dependant.name} <span className="muted-inline">{dependant.relation}</span></p>
              <p className="agent-role">Faixa etária: {dependant.ageBand}</p>
              <p className="agent-role">Regras financeiras: {dependant.limits}</p>
            </div>
            <div className="agent-meta">
              <span className="badge">{dependant.mode}</span>
              <code>{dependant.id}</code>
            </div>
          </article>
        ))}
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Guardrails ativos (Habbo-like social world)</h2>
        <ul className="scope-list">
          {guardrails.map((rule) => (
            <li key={rule}><span className="pill">{rule}</span></li>
          ))}
        </ul>
      </section>
    </main>
  );
}
