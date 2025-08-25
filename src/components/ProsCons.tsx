import Card from './Card';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

function List({ items, icon }: { items: string[]; icon: JSX.Element }) {
  if (!items || items.length === 0) {
    return <p className="text-text-muted">No data yet.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-sm"
        >
          {icon}
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card accent="good">
        {pros.length > 0 && <h3 className="mb-2 font-semibold">Pros</h3>}
        <List
          items={pros}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-good"
            >
              <path d="M9 12.75 11.25 15 15 9.75" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          }
        />
      </Card>
      <Card accent="bad">
        {cons.length > 0 && <h3 className="mb-2 font-semibold">Cons</h3>}
        <List
          items={cons}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-bad"
            >
              <path d="M15 9 9 15m0-6 6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          }
        />
      </Card>
    </div>
  );
}
