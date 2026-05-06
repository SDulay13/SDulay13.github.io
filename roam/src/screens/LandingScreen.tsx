import { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import { SCOPE_LABELS, type TripConstraints, type TripLength, type Vibe } from '../data'
import {
  VIBE_ICONS, Waves, Building2, MountainSnow, Landmark,
  ArrowRight, MapPin, Clock
} from '../icons'
import { US_AIRPORTS } from '../airports'
import type { Airport } from '../airports'

const VIBES: { id: Vibe; label: string }[] = [
  { id: 'beach',           label: 'Beach'      },
  { id: 'city',            label: 'City'       },
  { id: 'nature',          label: 'Nature'     },
  { id: 'historical',      label: 'Historical' },
  { id: 'food',            label: 'Food'       },
  { id: 'nightlife',       label: 'Nightlife'  },
  { id: 'adventure',       label: 'Adventure'  },
  { id: 'quiet',           label: 'Quiet'      },
  { id: 'tropical',        label: 'Tropical'   },
  { id: 'luxury',          label: 'Luxury'     },
  { id: 'budget-friendly', label: 'Budget'     },
]

const PRESETS: { label: string; Icon: (p: { size?: number }) => ReactElement; constraints: Partial<TripConstraints> }[] = [
  { label: 'Weekend Escape',    Icon: Building2,    constraints: { tripLength: 'weekend',  vibes: ['city', 'food'] } },
  { label: 'Beach Trip',        Icon: Waves,        constraints: { tripLength: '5-7 days', vibes: ['beach', 'tropical'] } },
  { label: 'Nature Reset',      Icon: MountainSnow, constraints: { tripLength: '5-7 days', vibes: ['nature', 'quiet', 'adventure'] } },
  { label: 'Culture Deep Dive', Icon: Landmark,     constraints: { tripLength: '5-7 days', vibes: ['historical', 'food', 'city'] } },
]

function AirportPicker({
  value, onChange,
}: {
  value: Airport | null
  onChange: (a: Airport) => void
}) {
  const [query, setQuery]   = useState(value ? `${value.code} — ${value.city}` : '')
  const [open, setOpen]     = useState(false)
  const [focused, setFocused] = useState(0)
  const inputRef            = useRef<HTMLInputElement>(null)
  const listRef             = useRef<HTMLUListElement>(null)

  const filtered = query.length < 1
    ? US_AIRPORTS.slice(0, 8)
    : US_AIRPORTS.filter(a =>
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)

  const select = (a: Airport) => {
    onChange(a)
    setQuery(`${a.code} — ${a.city}`)
    setOpen(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) { setOpen(true); return }
    if (e.key === 'ArrowDown') setFocused(f => Math.min(f + 1, filtered.length - 1))
    if (e.key === 'ArrowUp')   setFocused(f => Math.max(f - 1, 0))
    if (e.key === 'Enter' && filtered[focused]) select(filtered[focused])
    if (e.key === 'Escape') setOpen(false)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="airport-picker">
      <input
        ref={inputRef}
        className="text-input airport-input"
        placeholder="Search city or airport code…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul ref={listRef} className="airport-dropdown">
          {filtered.map((a, i) => (
            <li
              key={a.code}
              className={`airport-option ${i === focused ? 'highlighted' : ''}`}
              onMouseDown={() => select(a)}
              onMouseEnter={() => setFocused(i)}
            >
              <span className="airport-code">{a.code}</span>
              <span className="airport-info">
                <span className="airport-city">{a.city}</span>
                <span className="airport-name">{a.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
interface Props {
  onSubmit: (c: TripConstraints) => void
  initial?: TripConstraints | null
}

function clampBudget(n: number): number {
  return Math.min(50000, Math.max(300, Math.round(n)))
}

export default function LandingScreen({ onSubmit, initial }: Props) {
  const [budget, setBudget] = useState(initial?.budget ?? 1500)
  const [budgetEdit, setBudgetEdit] = useState<string | null>(null)
  const [tripLength, setTripLength] = useState<TripLength>(initial?.tripLength ?? '5-7 days')
  const [scope, setScope]           = useState<TripConstraints['scope']>(initial?.scope ?? 'international')
  const [airport, setAirport]       = useState<Airport | null>(
    initial?.airportCode
      ? (US_AIRPORTS.find(a => a.code === initial.airportCode) ?? null)
      : null
  )
  const [vibes, setVibes] = useState<Vibe[]>(initial?.vibes ?? ['city', 'food'])

  useEffect(() => {
    if (initial?.budget != null) {
      setBudget(clampBudget(initial.budget))
      setBudgetEdit(null)
    }
  }, [initial?.budget])

  const toggleVibe = (v: Vibe) =>
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const applyPreset = (p: typeof PRESETS[0]) => {
    if (p.constraints.tripLength) setTripLength(p.constraints.tripLength)
    if (p.constraints.vibes) setVibes(p.constraints.vibes)
  }

  const canSubmit = vibes.length > 0 && airport !== null

  const resolveBudget = (): number => {
    if (budgetEdit !== null) {
      const n = parseInt(budgetEdit.replace(/\D/g, ''), 10)
      if (Number.isFinite(n)) return clampBudget(n)
    }
    return budget
  }

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Trip discovery</span>
          <h1 className="hero-title">Where can you go<br /><em>with what you have?</em></h1>
          <p className="hero-sub">
            Tell us your budget, timeline, and vibe. We find destinations that actually fit.
          </p>
        </div>
        <div className="hero-art">
          <div className="globe-ring r1" />
          <div className="globe-ring r2" />
          <div className="globe-ring r3" />
          <div className="globe-dot" style={{ top: '30%', left: '55%' }} />
          <div className="globe-dot" style={{ top: '55%', left: '38%' }} />
          <div className="globe-dot" style={{ top: '48%', left: '68%' }} />
          <div className="globe-dot" style={{ top: '65%', left: '52%' }} />
          <div className="globe-dot" style={{ top: '42%', left: '46%' }} />
        </div>
      </div>

      <div className="landing-form-wrap">
        <div className="preset-row">
          {PRESETS.map(p => (
            <button key={p.label} className="preset-chip" onClick={() => applyPreset(p)}>
              <p.Icon size={14} /> {p.label}
            </button>
          ))}
        </div>

        <div className="form-grid">
          <div className="form-block">
            <label className="form-label">Total trip budget</label>
            <div className="budget-input-row">
              <span className="budget-prefix">$</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className="budget-number-input"
                value={budgetEdit !== null ? budgetEdit : budget.toLocaleString()}
                onFocus={() => setBudgetEdit(String(budget))}
                onChange={e => {
                  const raw = e.target.value.replace(/[^\d]/g, '')
                  setBudgetEdit(raw)
                }}
                onBlur={() => {
                  const raw = budgetEdit ?? ''
                  setBudgetEdit(null)
                  if (raw === '') {
                    setBudget(300)
                    return
                  }
                  const n = parseInt(raw, 10)
                  if (Number.isFinite(n)) setBudget(clampBudget(n))
                }}
                aria-label="Trip budget in dollars"
              />
              <span className="budget-input-hint">Type any amount, or use slider ($500–$4.5k)</span>
            </div>
            <input
              type="range"
              min={500}
              max={4500}
              step={50}
              value={Math.min(Math.max(budget, 500), 4500)}
              onChange={e => {
                const v = Number(e.target.value)
                setBudget(v)
                setBudgetEdit(null)
              }}
              className="budget-slider"
            />
            <div className="budget-ticks">
              {[500, 1500, 2500, 3500, 4500].map(v => (
                <span key={v} className={budget >= v ? 'active' : ''}>
                  ${v >= 1000 ? `${v / 1000}k` : v}
                </span>
              ))}
            </div>
            {budget > 4500 && (
              <p className="budget-above-slider-note">
                Above slider range — estimate uses ${budget.toLocaleString()}.
              </p>
            )}
          </div>

          <div className="form-block">
            <label className="form-label"><Clock size={12} /> How long?</label>
            <div className="chip-grid">
              {(['weekend', '3-4 days', '5-7 days', '7+ days'] as TripLength[]).map(l => (
                <button key={l} className={`form-chip ${tripLength === l ? 'active' : ''}`} onClick={() => setTripLength(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-block">
            <label className="form-label"><MapPin size={12} /> Flying from</label>
            <AirportPicker value={airport} onChange={setAirport} />
            {!airport && (
              <p className="input-hint">Search by city name or airport code (e.g. BOS, JFK)</p>
            )}
          </div>

          <div className="form-block">
            <label className="form-label">Travel scope</label>
            <div className="chip-grid">
              {([
                'domestic',
                'national',
                'international',
              ] as const).map(id => (
                <button key={id} className={`form-chip ${scope === id ? 'active' : ''}`}
                  onClick={() => setScope(id)}>
                  {SCOPE_LABELS[id]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-block vibe-block">
          <label className="form-label">What kind of trip?</label>
          <div className="vibe-grid">
            {VIBES.map(v => {
              const Icon = VIBE_ICONS[v.id]
              return (
                <button key={v.id} className={`vibe-chip ${vibes.includes(v.id) ? 'active' : ''}`}
                  onClick={() => toggleVibe(v.id)}>
                  <span className="vibe-icon-wrap"><Icon size={18} /></span>
                  <span>{v.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button className="cta-btn" onClick={() => canSubmit && onSubmit({
          budget: resolveBudget(), tripLength, scope,
          homeCity: `${airport!.code} — ${airport!.city}`,
          vibes,
          airportCode: airport!.code,
        } as TripConstraints & { airportCode: string })}
          disabled={!canSubmit}>
          <span>Show me where I can go</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
