import { useMemo, useState } from 'react'
import {
  SCOPE_LABELS,
  DEST_AIRPORT_CODES,
  DEST_DRIVE_RENTAL_AIRPORT,
  filterDestinations,
  fitReasons,
  lengthToNights,
  oneWayFlight,
  isDriveTrip,
  getDriveHours,
  RENTAL_CAR_PER_DAY,
  type Destination,
  type TripConstraints,
  type Vibe,
} from '../data'
import { Plane, BedDouble, Utensils, ChevronDown, ChevronUp, Car } from '../icons'
import { useDestinationImage } from '../hooks'
import { kayakFlightUrl, bookingHotelUrl, kayakAirportCarUrl } from '../api'

function DestCard({
  dest, idx, constraints, isOpen, onToggle, onDismiss, onDetail, onPlan,
}: {
  dest: Destination & { estimatedCost: number; score: number }
  idx: number
  constraints: TripConstraints
  isOpen: boolean
  onToggle: () => void
  onDismiss: () => void
  onDetail: () => void
  onPlan:   () => void
}) {
  const reasons    = fitReasons(constraints, dest)
  const isOver     = dest.estimatedCost > constraints.budget
  const nights     = lengthToNights(constraints.tripLength)
  const driveTrip  = isDriveTrip(constraints, dest)
  const driveHrs   = getDriveHours(constraints, dest)
  const { imageUrl } = useDestinationImage(dest.city, dest.id)

  const heroStyle = imageUrl
    ? { backgroundImage: `linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.55) 100%),url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: dest.imageGradient }

  const destAirport = DEST_AIRPORT_CODES[dest.id]
  const rentalPickup =
    driveTrip ? (DEST_DRIVE_RENTAL_AIRPORT[dest.id] ?? destAirport) : undefined
  const flightUrl =
    !driveTrip && constraints.airportCode && destAirport
      ? kayakFlightUrl(constraints.airportCode, destAirport, nights)
      : null
  const carUrl = driveTrip && rentalPickup ? kayakAirportCarUrl(rentalPickup) : null
  const hotelUrl = bookingHotelUrl(dest.city, nights)

  return (
    <div className={`ex-card ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="ex-dismiss-btn"
        onClick={onDismiss}
        aria-label={`Skip ${dest.city}`}
        title="Not interested"
      >
        ×
      </button>
      <button className="ex-card-header" onClick={onToggle}>
        <div className="ex-rank" style={heroStyle}>
          <span>{idx + 1}</span>
        </div>
        <div className="ex-card-info">
          <div className="ex-card-top">
            <span className="ex-city">{dest.city}</span>
            <span className="ex-country">{dest.country}</span>
            {idx === 0 && <span className="ex-top-badge">Top pick</span>}
          </div>
          <p className="ex-tagline">{dest.tagline}</p>
          <div className="ex-reasons">
            {reasons.map(r => (
              <span key={r} className={`ex-reason ${
                r.includes('over budget')  ? 'warn' :
                r.includes('well under') || r.includes('fits') ? 'good' : ''
              }`}>{r}</span>
            ))}
          </div>
        </div>
        <div className="ex-card-aside">
          <span className="ex-score">{dest.score}%</span>
          <span className="ex-est" style={{ color: isOver ? 'var(--rust)' : undefined }}>
            ~${dest.estimatedCost.toLocaleString()}
          </span>
          <span className="ex-caret">{isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
        </div>
      </button>

      {isOpen && (
        <div className="ex-expanded">
          {/* Photo strip */}
          {imageUrl ? (
            <div className="ex-exp-photo" style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          ) : (
            <div className="ex-exp-strip" style={{ background: dest.imageGradient }} />
          )}

          <div className="ex-exp-body">
            <div className="ex-exp-cols">
              {/* Cost */}
                <div className="ex-exp-col">
                  <div className="ex-col-header">
                    <h4>Estimated costs</h4>
                  </div>
                  {driveTrip ? (
                    <div className="ex-cost-row">
                      <span><Car size={12} /> Drive ~{driveHrs}h + rental car</span>
                      <strong>~${(RENTAL_CAR_PER_DAY * nights).toLocaleString()} rental</strong>
                    </div>
                  ) : (
                    <div className="ex-cost-row"><span><Plane size={12} /> Flights (r/t)</span><strong>~${(oneWayFlight(constraints, dest) * 2).toLocaleString()}</strong></div>
                  )}                  <div className="ex-cost-row"><span><BedDouble size={12} /> Hotel</span><strong>~${dest.hotelPerNight}/night</strong></div>
                  <div className="ex-cost-row"><span><Utensils size={12} /> Daily spend</span><strong>~${dest.dailySpend}/day</strong></div>
                  <div className="ex-cost-row total">
                    <span>Est. total</span>
                    <strong style={{ color: isOver ? 'var(--rust)' : '#1a5c2a' }}>
                      ${dest.estimatedCost.toLocaleString()}{isOver ? ' ↑' : ''}
                    </strong>
                  </div>
                  <div className="booking-links">
                    {driveTrip && carUrl ? (
                      <a href={carUrl} target="_blank" rel="noreferrer" className="booking-link flight-link">
                        <Car size={12} /> Search rental cars on Kayak →
                      </a>
                    ) : flightUrl ? (
                      <a href={flightUrl} target="_blank" rel="noreferrer" className="booking-link flight-link">
                        <Plane size={12} /> Search flights on Kayak →
                      </a>
                    ) : null}
                    <a href={hotelUrl} target="_blank" rel="noreferrer" className="booking-link hotel-link">
                      <BedDouble size={12} /> Hotels on Booking.com →
                    </a>
                  </div>
                </div>

              <div className="ex-exp-col">
                <h4>Highlights</h4>
                <ul className="ex-hl-list">
                  {dest.highlights.map(h => <li key={h}>{h}</li>)}
                </ul>
              </div>

              <div className="ex-exp-col">
                <h4>Watch outs</h4>
                <ul className="ex-wo-list">
                  {dest.watchOuts.slice(0, 3).map(w => <li key={w}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="ex-exp-actions">
              <button className="ex-detail-btn" onClick={onDetail}>Full details</button>
              <button className="ex-plan-btn"   onClick={onPlan}>Start planning →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const VIBE_LABELS: Record<Vibe, string> = {
  beach: 'Beach', city: 'City', nature: 'Nature', historical: 'Historical',
  food: 'Food', nightlife: 'Nightlife', adventure: 'Adventure', quiet: 'Quiet',
  tropical: 'Tropical', luxury: 'Luxury', 'budget-friendly': 'Budget',
}

const DEFAULT_SHOWN = 6

interface Props {
  constraints: TripConstraints
  onDetail: (d: Destination) => void
  onPlan:   (d: Destination) => void
  onBack:   () => void
}

export default function ExploreScreen({ constraints, onDetail, onPlan, onBack }: Props) {
  const [showAll, setShowAll]   = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const all = useMemo(() => filterDestinations(constraints), [constraints])
  const available = useMemo(
    () => all.filter(dest => !dismissedIds.includes(dest.id)),
    [all, dismissedIds],
  )
  const displayed = showAll ? available : available.slice(0, DEFAULT_SHOWN)

  const dismissDestination = (id: string) => {
    setDismissedIds(prev => prev.includes(id) ? prev : [...prev, id])
    setExpanded(prev => prev === id ? null : prev)
  }

  const resetDismissed = () => {
    setDismissedIds([])
    setExpanded(null)
  }

  return (
    <div className="ex-root">
      <aside className="ex-sidebar">
        <div className="ex-trip-card">
          <h3>Your trip</h3>
          <div className="ex-meta-row"><span>From</span><strong>{constraints.homeCity}</strong></div>
          <div className="ex-meta-row"><span>Budget</span><strong>${constraints.budget.toLocaleString()}</strong></div>
          <div className="ex-meta-row"><span>Length</span><strong>{constraints.tripLength}</strong></div>
          <div className="ex-meta-row"><span>Scope</span><strong>{SCOPE_LABELS[constraints.scope]}</strong></div>
          <div className="ex-vibes">
            {constraints.vibes.map(v => (
              <span key={v} className="ex-vibe-tag">{VIBE_LABELS[v]}</span>
            ))}
          </div>
        </div>
        <button className="ex-change-btn" onClick={onBack}>← Change search</button>
        <div className="ex-hint">
          <p>Destinations ranked by budget fit, vibe match, and trip length.</p>
          {constraints.airportCode && (
            <p style={{ marginTop: 6 }}>
              Expand a card for Kayak flight search from <strong>{constraints.airportCode}</strong>.
            </p>
          )}
        </div>
      </aside>

      <main className="ex-main">
        <div className="ex-heading">
          <div>
            <h2>{showAll ? `All ${available.length} destinations` : `Your top ${displayed.length} picks`}</h2>
            <p>
              {showAll
                ? 'Showing everything still in your queue.'
                : "Skip anything you don't like and the next best match will move in."}
            </p>
          </div>
          <div className="ex-heading-actions">
            {dismissedIds.length > 0 && (
              <button className="ex-show-all-btn" onClick={resetDismissed}>
                Reset skipped ({dismissedIds.length})
              </button>
            )}
            {!showAll && available.length > DEFAULT_SHOWN && (
              <button className="ex-show-all-btn" onClick={() => setShowAll(true)}>
                See all {available.length} →
              </button>
            )}
          </div>
        </div>

        {all.length === 0 ? (
          <div className="ex-empty">
            <p><strong>No destinations matched your search.</strong></p>
            <p>Try increasing your budget, selecting different vibes, or switching to a longer trip length.</p>
            <button className="ex-change-btn" onClick={onBack} style={{ marginTop: 16 }}>← Adjust search</button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="ex-empty">
            <p><strong>You skipped every current match.</strong></p>
            <p>Reset skipped trips or adjust your search to refresh the queue.</p>
            <button className="ex-change-btn" onClick={resetDismissed} style={{ marginTop: 16 }}>Reset skipped trips</button>
          </div>
        ) : (
          <>
            <div className="ex-list">
              {displayed.map((dest, idx) => (
                <DestCard
                  key={dest.id}
                  dest={dest}
                  idx={idx}
                  constraints={constraints}
                  isOpen={expanded === dest.id}
                  onToggle={() => setExpanded(prev => prev === dest.id ? null : dest.id)}
                  onDismiss={() => dismissDestination(dest.id)}
                  onDetail={() => onDetail(dest)}
                  onPlan={()   => onPlan(dest)}
                />
              ))}
            </div>

            {available.length > DEFAULT_SHOWN && (
              <div className="ex-toggle-row">
                {showAll
                  ? <button className="ex-change-btn" onClick={() => { setShowAll(false); setExpanded(null) }}>↑ Show top {DEFAULT_SHOWN} only</button>
                  : <button className="ex-change-btn" onClick={() => setShowAll(true)}>Show all {available.length} destinations →</button>
                }
              </div>
            )}

            <div className="ex-footer-note">
              <p>Not finding the right fit?</p>
              <button className="ex-change-btn" onClick={onBack}>Adjust your search</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
