import Link from 'next/link';
import '../claude-pages.css';

const pages = [
  { href: '/claude/profile', title: 'Plasmmmer Profile' },
  { href: '/claude/settings', title: 'Settings Page' },
  { href: '/claude/settings-additions', title: 'Settings Additions' },
  { href: '/claude/access-request', title: 'Plasmmer Account Access Request' },
  { href: '/claude/family', title: 'Family & Dependants Manager' }
];

export default function ClaudeLayoutsIndex() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude Work 19/02/2026</p>
        <h1 className="title">Visual Layout Previews</h1>
        <p className="subtitle">Página índice com versões visualizáveis das telas feitas na pasta <code>claude-work-190226</code>.</p>
      </header>
      <section className="card">
        {pages.map((page) => (
          <div className="row" key={page.href}>
            <span className="label">{page.title}</span>
            <Link href={page.href}>Abrir</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
