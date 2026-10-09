export const STATUSES = ['new', 'contacted', 'qualified', 'lost'];

export default function LeadFields({ values, onChange }) {
  function updateField(event) {
    onChange({ ...values, [event.target.name]: event.target.value });
  }

  return (
    <>
      <label htmlFor="name">Full name <span className="required">*</span></label>
      <input id="name" name="name" value={values.name} onChange={updateField} maxLength="120" autoComplete="name" required />

      <label htmlFor="email">Email address <span className="required">*</span></label>
      <input id="email" name="email" type="email" value={values.email} onChange={updateField} maxLength="254" autoComplete="email" required />

      <label htmlFor="phone">Phone number</label>
      <input id="phone" name="phone" type="tel" value={values.phone} onChange={updateField} autoComplete="tel" />

      <label htmlFor="status">Status</label>
      <select id="status" name="status" value={values.status} onChange={updateField}>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </>
  );
}
