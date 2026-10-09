import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { request } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    request(`/api/leads/${id}`)
      .then((data) => {
        setLead(data.lead);
        setNotes(data.notes);
      })
      .catch(setError);
  }, [id]);

  async function addNote(event) {
    event.preventDefault();
    setError(null);

    try {
      const { note } = await request(`/api/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      setNotes((currentNotes) => [note, ...currentNotes]);
      setContent('');
    } catch (noteError) {
      setError(noteError);
    }
  }

  async function deleteLead() {
    if (!window.confirm('Delete this lead and all its notes?')) return;

    try {
      await request(`/api/leads/${id}`, { method: 'DELETE' });
      navigate('/leads');
    } catch (deleteError) {
      setError(deleteError);
    }
  }

  if (error && !lead) return <ErrorMessage error={error} />;
  if (!lead) return <p className="muted">Loading lead…</p>;

  return (
    <>
      <Link className="back-link" to="/leads">← All leads</Link>
      <section className="detail-heading">
        <div className="detail-identity">
          <Avatar name={lead.name} large />
          <div>
            <p className="eyebrow">LEAD PROFILE</p>
            <h1>{lead.name}</h1>
            <span className={`status status-${lead.status}`}>{lead.status}</span>
          </div>
        </div>
        <div className="detail-actions">
          <Link className="button button-muted" to={`/leads/${id}/edit`}>Edit lead</Link>
          <button className="button button-danger" type="button" onClick={deleteLead}>Delete</button>
        </div>
      </section>

      <ErrorMessage error={error} />
      <div className="detail-grid">
        <section className="panel contact-panel">
          <div className="section-heading">
            <div><p className="eyebrow">CONTACT</p><h2>Contact details</h2></div>
          </div>
          <dl className="contact-list">
            <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{lead.phone || 'Not provided'}</dd></div>
            <div><dt>Added</dt><dd>{new Date(lead.createdAt).toLocaleDateString()}</dd></div>
          </dl>
        </section>

        <section className="panel notes-panel">
          <div className="section-heading">
            <div><p className="eyebrow">ACTIVITY</p><h2>Notes <span className="count">{notes.length}</span></h2></div>
          </div>
          <form className="note-form" onSubmit={addNote}>
            <label className="sr-only" htmlFor="content">Add a note</label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows="3"
              maxLength="5000"
              placeholder="Write a note about this lead..."
              required
            />
            <button className="button" type="submit">Add note</button>
          </form>
          {notes.length > 0 ? (
            <div className="notes-list">
              {notes.map((note) => (
                <article className="note" key={note._id}>
                  <p>{note.content}</p>
                  <time dateTime={new Date(note.createdAt).toISOString()}>
                    {new Date(note.createdAt).toLocaleString()}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted no-notes">No notes yet. Add one above to keep a record of your conversation.</p>
          )}
        </section>
      </div>
    </>
  );
}
