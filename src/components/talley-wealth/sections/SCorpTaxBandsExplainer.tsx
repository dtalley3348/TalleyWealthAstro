/**
 * SCorpTaxBandsExplainer — conceptual educational visual with an illustrative
 * figure, NOT a tax calculator.
 *
 * A "rate map" of self-employment / payroll tax exposure across owner income
 * ($0 → selected profit). Bar HEIGHT is proportional to the marginal
 * SE/payroll tax rate, so AREA reads as dollars: the region to the right of
 * reasonable compensation is the "potentially avoidable" zone, and its area is
 * surfaced as an illustrative annual dollar figure. The figure is a simplified,
 * gross estimate — it does not calculate anyone's actual tax or savings.
 *
 * Assumes Married Filing Jointly, tax year 2026.
 *
 * Embed in Astro:
 *   import SCorpTaxBandsExplainer from '@/components/talley-wealth/sections/SCorpTaxBandsExplainer';
 *   <SCorpTaxBandsExplainer client:visible />
 */
import { useEffect, useId, useRef, useState } from 'react';

/* ── Annually-updated facts. Update this block each year. ──────────────── */
export const TAX_FACTS = {
  taxYear: 2026,
  filingStatus: 'Married Filing Jointly',
  /** SSA contribution and benefit base. */
  socialSecurityWageBase: 184_500,
  /** OASDI / self-employment Social Security portion, up to the wage base. */
  socialSecurityRate: 0.124,
  /** Regular Medicare portion: from the first dollar, no wage cap. */
  medicareRate: 0.029,
  /** Additional Medicare Tax — separate from regular Medicare; begins above the filing-status threshold. */
  additionalMedicareRate: 0.009,
  /** Additional Medicare Tax threshold for MFJ. (Single/HoH $200k · MFS $125k — noted, not modeled.) */
  additionalMedicareThreshold: 250_000,
  /**
   * Illustrative Married-Filing-Jointly ordinary income tax brackets (marginal
   * rate by taxable income). Drives the income-tax staircase. Update yearly.
   * Applies to TAXABLE income (after deductions); shown against profit for shape.
   */
  mfjIncomeBrackets: [
    { upTo: 24_800, rate: 0.1 },
    { upTo: 100_800, rate: 0.12 },
    { upTo: 211_400, rate: 0.22 },
    { upTo: 403_550, rate: 0.24 },
    { upTo: 512_450, rate: 0.32 },
    { upTo: 768_700, rate: 0.35 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  /** Tennessee franchise tax: 0.25% of Tennessee net worth. */
  tnFranchiseRate: 0.0025,
  /** Tennessee excise tax: 6.5% of Tennessee taxable income. */
  tnExciseRate: 0.065,
  sources: [
    {
      label: 'SSA — contribution and benefit base',
      href: 'https://www.ssa.gov/oact/cola/cbb.html',
    },
    {
      label: 'IRS — self-employment tax (Social Security and Medicare)',
      href: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes',
    },
    {
      label: 'IRS — Additional Medicare Tax',
      href: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax',
    },
    {
      label: 'IRS — federal income tax rates and brackets',
      href: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets',
    },
    {
      label: 'TN Dept. of Revenue — franchise & excise tax rates',
      href: 'https://www.tn.gov/revenue/taxes/franchise---excise-tax/due-dates-and-tax-rates.html',
    },
  ],
} as const;

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const usdShort = (n: number) => (n === 0 ? '$0' : `$${Math.round(n / 1_000)}k`);

/* ── Chart geometry (px). One vertical scale for BOTH layers (income tax +
   SE/payroll), so height = marginal rate and stacked area = dollars. The
   income-tax staircase rises to the right; the SE/payroll area rides on top. ── */
const SCALE = 3.6; // pixels per 1 percentage-point of marginal rate
const STACK_H = 150; // room for the stacked area (max realistic stack ≈ 40%)
const HEAD = 42; // headroom above the stack for the two marker-label rows
const BASE_Y = HEAD + STACK_H; // x-axis baseline (bands grow upward from here)
const COMP_LINE_Y = 18; // marker lines start just under their label rows
const WB_LINE_Y = 33;
const BRACKET_Y = BASE_Y + 22; // wages / distributions underline
const CHART_H = BRACKET_Y + 22;

/* ── Types & props ─────────────────────────────────────────────────────── */
type StateContext = 'TN' | 'OTHER';

export interface SCorpTaxBandsExplainerProps {
  /** Starting business profit. Default $200,000. */
  defaultProfit?: number;
  /** Starting reasonable compensation. Default $100,000. */
  defaultCompensation?: number;
  /** Start with the S-Corp election selected. Default false. */
  defaultElection?: boolean;
  /** Starting state context. Default 'TN'. */
  defaultState?: StateContext;
  className?: string;
}

/* ── Hooks & small building blocks ─────────────────────────────────────── */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(w);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function DollarSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  note,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  note?: string;
}) {
  const fillPct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold tabular-nums text-accent sm:text-right">
          {usd(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="scorp-range mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={usd(value)}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ ['--fill' as string]: `${fillPct}%` }}
      />
      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span>{usdShort(min)}</span>
        <span>{usdShort(max)}</span>
      </div>
      {note ? <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div
        className="mt-2 grid gap-px rounded-lg border border-border bg-border p-px"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={
                'rounded-[7px] px-3 py-2 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ' +
                (active
                  ? 'bg-primary text-primary-foreground shadow-elegant'
                  : 'bg-card text-muted-foreground hover:text-foreground')
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Palette (matches Talley Wealth tokens) ────────────────────────────── */
const navy = 'hsl(211 32% 21%)'; // SE/payroll tax — solid where it applies
const slate = 'hsl(211 24% 42%)';
const gold = 'hsl(33 47% 52%)';
const incomeFill = 'hsl(210 16% 72%)'; // income-tax staircase — calm base, applies either way
const incomeStroke = 'hsl(210 14% 58%)'; // crisps the stair steps
const incomeLabelInk = 'hsl(211 26% 32%)';
const addlFill = 'hsl(28 48% 47%)'; // Additional Medicare 0.9% — distinct bronze sliver
const avoidedFill = 'hsl(33 47% 52% / 0.08)';
const avoidedStroke = 'hsl(33 47% 52% / 0.92)';

/** Solid band segment, animated on geometry changes. */
function Area({ x0, x1, y, h, fill }: { x0: number; x1: number; y: number; h: number; fill: string }) {
  const w = Math.max(0, x1 - x0);
  if (w <= 0) return null;
  return <rect className="scorp-seg" style={{ x: `${x0}px`, y: `${y}px`, width: `${w}px`, height: `${h}px`, fill }} />;
}

/* ── Main component ────────────────────────────────────────────────────── */
export default function SCorpTaxBandsExplainer({
  defaultProfit = 200_000,
  defaultCompensation = 100_000,
  defaultElection = false,
  defaultState = 'TN',
  className = '',
}: SCorpTaxBandsExplainerProps) {
  const uid = useId();
  const [profit, setProfit] = useState(defaultProfit);
  const [comp, setComp] = useState(defaultCompensation);
  const [scorp, setScorp] = useState(defaultElection);
  const [stateCtx, setStateCtx] = useState<StateContext>(defaultState);
  const { ref: plotRef, width: W } = useMeasuredWidth();

  const WB = TAX_FACTS.socialSecurityWageBase;
  const T = TAX_FACTS.additionalMedicareThreshold;
  const SSR = TAX_FACTS.socialSecurityRate;
  const MEDR = TAX_FACTS.medicareRate;
  const ADDR = TAX_FACTS.additionalMedicareRate;

  const effComp = Math.min(comp, profit); // salary can't exceed profit in this illustration
  const spread = Math.max(0, profit - effComp);
  const compClamped = comp > profit;
  const inTN = stateCtx === 'TN';
  const wbVisible = WB <= profit;

  /* ── Illustrative SE/payroll tax difference (simplified, gross) ──────────
     The amount above reasonable compensation that an election may shift from
     self-employment income to distributions, valued at each band's rate:
       Social Security 12.4% — only the spread that sits below the wage base
       Regular Medicare 2.9% — the whole spread (no wage cap)
       Additional Medicare 0.9% — only the spread above the MFJ threshold
     Area of the gold zone == this figure. Not reduced by the 92.35% SE basis,
     payroll/admin/tax-prep costs, state tax, or compliance. */
  const ssAvoided = SSR * Math.max(0, Math.min(profit, WB) - Math.min(effComp, WB));
  const medAvoided = MEDR * spread;
  const addAvoided = ADDR * Math.max(0, Math.max(0, profit - T) - Math.max(0, effComp - T));
  const totalAvoided = ssAvoided + medAvoided + addAvoided; // gross federal SE/payroll difference

  /* Tennessee excise drag: 6.5% on the S-corp's income above salary (≈ the
     distributions). Franchise tax is net-worth based and not modeled. A sole
     proprietor owes no F&E; an existing LLC may owe it either way. */
  const tnExcise = inTN ? TAX_FACTS.tnExciseRate * spread : 0;
  const netBenefit = totalAvoided - tnExcise; // can go negative in TN above the wage base
  const round100 = (n: number) => Math.round(n / 100) * 100;
  const headline = round100(totalAvoided);
  const netRounded = round100(netBenefit);
  const signedUsd = (n: number) => (n < 0 ? `−${usd(Math.abs(n))}` : usd(n));

  /* x scale: $0 → selected profit, full plot width */
  const X = (v: number) => (profit > 0 ? (Math.min(v, profit) / profit) * W : 0);

  /* ── Marginal-rate functions (both layers share the same vertical scale) ── */
  const incomeRateAt = (v: number) => {
    for (const b of TAX_FACTS.mfjIncomeBrackets) if (v <= b.upTo) return b.rate;
    return TAX_FACTS.mfjIncomeBrackets[TAX_FACTS.mfjIncomeBrackets.length - 1].rate;
  };
  // SE/payroll marginal rate: 15.3% to the wage base, then 2.9% Medicare, +0.9% above the MFJ threshold.
  const seRateAt = (v: number) => (v <= WB ? SSR + MEDR : MEDR) + (v > T ? ADDR : 0);

  /* Piecewise segments at every rate change + the reasonable-comp split. The
     comp marker divides "stays" (wages, left) from "potentially avoidable"
     (distributions, right). */
  const boundSet = new Set<number>([0, profit, effComp, WB, T]);
  TAX_FACTS.mfjIncomeBrackets.forEach((b) => {
    if (b.upTo > 0 && b.upTo < profit) boundSet.add(b.upTo);
  });
  const bounds = [...boundSet].filter((v) => v >= 0 && v <= profit).sort((a, b) => a - b);
  const segments: { a: number; b: number; incomeR: number; seR: number; avoidable: boolean }[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i];
    const b = bounds[i + 1];
    if (b - a < 1) continue;
    const mid = (a + b) / 2;
    segments.push({ a, b, incomeR: incomeRateAt(mid), seR: seRateAt(mid), avoidable: a >= effComp - 0.5 });
  }
  const yIncomeTop = (s: { incomeR: number }) => BASE_Y - s.incomeR * 100 * SCALE;
  const ySeTop = (s: { incomeR: number; seR: number }) => BASE_Y - (s.incomeR + s.seR) * 100 * SCALE;

  // Income staircase top edge (crisps the steps).
  let incomeTopPath = '';
  segments.forEach((s, i) => {
    incomeTopPath += `${i === 0 ? 'M' : 'L'} ${X(s.a)} ${yIncomeTop(s)} L ${X(s.b)} ${yIncomeTop(s)} `;
  });
  // Silhouette of the avoidable SE/payroll region (top staircase + side verticals).
  const avoidSegs = segments.filter((s) => s.avoidable);
  let avoidTopPath = '';
  avoidSegs.forEach((s, i) => {
    if (i === 0) avoidTopPath += `M ${X(s.a)} ${yIncomeTop(s)} L ${X(s.a)} ${ySeTop(s)} `;
    else avoidTopPath += `L ${X(s.a)} ${ySeTop(s)} `;
    avoidTopPath += `L ${X(s.b)} ${ySeTop(s)} `;
    if (i === avoidSegs.length - 1) avoidTopPath += `L ${X(s.b)} ${yIncomeTop(s)} `;
  });

  const addApplies = profit > T;
  const addSentence = addApplies
    ? ` Above the ${usd(T)} married-filing-jointly threshold a distinct 0.9% Additional Medicare sliver sits on top.`
    : '';
  const seName = scorp ? 'payroll tax' : 'self-employment tax';
  const chartSummary = `Stacked area chart from $0 to ${usd(profit)} of owner income. Both layers are to scale: height is the marginal tax rate. The lower staircase is ordinary income tax on a married-filing-jointly bracket schedule, rising to the right; it applies either way. On top sits the ${seName} layer — 15.3% (12.4% Social Security plus 2.9% Medicare) up to the ${usd(WB)} Social Security wage base, then 2.9% regular Medicare with no cap.${addSentence} ${scorp ? `With the S-Corp election selected, the SE/payroll layer above the ${usd(effComp)} reasonable-compensation marker is hollowed out — the potentially avoided payroll/SE tax on ${usd(spread)} of distributions — leaving the income-tax staircase standing. The illustrative annual federal difference is about ${usd(headline)}${inTN ? `, before a Tennessee excise drag of about ${usd(round100(tnExcise))} — a net of about ${signedUsd(netRounded)}` : ''}.` : `The reasonable-compensation marker sits at ${usd(effComp)}. Toggle the S-Corp election to see how much of the SE/payroll layer above a reasonable salary could change.`}`;

  const resultBody = (() => {
    if (spread <= 0) {
      return `At this salary there's no profit above reasonable compensation to take as distributions, so there's no SE/payroll tax difference to illustrate. The potential benefit comes from the spread above a defensible salary.`;
    }
    const base = `Assumes about ${usd(effComp)} is a defensible, documented salary and the remaining ${usd(spread)} is taken as distributions.`;
    if (!inTN) {
      return `${base} This is a simplified, gross figure — before the 92.35% self-employment-tax basis, payroll and tax-prep costs, and compliance — so an actual difference would be lower.`;
    }
    const lead =
      netBenefit < 0
        ? `In this simplified Tennessee view, the excise-tax drag outweighs the federal saving on these inputs.`
        : `In this simplified Tennessee view, the excise-tax drag offsets part of the federal saving.`;
    return `${base} ${lead} A sole proprietor owes no franchise & excise tax; if you already operate through an LLC subject to it, the excise applies either way. Franchise tax (net-worth based) isn't shown, and this stays a simplified figure before payroll, tax-prep, and compliance costs.`;
  })();

  return (
    <section
      className={`scorp-tool mx-auto w-full max-w-6xl font-sans text-foreground ${className}`}
      aria-label="Educational illustration: where S-Corp savings can appear"
    >
      <style>{SCOPED_CSS}</style>

      {/* Header */}
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Educational illustration · not tax advice
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-4xl">
          Where S-Corp savings can appear
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          The election does not erase income tax. It changes how part of owner income may be
          treated for payroll/self-employment tax purposes.
        </p>
      </header>

      {/* Controls + chart */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Controls */}
        <div className="flex min-w-0 flex-col gap-7 rounded-lg border border-border bg-card p-6 shadow-elegant">
          <DollarSlider
            id={`${uid}-profit`}
            label="Business profit"
            value={profit}
            min={50_000}
            max={500_000}
            step={5_000}
            onChange={setProfit}
          />
          <DollarSlider
            id={`${uid}-comp`}
            label="Reasonable compensation"
            value={comp}
            min={40_000}
            max={250_000}
            step={5_000}
            onChange={setComp}
            note={
              compClamped
                ? `Compensation can't exceed profit — illustrated at ${usd(profit)}.`
                : 'A salary the role and results could defend on paper. The number has to hold up for more than tax savings.'
            }
          />
          <SegmentedToggle
            label="Entity treatment"
            value={scorp ? 'scorp' : 'none'}
            options={[
              { value: 'none', label: 'Sole proprietor' },
              { value: 'scorp', label: 'S-Corp election' },
            ]}
            onChange={(v) => setScorp(v === 'scorp')}
          />
          <SegmentedToggle<StateContext>
            label="State context"
            value={stateCtx}
            options={[
              { value: 'TN', label: 'Tennessee' },
              { value: 'OTHER', label: 'Virginia / no TN F&E' },
            ]}
            onChange={setStateCtx}
          />
          <p className="text-xs leading-snug text-muted-foreground">
            Assumes {TAX_FACTS.filingStatus}, {TAX_FACTS.taxYear}. The 0.9% Additional Medicare Tax
            begins above {usd(T)} on this status (Single/HoH {usd(200_000)} · MFS {usd(125_000)}).
          </p>
        </div>

        {/* Chart */}
        <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card p-5 shadow-elegant sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/60">
            {scorp ? 'Payroll tax' : 'Self-employment tax'} on top of income tax — across owner income
          </p>

          {/* Callout — neutral until the election is toggled on */}
          <div className="mt-3 flex items-start gap-3">
            <span
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-[3px] transition-colors duration-500 ${scorp ? 'border border-dashed' : ''}`}
              style={scorp ? { borderColor: gold, background: avoidedFill } : { background: navy }}
              aria-hidden="true"
            />
            <p className="text-sm font-semibold leading-snug text-primary">
              {scorp ? 'Potentially avoided payroll/SE tax' : 'Self-employment tax across business profit'}
              <span className="mt-0.5 block text-xs font-normal leading-snug text-muted-foreground">
                {scorp
                  ? 'The hollowed area above a defensible salary is the SE/payroll layer generally lifted — the income-tax staircase beneath still applies.'
                  : 'Without an election the 15.3% self-employment tax applies across profit (Social Security capped at the wage base, Medicare with no cap). Toggle the S-Corp election to see what could change above a reasonable salary.'}
              </span>
            </p>
          </div>

          {/* Plot */}
          <div className="mt-5" role="img" aria-label={chartSummary}>
            <div ref={plotRef} className="w-full">
              {W > 0 ? (
                <svg width={W} height={CHART_H} aria-hidden="true" className="block overflow-visible">
                  <defs>
                    <pattern
                      id={`${uid}-zone-hatch`}
                      patternUnits="userSpaceOnUse"
                      width="6"
                      height="6"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="6" stroke="hsl(33 47% 60% / 0.4)" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* ── Income-tax staircase (to scale, MFJ brackets) — applies either way ── */}
                  {segments.map((s, i) => {
                    const h = s.incomeR * 100 * SCALE;
                    return <Area key={`inc-${i}`} x0={X(s.a)} x1={X(s.b)} y={BASE_Y - h} h={h} fill={incomeFill} />;
                  })}
                  <path className="scorp-seg" d={incomeTopPath} fill="none" stroke={incomeStroke} strokeWidth={1} />
                  {/* marginal-rate labels per bracket, where there's room (skip narrow ones so
                       they don't crowd the caption) */}
                  {segments.map((s, i) => {
                    const h = s.incomeR * 100 * SCALE;
                    const segW = X(s.b) - X(s.a);
                    if (segW < 56 || h < 22) return null;
                    // keep the leftmost label clear of the caption row
                    const cy = X(s.a) < 60 ? BASE_Y - h / 2 - 6 : BASE_Y - h / 2 + 3;
                    return (
                      <text key={`br-${i}`} x={(X(s.a) + X(s.b)) / 2} y={cy} textAnchor="middle" className="scorp-sub" fill={incomeLabelInk}>
                        {Math.round(s.incomeR * 100)}%
                      </text>
                    );
                  })}
                  {W > 250 ? (
                    <text x={8} y={BASE_Y - 6} className="scorp-sub" fill={incomeLabelInk}>
                      income tax — applies either way
                    </text>
                  ) : null}

                  {/* ── SE/payroll layer, riding on top of the income staircase ──
                       No election: solid across all profit (it's all self-employment tax).
                       With election: the area above reasonable comp hollows out. ── */}
                  {segments.map((s, i) => {
                    const seH = s.seR * 100 * SCALE;
                    const y = ySeTop(s);
                    const w = Math.max(0, X(s.b) - X(s.a));
                    const hollow = scorp && s.avoidable;
                    return (
                      <rect
                        key={`se-${i}`}
                        className="scorp-seg"
                        style={{ x: `${X(s.a)}px`, y: `${y}px`, width: `${w}px`, height: `${seH}px`, fill: hollow ? avoidedFill : navy }}
                      />
                    );
                  })}
                  {/* Additional Medicare 0.9% — a distinct bronze sliver on the SE band's top,
                       only above the MFJ threshold; folds into the hollow when the area is lifted */}
                  {addApplies
                    ? segments.map((s, i) => {
                        if ((s.a + s.b) / 2 <= T || (scorp && s.avoidable)) return null;
                        const w = Math.max(0, X(s.b) - X(s.a));
                        return (
                          <rect
                            key={`add-${i}`}
                            className="scorp-seg"
                            style={{ x: `${X(s.a)}px`, y: `${ySeTop(s)}px`, width: `${w}px`, height: `${ADDR * 100 * SCALE}px`, fill: addlFill }}
                          />
                        );
                      })
                    : null}
                  {/* gold silhouette outline — only once the election lifts the area */}
                  {scorp && avoidTopPath ? (
                    <path
                      className="scorp-seg"
                      d={avoidTopPath}
                      fill="none"
                      stroke={avoidedStroke}
                      strokeWidth={1.4}
                      strokeDasharray="4 3"
                      strokeLinejoin="round"
                    />
                  ) : null}

                  {/* SE/payroll layer label — fixed left anchor so it never drifts as sliders move.
                       y is matched to the left edge of the band (income 10% + SE 15.3%). */}
                  {(() => {
                    const regionEnd = scorp ? effComp : Math.min(WB, profit);
                    if (X(regionEnd) < 150) return null;
                    const y = BASE_Y - (incomeRateAt(0) * 100 + (seRateAt(0) * 100) / 2) * SCALE + 3;
                    return (
                      <text x={12} y={y} className="scorp-sub" fill="hsl(0 0% 100% / 0.92)" fontWeight={600}>
                        {scorp ? 'Payroll tax on wages' : 'Self-employment tax'}
                      </text>
                    );
                  })()}

                  {/* Additional Medicare 0.9% label, above its bronze sliver (only while shown solid) */}
                  {addApplies && !(scorp && effComp < T) && X(profit) - X(T) > 150 ? (
                    <text x={(X(T) + X(profit)) / 2} y={BASE_Y - (incomeRateAt((T + profit) / 2) + seRateAt((T + profit) / 2)) * 100 * SCALE - 5} textAnchor="middle" className="scorp-sub" fill={addlFill}>
                      + 0.9% Additional Medicare above {usdShort(T)}
                    </text>
                  ) : null}

                  {/* Avoided-zone headline — only once the election is on */}
                  {(() => {
                    if (!scorp) return null;
                    const zHiEnd = Math.min(WB, profit);
                    const zw = X(zHiEnd) - X(effComp);
                    if (effComp >= profit || zw < 96) return null;
                    const cx = (X(effComp) + X(zHiEnd)) / 2;
                    const midV = (effComp + zHiEnd) / 2;
                    const iR = incomeRateAt(midV);
                    const cy = (BASE_Y - iR * 100 * SCALE + (BASE_Y - (iR + seRateAt(midV)) * 100 * SCALE)) / 2;
                    const lines = ['potentially avoided', 'payroll/SE tax'];
                    if (zw > 240) {
                      return (
                        <text x={cx} y={cy + 4} textAnchor="middle" className="scorp-zone-label" fill={gold}>
                          {lines.join(' ')}
                        </text>
                      );
                    }
                    if (zw > 156) {
                      return (
                        <text x={cx} y={cy - 4} textAnchor="middle" className="scorp-zone-label" fill={gold}>
                          <tspan x={cx}>{lines[0]}</tspan>
                          <tspan x={cx} dy={14}>
                            {lines[1]}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  })()}

                  {/* Vertical markers with clean flag labels at the top */}
                  {(() => {
                    const cx = X(effComp);
                    const a = cx < 70 ? 'start' : cx > W - 70 ? 'end' : 'middle';
                    return (
                      <g>
                        <line
                          className="scorp-marker"
                          style={{ transform: `translateX(${cx}px)` }}
                          x1={0}
                          x2={0}
                          y1={COMP_LINE_Y}
                          y2={BASE_Y}
                          stroke={gold}
                          strokeWidth={1.5}
                          strokeDasharray="5 4"
                        />
                        <text x={cx} y={14} textAnchor={a} className="scorp-flag scorp-halo" fill="hsl(33 47% 44%)">
                          Reasonable comp · {usd(effComp)}
                        </text>
                      </g>
                    );
                  })()}
                  {wbVisible ? (() => {
                    const cx = X(WB);
                    const a = cx < 70 ? 'start' : cx > W - 70 ? 'end' : 'middle';
                    return (
                      <g>
                        <line
                          className="scorp-marker"
                          style={{ transform: `translateX(${cx}px)` }}
                          x1={0}
                          x2={0}
                          y1={WB_LINE_Y}
                          y2={BASE_Y}
                          stroke="hsl(211 32% 21% / 0.4)"
                          strokeWidth={1}
                          strokeDasharray="5 4"
                        />
                        <text x={cx} y={29} textAnchor={a} className="scorp-flag scorp-halo" fill={slate}>
                          SS wage base · {usd(WB)}
                        </text>
                      </g>
                    );
                  })() : (
                    <text x={W} y={14} textAnchor="end" className="scorp-flag scorp-halo" fill={slate} fontStyle="italic">
                      SS wage base {usd(WB)} is beyond profit
                    </text>
                  )}
                  <line x1={W - 0.5} x2={W - 0.5} y1={WB_LINE_Y} y2={BASE_Y} stroke="hsl(211 32% 21% / 0.25)" strokeWidth={1} />

                  {/* x-axis */}
                  <line x1={0} x2={W} y1={BASE_Y} y2={BASE_Y} stroke="hsl(210 15% 75%)" strokeWidth={1} />
                  <text x={0} y={BASE_Y + 14} className="scorp-tick" fill={slate}>
                    $0
                  </text>
                  {(W > 520 ? [0.25, 0.5, 0.75] : [0.5]).map((f) => (
                    <text key={f} x={W * f} y={BASE_Y + 14} textAnchor="middle" className="scorp-tick" fill={slate}>
                      {usdShort(profit * f)}
                    </text>
                  ))}
                  <text x={W} y={BASE_Y + 14} textAnchor="end" className="scorp-tick" fill={slate}>
                    {usdShort(profit)}
                  </text>

                  {/* Wages / distributions underline */}
                  {scorp ? (
                    <>
                      <Area x0={0} x1={X(effComp)} y={BRACKET_Y} h={3} fill={navy} />
                      <Area x0={X(effComp)} x1={W} y={BRACKET_Y} h={3} fill={gold} />
                      {X(effComp) > 120 ? (
                        <text x={X(effComp) / 2} y={BRACKET_Y + 14} textAnchor="middle" className="scorp-tick" fill={navy}>
                          W-2 wages
                        </text>
                      ) : null}
                      {W - X(effComp) > 190 ? (
                        <text x={(X(effComp) + W) / 2} y={BRACKET_Y + 14} textAnchor="middle" className="scorp-tick" fill={gold}>
                          distributions above compensation
                        </text>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Area x0={0} x1={W} y={BRACKET_Y} h={3} fill={slate} />
                      <text x={W / 2} y={BRACKET_Y + 14} textAnchor="middle" className="scorp-tick" fill={slate}>
                        all profit is net self-employment income
                      </text>
                    </>
                  )}
                </svg>
              ) : (
                <div style={{ height: CHART_H }} />
              )}
            </div>
          </div>

          {/* ── The payoff: illustrative annual figure (area of the gold zone) ── */}
          <div className="mt-5 rounded-lg border border-accent/40 bg-secondary/40 p-4 sm:p-5">
            {!scorp ? (
              <div className="flex items-center gap-2.5 py-1">
                <span className="text-accent" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <p className="text-sm leading-snug text-secondary-foreground">
                  Select <span className="font-semibold text-primary">S-Corp election</span> to reveal the
                  highlighted area. The visual is meant to show where the tax layer changes.
                </p>
              </div>
            ) : spread <= 0 ? (
              <p className="text-sm leading-relaxed text-secondary-foreground">{resultBody}</p>
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/60">
                      What the highlighted area roughly represents
                    </p>
                    <p
                      className="mt-1 font-serif text-2xl font-bold tabular-nums leading-tight text-primary"
                      style={netRounded < 0 ? { color: 'hsl(8 58% 44%)' } : undefined}
                    >
                      Illustrative annual difference: {signedUsd(netRounded)}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      This simplified figure only helps explain the visual. Your actual result depends on the full tax picture.
                    </p>
                  </div>
                  {inTN ? (
                    <dl className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[11px]">
                      <div className="flex items-baseline gap-1.5">
                        <dt className="text-muted-foreground">Federal saved</dt>
                        <dd className="font-semibold tabular-nums text-foreground">{usd(headline)}</dd>
                      </div>
                      <span className="text-muted-foreground">−</span>
                      <div className="flex items-baseline gap-1.5">
                        <dt className="text-muted-foreground">TN excise 6.5%</dt>
                        <dd className="font-semibold tabular-nums text-foreground">{usd(round100(tnExcise))}</dd>
                      </div>
                    </dl>
                  ) : (
                    <dl className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px]">
                      {[
                        { k: 'Social Security 12.4%', v: ssAvoided },
                        { k: 'Medicare 2.9%', v: medAvoided },
                        { k: "Add'l Medicare 0.9%", v: addAvoided },
                      ].map((row) => (
                        <div key={row.k} className="flex items-baseline gap-1.5">
                          <dt className="text-muted-foreground">{row.k}</dt>
                          <dd className="font-semibold tabular-nums text-foreground">{usd(Math.round(row.v))}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{resultBody}</p>
              </>
            )}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Both layers are drawn to one rate scale (height = marginal rate). The lower staircase is
            ordinary income tax on illustrative {TAX_FACTS.taxYear} {TAX_FACTS.filingStatus} brackets,
            which apply to taxable income (after deductions) and are shown against profit for shape —
            it applies either way and isn't part of the difference. The SE/payroll layer on top is
            15.3% (12.4% Social Security capped at the {usd(WB)} wage base + 2.9% Medicare from the
            first dollar, no cap), plus 0.9% Additional Medicare above {usd(T)} (Single/HoH $200,000 ·
            MFS $125,000). Self-employment tax technically applies to 92.35% of net earnings; that
            adjustment is simplified away, so a real figure runs lower. Wages stay subject to Social
            Security (to the cap) and Medicare even with an election.
          </p>
        </div>
      </div>

      {/* Interpretation cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Reasonable compensation is the anchor',
            body: 'The salary cannot simply be set low to maximize savings. It needs a documented rationale.',
          },
          {
            title: 'Savings depend on the spread',
            body: 'The potential benefit usually comes from profit above reasonable compensation.',
          },
          {
            title: 'Tennessee changes the math',
            body: "Tennessee franchise and excise tax considerations can offset the federal payroll-tax benefit. The election should not be judged from federal savings alone.",
          },
        ].map((card) => (
          <div key={card.title} className="rounded-lg border border-border bg-card p-5 shadow-elegant">
            <div className="h-0.5 w-9 bg-accent" aria-hidden="true" />
            <h3 className="mt-3 font-serif text-base font-bold text-primary">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer + sources */}
      <footer className="mt-6 rounded-lg border border-border bg-secondary/50 p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This is a simplified educational illustration. The dollar figure is a directional estimate
          for explaining the visual, and it should not be used to decide whether an S-Corp election
          is appropriate. The real answer depends on profit, reasonable compensation, filing status,
          payroll costs, state tax, entity structure, assets, retirement plan design, and implementation.
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground/80">
          Figures shown are {TAX_FACTS.taxYear} values · {TAX_FACTS.filingStatus}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1 text-[11px] sm:flex-row sm:flex-wrap sm:gap-x-5">
          {TAX_FACTS.sources.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}

/* ── Scoped styles: slider chrome + layer animation ────────────────────── */
const SCOPED_CSS = `
.scorp-tool .scorp-seg {
  transition:
    x 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    y 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    fill 0.55s ease,
    stroke 0.55s ease,
    opacity 0.55s ease;
}
.scorp-tool .scorp-sub {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.02em;
}
.scorp-tool .scorp-zone-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.scorp-tool .scorp-flag {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.scorp-tool .scorp-marker {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.scorp-tool .scorp-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.scorp-tool .scorp-halo {
  paint-order: stroke;
  stroke: var(--color-card);
  stroke-width: 3px;
  stroke-linejoin: round;
}
.scorp-tool .scorp-tick {
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
}
.scorp-tool .scorp-range {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  min-height: 2.75rem;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--color-accent) var(--fill, 0%),
    var(--color-border) var(--fill, 0%)
  );
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 4px;
  cursor: pointer;
}
.scorp-tool .scorp-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-card);
  box-shadow: 0 1px 4px hsl(211 32% 21% / 0.35);
}
.scorp-tool .scorp-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-card);
  box-shadow: 0 1px 4px hsl(211 32% 21% / 0.35);
}
.scorp-tool .scorp-range:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .scorp-tool .scorp-seg,
  .scorp-tool .scorp-marker { transition: none; }
}
`;
