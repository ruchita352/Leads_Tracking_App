export default function Avatar({ name, large = false }) {
  const className = large ? 'avatar avatar-large' : 'avatar';
  return <span className={className}>{name.trim().charAt(0).toUpperCase()}</span>;
}
