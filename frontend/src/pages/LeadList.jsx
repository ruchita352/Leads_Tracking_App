import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { request } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import { STATUSES } from '../components/LeadFields.jsx';

const PAGE_SIZE = 6;

export default function LeadList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchInput, setSearchInput] = useState(search);
  const [result, setResult] = useState({ leads: [], pagination: { pages: 0, total: 0 } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ search, status, page: String(page), limit: String(PAGE_SIZE) });
    setError('');
    setLoading(true);

    request(`/api/leads?${query}`, { signal: controller.signal })
      .then((data) => {
        setResult(data);
        setError('');
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((params) => {
        if (searchInput) params.set('search', searchInput);
        else params.delete('search');
        params.delete('page');
        return params;
      }, { replace: true });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  function updateStatus(event) {
    setSearchParams((params) => {
      if (event.target.value) params.set('status', event.target.value);
      else params.delete('status');
      params.delete('page');
      return params;
    });
  }

  const { leads, pagination } = result;
  const hasFilters = Boolean(search || status);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR PIPELINE</p>
          <h1>Leads</h1>
          <p className="muted">{pagination.total} {pagination.total === 1 ? 'lead' : 'leads'} in your pipeline</p>
        </div>
        <Link className="button" to="/leads/new">＋ Add lead</Link>
      </section>

      <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
        <label className="search-field">
          <span className="sr-only">Search by name or email</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search name or email"
            autoComplete="off"
          />
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={updateStatus}>
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
            ))}
          </select>
        </label>
        {hasFilters && <Link className="text-link" to="/leads">Clear</Link>}
      </form>

      {error && <p className="alert" role="alert">{error}</p>}
      {loading && <p className="muted">Loading leads…</p>}
      {!error && !loading && leads.length > 0 && (
        <>
          <div className="lead-list">
            {leads.map((lead) => (
              <Link className="lead-card" key={lead._id} to={`/leads/${lead._id}`}>
                <Avatar name={lead.name} />
                <span className="lead-main">
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                </span>
                <span className="lead-phone">{lead.phone || 'No phone number'}</span>
                <span className={`status status-${lead.status}`}>{lead.status}</span>
                <span className="card-arrow" aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
          {pagination.pages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              {page > 1 && <Link to={pageLink(search, status, page - 1)}>← Previous</Link>}
              <span>Page {page} of {pagination.pages}</span>
              {page < pagination.pages && <Link to={pageLink(search, status, page + 1)}>Next →</Link>}
            </nav>
          )}
        </>
      )}
      {!error && !loading && leads.length === 0 && (
        <section className="empty-state">
          <div className="empty-icon">↗</div>
          <h2>{hasFilters ? 'No leads match these filters' : 'Your pipeline starts here'}</h2>
          <p className="muted">
            {hasFilters
              ? 'Try a different search or clear your filters.'
              : 'Add your first lead to start keeping track of your prospects.'}
          </p>
          {!hasFilters && <Link className="button" to="/leads/new">Add your first lead</Link>}
        </section>
      )}
    </>
  );
}

function pageLink(search, status, page) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  params.set('page', String(page));
  return `/leads?${params}`;
}
