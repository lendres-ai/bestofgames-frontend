import Card from './Card';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

const CheckIcon = () => (
  <svg className="h-4 w-4 flex-none text-good" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4 flex-none text-bad" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.3 5.71 12 12l6.3 6.29-1.42 1.42L10.59 13.4 4.3 19.71 2.88 18.3 9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
  </svg>
);

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card accent="good">
        {pros.length ? (
          <>
            <h3 className="mb-2 font-semibold text-good">Pros</h3>
            <ul className="space-y-1">
              {pros.map((p) => (
                <li key={p} className="flex items-center gap-2 rounded-full bg-bg/40 px-2 py-1 text-sm">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-text-muted">No data yet.</p>
        )}
      </Card>
      <Card accent="bad">
        {cons.length ? (
          <>
            <h3 className="mb-2 font-semibold text-bad">Cons</h3>
            <ul className="space-y-1">
              {cons.map((c) => (
                <li key={c} className="flex items-center gap-2 rounded-full bg-bg/40 px-2 py-1 text-sm">
                  <XIcon />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-text-muted">No data yet.</p>
        )}
      </Card>
    </div>
  );
}

