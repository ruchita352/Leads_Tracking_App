import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LeadDetail from './pages/LeadDetail.jsx';
import LeadForm from './pages/LeadForm.jsx';
import LeadList from './pages/LeadList.jsx';

function NotFound() {
  return (
    <section className="empty-state error-state">
      <p className="eyebrow">ERROR 404</p>
      <h1>Page not found</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <a className="button" href="/leads">Back to leads</a>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LeadList />} />
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/new" element={<LeadForm />} />
        <Route path="/leads/:id/edit" element={<LeadForm />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
