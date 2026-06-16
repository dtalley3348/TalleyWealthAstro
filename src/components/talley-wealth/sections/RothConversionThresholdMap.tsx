import { useId, useMemo, useState } from 'react';

const FACTS = {
  taxYear: 2026,
  filingStatus: 'Married Filing Jointly',
  sources: [
    {
      label: 'IRS 2026 inflation adjustments',
      href: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill',
    },
    {
      label: 'SSA 2026 Medicare premiums and IRMAA',
      href: 'https://www.ssa.gov/benefits/medicare/medicare-premiums.html',
    },
  ],
} as const;

type IncomeMeasure = 'Taxable income' | 'MAGI' | 'AGI / MAGI';

type Target = {
  id: string;
  label: string;
  amount: number;
  measure: IncomeMeasure;
  shortReason: string;
  goPastReason: string;
};

const TARGETS: Target[] = [
  {
    id: 'top-12',
    label: 'Top of the 12% bracket',
    amount: 100_800,
    measure: 'Taxable income',
    shortReason: 'This is often the first bracket to fill after earned income drops.',
    goPastReason: 'Future RMDs may be large enough that stopping here leaves too much tax-deferred money for later.',
  },
  {
    id: 'senior-deduction',
    label: 'Senior deduction phaseout starts',
    amount: 150_000,
    measure: 'AGI / MAGI',
    shortReason: 'This can matter once the age-65 senior deduction is in play under current law.',
    goPastReason: 'The deduction may be less important than reducing a much larger future RMD problem.',
  },
  {
    id: 'top-22',
    label: 'Top of the 22% bracket',
    amount: 211_400,
    measure: 'Taxable income',
    shortReason: 'This is a common target when the 12% bracket is too small for the future tax problem.',
    goPastReason: 'A larger IRA balance, long life, or estate goal can justify using more room now.',
  },
  {
    id: 'first-irmaa',
    label: 'First 2026 IRMAA line',
    amount: 218_000,
    measure: 'MAGI',
    shortReason: 'One dollar over this MAGI line can raise Medicare Part B and Part D premiums.',
    goPastReason: 'Sometimes paying a Medicare surcharge is still better than letting the IRA problem compound.',
  },
  {
    id: 'top-24',
    label: 'Top of the 24% bracket',
    amount: 403_550,
    measure: 'Taxable income',
    shortReason: 'This is a more aggressive target that can still be reasonable in a large-RMD scenario.',
    goPastReason: 'Going above this line usually needs a very strong reason and careful modeling.',
  },
];

const CHART_MAX = 430_000;
const CHART = {
  width: 1100,
  height: 610,
  top: 44,
  bottom: 540,
  labelX: 24,
  labelWidth: 360,
  leaderStartX: 410,
  plotX: 600,
  plotWidth: 340,
  axisX: 1040,
};

const labelOffsets: Record<string, number> = {
  'top-24': 12,
  'first-irmaa': -22,
  'top-22': 22,
  'senior-deduction': 0,
  'top-12': 0,
};

const money = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const compactMoney = (value: number) => `$${Math.round(value / 1_000)}k`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const yForAmount = (amount: number) => {
  const pct = clamp(amount / CHART_MAX, 0, 1);
  return CHART.bottom - pct * (CHART.bottom - CHART.top);
};

const labelYForTarget = (target: Target) =>
  clamp(yForAmount(target.amount) + (labelOffsets[target.id] ?? 0), CHART.top + 22, CHART.bottom - 22);

