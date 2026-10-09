import { getErrorMessages } from '../api.js';

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="alert" role="alert">
      <strong>Please check the following:</strong>
      <ul>
        {getErrorMessages(error).map((message) => <li key={message}>{message}</li>)}
      </ul>
    </div>
  );
}
