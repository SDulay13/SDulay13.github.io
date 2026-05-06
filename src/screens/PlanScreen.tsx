import { useState, useEffect, useMemo } from 'react'
import type { ReactElement } from 'react'
import type { Destination, TripConstraints } from '../data'
import { tripBudget, lengthToNights, oneWayFlight } from '../data'
import { effectiveSpend, type BudgetRow, type PlanActivity, type TripPlanState } from '../data'
import { Plane, BedDouble, Utensils, Bus, Ticket, ShoppingBag } from '../icons'

interface Props {
  dest: Destination
  constraints: TripConstraints
  tripId: string
  initialPlan?: TripPlanState | null
  onPersistPlan: (plan: TripPlanState) => void
  onBack: () => void
}

const BUDGET_ICONS: Record<string, ReactElement> = {
  Flights:    <Plane size={13} />,
  Hotel:      <BedDouble size={13} />,
  Food:       <Utensils size={13} />,
  Transport:  <Bus size={13} />,
  Activities: <Ticket size={13} />,
  Misc:       <ShoppingBag size={13} />,
}

const CHECKLIST_ITEMS = [
  'Flight booked',
  'Hotel reserved',
  'Activities planned',
  'Budget reviewed',
  'Passport checked',
] as const

function buildDefaultBudget(dest: Destination, constraints: TripConstraints, nights: number): BudgetRow[] {
  return [
    { category: 'Flights',    estimate: oneWayFlight(constraints, dest) * 2, actual: '', notes: '' },
    { category: 'Hotel',      estimate: dest.hotelPerNight * nights, actual: '', notes: '' },
    { category: 'Food',       estimate: Math.round(dest.dailySpend * 0.55 * nights), actual: '', notes: '' },
    { category: 'Transport',  estimate: Math.round(dest.dailySpend * 0.25 * nights), actual: '', notes: '' },
    { category: 'Activities', estimate: Math.round(dest.dailySpend * 0.2 * nights), actual: '', notes: '' },
    { category: 'Misc',       estimate: 50, actual: '', notes: '' },
  ]
}

function defaultActivities(dest: Destination, nights: number): PlanActivity[] {
  return dest.sampleDays.slice(0, nights + 1).flatMap((day, di) =>
    day.items.map((item, ti) => ({
      day: di + 1,
      time: ti === 0 ? 'morning' : ti === 1 ? 'afternoon' : 'evening',
      text: item,
    })),
  )
}