export default function RothConversionThresholdMap() {
  const inputId = useId();
  const [planningIncome, setPlanningIncome] = useState(72_000);
  const [selectedTargetId, setSelectedTargetId] = useState('top-12');

  const selectedTarget = TARGETS.find((target) => target.id === selectedTargetId) ?? TARGETS[0];
  const rawRoom = selectedTarget.amount - planningIncome;
  const conversionRoom = Math.max(0, rawRoom);
  const overTarget = rawRoom < 0;
  const currentY = yForAmount(planningIncome);
  const selectedY = yForAmount(selectedTarget.amount);
  const fillTopY = Math.max(CHART.top, Math.min(currentY, selectedY) - 0.75);
  const fillHeight = CHART.bottom - fillTopY;

  const summary = overTarget
    ? `You are already above this planning line by about ${money(Math.abs(rawRoom))}.`
    : `The estimated Roth conversion room to this line is ${money(conversionRoom)}.`;

  const selectedTargetLabel = useMemo(
    () => `${selectedTarget.label} at ${money(selectedTarget.amount)}`,
    [selectedTarget],
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-elegant">
        <div className="border-b border-border bg-background p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Roth conversion room</p>
              <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-primary md:text-3xl">
                Fill the available tax space.
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                Enter one planning-income number, then choose the line you may want to fill toward. The selected fill lands on the threshold line so the tradeoff is easier to see.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <label htmlFor={inputId} className="text-sm font-bold text-primary">
                  Estimated current planning income
                </label>
                <output htmlFor={inputId} className="text-lg font-bold tabular-nums text-accent">
                  {money(planningIncome)}
                </output>
              </div>
              <input
                id={inputId}
                type="range"
                min={0}
                max={430_000}
                step={1_000}
                value={planningIncome}
                aria-valuetext={money(planningIncome)}
                onChange={(event) => setPlanningIncome(Number(event.currentTarget.value))}
                className="tw-roth-range mt-3"
                style={{ ['--fill' as string]: `${(planningIncome / CHART_MAX) * 100}%` }}
              />
              <div className="mt-1 flex justify-between text-xs tabular-nums text-muted-foreground">
                <span>$0k</span>
                <span>$430k</span>
              </div>
            </div>

            <div className="rounded-md bg-primary px-5 py-4 text-right text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">Estimated room</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{money(conversionRoom)}</p>
              <p className="mt-1 text-xs text-white/65">{selectedTarget.measure}</p>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Important simplification</p>
            <p className="mt-2 text-sm leading-relaxed text-primary">
              Bracket targets use taxable income. IRMAA uses MAGI. The senior deduction line can depend on a different income measure. This visual uses one input to show the planning shape; the actual calculation has to reconcile the income definitions before anyone acts.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Selected line</p>
                <h4 className="mt-2 font-serif text-2xl font-bold leading-tight text-primary">{selectedTarget.label}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {money(selectedTarget.amount)} · {selectedTarget.measure}
                </p>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {summary} This is where the Roth conversion question moves from a yes-or-no idea into a pacing decision.
              </p>
            </div>

              <div className="mt-7 overflow-x-auto rounded-md bg-muted/35 p-4">
                <svg
                  role="img"
                  aria-label={`Roth conversion room chart. ${selectedTargetLabel}. ${summary}`}
                  viewBox={`0 0 ${CHART.width} ${CHART.height}`}
                  className="min-w-[980px] overflow-visible"
                >
                  <rect x={CHART.plotX} y={CHART.top} width={CHART.plotWidth} height={CHART.bottom - CHART.top} rx="10" fill="hsl(210 14% 91%)" stroke="hsl(214 20% 82%)" />
                  <rect x={CHART.plotX} y={fillTopY} width={CHART.plotWidth} height={fillHeight} rx="0" fill="hsl(34 46% 65%)" opacity="0.9" />
                  <rect x={CHART.plotX} y={CHART.top} width={CHART.plotWidth} height={CHART.bottom - CHART.top} rx="10" fill="none" stroke="hsl(214 20% 82%)" />

                  {[0, 100_000, 200_000, 300_000, 400_000].map((tick) => {
                    const y = yForAmount(tick);
                    return (
                      <g key={tick}>
                        <line x1={CHART.plotX} x2={CHART.plotX + CHART.plotWidth} y1={y} y2={y} stroke="hsl(214 20% 76%)" strokeDasharray="3 5" />
                        <text x={CHART.axisX} y={y + 4} textAnchor="end" fontSize="12" fill="hsl(214 12% 38%)">
                          {compactMoney(tick)}
                        </text>
                      </g>
                    );
                  })}

                  {TARGETS.map((target) => {
                    const active = target.id === selectedTarget.id;
                    const y = yForAmount(target.amount);
                    const labelY = labelYForTarget(target);
                    return (
                      <g key={target.id}>
                        <line
                          x1={CHART.leaderStartX}
                          x2={CHART.plotX + CHART.plotWidth}
                          y1={y}
                          y2={y}
                          stroke={active ? 'hsl(34 46% 50%)' : 'hsl(214 20% 74%)'}
                          strokeWidth={active ? 1.5 : 1}
                          strokeDasharray={active ? undefined : '4 5'}
                        />
                        <line
                          x1={CHART.leaderStartX}
                          x2={CHART.leaderStartX + 24}
                          y1={labelY}
                          y2={y}
                          stroke={active ? 'hsl(34 46% 50%)' : 'hsl(214 20% 82%)'}
                        />
                        <circle
                          cx={CHART.plotX + CHART.plotWidth - 13}
                          cy={y}
                          r={active ? 6 : 5}
                          fill={active ? 'hsl(34 46% 50%)' : 'white'}
                          stroke={active ? 'hsl(34 46% 50%)' : 'hsl(214 20% 82%)'}
                        />
                        <foreignObject x={CHART.labelX} y={labelY - 25} width={CHART.labelWidth} height="56">
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedTargetId(target.id)}
                            className={`h-full w-full rounded-md border px-3 py-2 text-left transition ${
                              active
                                ? 'border-accent bg-accent text-accent-foreground shadow-elegant'
                                : 'border-border bg-card text-primary hover:border-accent/70'
                            }`}
                          >
                            <span className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold leading-tight">{target.label}</span>
                              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] opacity-75">{target.measure}</span>
                            </span>
                            <span className="mt-0.5 block text-base font-bold tabular-nums">{money(target.amount)}</span>
                          </button>
                        </foreignObject>
                      </g>
                    );
                  })}

                  <line x1={CHART.plotX} x2={CHART.plotX + CHART.plotWidth} y1={currentY} y2={currentY} stroke="hsl(211 32% 21%)" strokeWidth="2" />
                  <foreignObject x={CHART.plotX + 12} y={currentY - 16} width="128" height="32">
                    <div className="rounded-sm bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                      Current {money(planningIncome)}
                    </div>
                  </foreignObject>
                </svg>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                <div className="rounded-md border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Current input</p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-primary">{money(planningIncome)}</p>
                </div>
                <div className="rounded-md border border-border bg-card p-4 lg:col-span-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">What the fill means</p>
                  <p className="mt-1 text-sm leading-relaxed text-primary">{summary}</p>
                </div>
                <article className="rounded-md border border-border bg-card p-5 lg:col-span-2">
                  <h5 className="font-serif text-2xl font-bold text-primary">Why this line can be a useful target</h5>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{selectedTarget.shortReason}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    The point is to give the planning conversation a boundary: how much income could be intentionally created before this threshold is crossed?
                  </p>
                </article>
                <article className="rounded-md border border-border bg-card p-5 lg:col-span-2">
                  <h5 className="font-serif text-2xl font-bold text-primary">Why you might still go past it</h5>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{selectedTarget.goPastReason}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Sometimes the future tax problem is bigger than the current threshold cost. That is where the decision moves from a rule of thumb to a year-by-year Roth conversion plan.
                  </p>
                </article>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                This planning illustration is educational. It does not account for deductions, Social Security taxation, capital gains, tax-exempt interest, ACA subsidies, state rules, withholding, or whether the tax should be paid from outside the IRA.
              </p>
            </div>
          </div>
      </section>

      <div className="rounded-md border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        Sources: {FACTS.sources.map((source, index) => (
          <span key={source.href}>
            <a href={source.href} target="_blank" rel="noreferrer" className="font-bold text-accent hover:text-accent/80">
              {source.label}
            </a>
            {index < FACTS.sources.length - 1 ? '; ' : '.'}
          </span>
        ))}
      </div>
    </div>
  );
}
