export default function Layout({ children }) {
  return (
    <div style={{ padding: 20 }}>
      <nav>
        <a href="/">Accueil</a> | <a href="/compte">Compte</a>
      </nav>

      <main>{children}</main>
    </div>
  );
}
