import Card from './Card';
import FadeIn from './FadeIn';

interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export default function ProsCons({ pros = [], cons = [] }: ProsConsProps) {
  const renderList = (items: string[], good: boolean) => (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${good ? 'bg-good/20 text-good' : 'bg-bad/20 text-bad'}`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {good ? <path d="M5 13l4 4L19 7" /> : <path d="M6 18L18 6M6 6l12 12" />}
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FadeIn>
        <Card accent="good">
          {pros.length > 0 ? (
            renderList(pros, true)
          ) : (
            <p className="text-text-muted">No data yet.</p>
          )}
        </Card>
      </FadeIn>
      <FadeIn>
        <Card accent="bad">
          {cons.length > 0 ? (
            renderList(cons, false)
          ) : (
            <p className="text-text-muted">No data yet.</p>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