export default function PlanScreen({
  dest,
  constraints,
  tripId,
  initialPlan,
  onPersistPlan,
  onBack,
}: Props) {
  const nights = lengthToNights(constraints.tripLength)
  const discoveryEstimate = tripBudget(constraints, dest)

  const defaultsBudget = useMemo(
    () => buildDefaultBudget(dest, constraints, nights),
    [dest, constraints, nights],
  )

  const defaultsActivities = useMemo(
    () => defaultActivities(dest, nights),
    [dest, nights],
  )

  const [budget, setBudget] = useState<BudgetRow[]>(() =>
    initialPlan?.budgetRows ?? defaultsBudget)

  const [activities, setActivities] = useState<PlanActivity[]>(() =>
    initialPlan?.activities ?? defaultsActivities)

  const [notes, setNotes] = useState(initialPlan?.notes ?? '')

  const [checks, setChecks] = useState<boolean[]>(() => {
    const base = initialPlan?.checks
    return CHECKLIST_ITEMS.map((_, i) => base?.[i] ?? false)
  })

  useEffect(() => {
    const t = window.setTimeout(() => {
      onPersistPlan({
        budgetRows: budget,
        activities,
        notes,
        checks,
      })
    }, 400)
    return () => window.clearTimeout(t)
  }, [budget, activities, notes, checks, tripId, onPersistPlan])

  const estimateTotal = budget.reduce((s, r) => s + r.estimate, 0)
  const planningTotal = budget.reduce((s, r) => s + effectiveSpend(r), 0)

  const daysArr = Array.from({ length: nights + 1 }, (_, i) => i + 1)

  const updateBudget = (i: number, field: keyof BudgetRow, val: string) =>
    setBudget(prev =>
      prev.map((r, ri) =>
        ri === i ? { ...r, [field]: field === 'estimate' ? Number(val) : val } : r,
      ),
    )

  const updateSlot = (day: number, time: PlanActivity['time'], text: string) => {
    setActivities(prev => {
      const idx = prev.findIndex(a => a.day === day && a.time === time)
      if (text === '') return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev
      if (idx >= 0) return prev.map((a, i) => i === idx ? { ...a, text } : a)
      return [...prev, { day, time, text }]
    })
  }

  const underTripBudget = planningTotal <= constraints.budget

  return (
    <div className="plan-root">
      <header className="plan-header" style={{ background: dest.imageGradient }}>
        <button type="button" className="back-btn light" onClick={onBack}>← Back to explore</button>
        <div className="plan-header-text">
          <h1>Planning: {dest.city}</h1>
          <p>
            {constraints.tripLength} · ~${discoveryEstimate.toLocaleString()} discovery estimate · from{' '}
            {constraints.homeCity}
          </p>
        </div>
      </header>

      <div className="plan-body">
        <aside className="plan-left">
          <div className="plan-sidebar-card">
            <h3>Trip overview</h3>
            <div className="plan-meta-row"><span>Destination</span><strong>{dest.city}, {dest.country}</strong></div>
            <div className="plan-meta-row"><span>Length</span><strong>{constraints.tripLength}</strong></div>
            <div className="plan-meta-row"><span>From</span><strong>{constraints.homeCity}</strong></div>
            <div className="plan-meta-row"><span>Trip budget (goal)</span><strong>${constraints.budget.toLocaleString()}</strong></div>
            <div className="plan-meta-row"><span>Planning total</span><strong>${planningTotal.toLocaleString()}</strong></div>
            <div className="plan-meta-row">
              <span>Vs budget</span>
              <strong style={{ color: underTripBudget ? '#1a5c2a' : 'var(--rust)' }}>
                {underTripBudget
                  ? `$${(constraints.budget - planningTotal).toLocaleString()} left`
                  : `$${(planningTotal - constraints.budget).toLocaleString()} over`}
              </strong>
            </div>
            <p className="plan-sidebar-hint">
              Planning total uses actual costs where you entered them; otherwise row estimates.
            </p>
          </div>

          <div className="plan-sidebar-card">
            <h3>Checklist</h3>
            {CHECKLIST_ITEMS.map((item, i) => (
              <label key={item} className="check-item">
                <input
                  type="checkbox"
                  checked={checks[i] ?? false}
                  onChange={() =>
                    setChecks(prev =>
                      CHECKLIST_ITEMS.map((_, ci) =>
                        ci === i ? !(prev[ci] ?? false) : (prev[ci] ?? false),
                      ),
                    )}
                  />
                <span className={checks[i] ? 'done' : ''}>{item}</span>
              </label>
            ))}
          </div>

          <div className="plan-sidebar-card notes-card">
            <h3>Notes</h3>
            <textarea
              className="notes-area"
              placeholder="Visa requirements, reminders, packing list..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </aside>

        <main className="plan-main">
          <section className="plan-section">
            <h2>Itinerary</h2>
            {daysArr.map(day => (
              <div key={day} className="itinerary-day">
                <div className="itin-day-label">Day {day}</div>
                <div className="itin-slots">
                  {(['morning', 'afternoon', 'evening'] as const).map(time => {
                    const slot = activities.find(a => a.day === day && a.time === time)
                    return (
                      <div key={time} className="itin-slot">
                        <span className="slot-time">{time}</span>
                        <input
                          className="itin-slot-input"
                          placeholder="—"
                          value={slot?.text ?? ''}
                          onChange={e => updateSlot(day, time, e.target.value)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="plan-section">
            <h2>Budget</h2>
            <p className="plan-budget-hint">
              Trip budget comparison uses actual amounts when filled; otherwise the estimate for that row.
            </p>
            <div className="budget-table-wrap">
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Estimate</th>
                    <th>Actual</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((row, i) => (
                    <tr key={row.category}>
                      <td className="cat-cell">
                        <span className="cat-icon">{BUDGET_ICONS[row.category]}</span>
                        {row.category}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="budget-input"
                          value={row.estimate}
                          onChange={e => updateBudget(i, 'estimate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="budget-input"
                          placeholder="—"
                          value={row.actual}
                          onChange={e => updateBudget(i, 'actual', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="budget-note-input"
                          placeholder="Notes..."
                          value={row.notes}
                          onChange={e => updateBudget(i, 'notes', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td>Total</td>
                    <td>${estimateTotal.toLocaleString()}</td>
                    <td>${planningTotal.toLocaleString()}</td>
                    <td className={underTripBudget ? 'ok' : 'over'}>
                      {underTripBudget
                        ? `$${(constraints.budget - planningTotal).toLocaleString()} under trip budget`
                        : `$${(planningTotal - constraints.budget).toLocaleString()} over trip budget`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
