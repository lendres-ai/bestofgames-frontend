import Card from './Card';

interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export default function ProsCons({ pros = [], cons = [] }: ProsConsProps) {
  const renderList = (items: string[], type: 'good' | 'bad') => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className={type === 'good' ? 'text-good' : 'text-bad'}>
            {type === 'good' ? '✔︎' : '✖︎'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title={pros.length ? 'Pros' : undefined} accent="good">
        {pros.length ? renderList(pros, 'good') : (
          <p className="text-text-muted text-sm">No data yet.</p>
        )}
      </Card>
      <Card title={cons.length ? 'Cons' : undefined} accent="bad">
        {cons.length ? renderList(cons, 'bad') : (
          <p className="text-text-muted text-sm">No data yet.</p>
        )}
      </Card>
    </div>
  );
}
