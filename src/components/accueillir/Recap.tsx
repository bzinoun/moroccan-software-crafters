import { frenchSpacing } from "@/lib/french";

// The summary at the top of step 4. The labels are ours; the
// values are what the person typed, so they stay as typed.

type RecapProps = {
  rows: readonly (readonly [label: string, value: string])[];
};

export function Recap({ rows }: RecapProps) {
  return (
    <div
      id="recap"
      hidden={rows.length === 0}
      className="mb-5 rounded-sm border border-line bg-paper px-4 py-3 text-[0.86rem] leading-[1.45]"
    >
      {rows.length ? (
        <>
          <p className="mb-1.5 font-semibold">Votre demande</p>
          <dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-3.5 gap-y-[3px]">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-muted">{frenchSpacing(label)}</dt>
                <dd className="m-0 font-medium [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </div>
  );
}
