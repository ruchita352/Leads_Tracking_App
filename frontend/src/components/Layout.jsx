import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/leads">
          <span className="brand-mark">L</span> Leadspace
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/leads">Leads</Link>
          <Link className="button button-small" to="/leads/new">Add lead</Link>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="site-footer">Leadspace · Simple lead tracking</footer>
    </>
  );
}
