import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { request } from '../api.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LeadFields from '../components/LeadFields.jsx';

const EMPTY_LEAD = { name: '', email: '', phone: '', status: 'new' };

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    request(`/api/leads/${id}`)
      .then(({ lead: currentLead }) => setLead(currentLead))
      .catch(setError);
  }, [id]);

  async function saveLead(event) {
    event.preventDefault();
    setError(null);

    try {
      const result = await request(isEditing ? `/api/leads/${id}` : '/api/leads', {
        method: isEditing ? 'PATCH' : 'POST',
        body: JSON.stringify(lead)
      });
      navigate(`/leads/${result.lead._id}`);
    } catch (saveError) {
      setError(saveError);
    }
  }

  const heading = isEditing ? 'Edit lead' : 'Add a lead';

  if (isEditing && !lead._id && !error) {
    return <p className="muted">Loading lead…</p>;
  }
  if (isEditing && !lead._id && error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Link className="back-link" to={isEditing ? `/leads/${id}` : '/leads'}>← Back</Link>
      <section className="form-panel">
        <p className="eyebrow">LEAD DETAILS</p>
        <h1>{heading}</h1>
        <p className="muted">Keep contact information and pipeline status up to date.</p>
        <ErrorMessage error={error} />

        <form className="lead-form" onSubmit={saveLead}>
          <LeadFields values={lead} onChange={setLead} />
          <div className="form-actions">
            <button className="button" type="submit">{isEditing ? 'Save changes' : 'Create lead'}</button>
            <Link className="button button-muted" to={isEditing ? `/leads/${id}` : '/leads'}>Cancel</Link>
          </div>
        </form>
      </section>
    </>
  );
}
