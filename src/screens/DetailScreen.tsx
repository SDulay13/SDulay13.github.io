import {
  DEST_AIRPORT_CODES,
  DEST_DRIVE_RENTAL_AIRPORT,
  tripBudget,
  lengthToNights,
  oneWayFlight,
  isDriveTrip,
  getDriveHours,
  RENTAL_CAR_PER_DAY,
  type Destination,
  type TripConstraints,
} from '../data'
import { Plane, BedDouble, Utensils, Sun, Car } from '../icons'
import { useDestinationImage } from '../hooks'
import { kayakFlightUrl, bookingHotelUrl, kayakAirportCarUrl } from '../api'

interface Props {
  dest: Destination
  constraints: TripConstraints
  onPlan: () => void
  onBack: () => void
}

export default function DetailScreen({ dest, constraints, onPlan, onBack }: Props) {
  const estimated    = tripBudget(constraints, dest)
  const nights       = lengthToNights(constraints.tripLength)
  const withinBudget = estimated <= constraints.budget
  const rtFlight     = oneWayFlight(constraints, dest) * 2
  const driveTrip    = isDriveTrip(constraints, dest)
  const driveHrs     = getDriveHours(constraints, dest)
  const { imageUrl } = useDestinationImage(dest.city, dest.id)

  const destAirport = DEST_AIRPORT_CODES[dest.id]
  const rentalPickup =
    driveTrip ? (DEST_DRIVE_RENTAL_AIRPORT[dest.id] ?? destAirport) : undefined
  const flightUrl =
    !driveTrip && constraints.airportCode && destAirport
      ? kayakFlightUrl(constraints.airportCode, destAirport, nights)
      : null
  const carUrl = driveTrip && rentalPickup ? kayakAirportCarUrl(rentalPickup) : null
  const hotelUrl = bookingHotelUrl(dest.city, nights)

  const heroStyle = imageUrl
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%), url(${imageUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }
    : { background: dest.imageGradient }

  return (
    <div className="detail-root">
      {/* Hero */}
      <div className="detail-hero" style={heroStyle}>
        <button className="back-btn light" onClick={onBack}>← Back to explore</button>
        <div className="detail-hero-text">
          <div className="detail-tags-row">
            {dest.vibes.map(v => (
              <span key={v} className="detail-vibe-tag">{v}</span>
            ))}
          </div>
          <h1 className="detail-city">{dest.city}</h1>
          <p className="detail-country">{dest.country}</p>
          <p className="detail-tagline">{dest.tagline}</p>
        </div>
        <div className="detail-hero-stats">
          <div className="hero-stat"><span>Est. total</span><strong>${estimated.toLocaleString()}</strong></div>
          <div className="hero-stat"><span>Flight</span><strong>{dest.flightHours}h</strong></div>
          <div className="hero-stat"><span>Weather</span><strong>{dest.weather.split(',')[0]}</strong></div>
          <div className={`hero-stat fit ${withinBudget ? 'ok' : 'over'}`}>
            <span>Budget</span><strong>{withinBudget ? '✓ Fits' : '↑ Over'}</strong>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          {/* Why this fits */}
          <section className="detail-section">
            <h2>Why this works for your trip</h2>
            <p className="why-text">
              {dest.city} works well for a {constraints.tripLength} trip from {constraints.homeCity}.
              {driveTrip
                ? ` It's a ~${driveHrs}h drive — rent a car (~$${RENTAL_CAR_PER_DAY}/day) and skip the airport entirely.`
                : ` Flights run around $${rtFlight.toLocaleString()}, hotels are $${dest.hotelPerNight}/night, and`}
              {!driveTrip && ` you can live well on $${dest.dailySpend}/day.`} Total estimate is ${estimated.toLocaleString()},
              {withinBudget ? ` which fits your $${constraints.budget.toLocaleString()} budget` : ` which is slightly over your $${constraints.budget.toLocaleString()} budget`}.
              {dest.vibes.filter(v => constraints.vibes.includes(v)).length > 0 &&
                ` It matches your ${dest.vibes.filter(v => constraints.vibes.includes(v)).join(', ')} vibe preferences.`}
            </p>
          </section>

          {/* Cost breakdown */}
          <section className="detail-section">
            <h2>Cost breakdown</h2>
            <div className="cost-table">
              {driveTrip ? (
                <div className="cost-row"><span><Car size={13} /> Drive ~{driveHrs}h + rental car ({nights} days)</span><strong>~${(RENTAL_CAR_PER_DAY * nights).toLocaleString()}</strong></div>
              ) : (
                <div className="cost-row"><span><Plane size={13} /> Flights (round trip)</span><strong>~${rtFlight.toLocaleString()}</strong></div>
              )}
              <div className="cost-row"><span><BedDouble size={13} /> Hotel ({nights} nights × ~${dest.hotelPerNight})</span><strong>~${(dest.hotelPerNight * nights).toLocaleString()}</strong></div>
              <div className="cost-row"><span><Utensils size={13} /> Food + transport ({nights} days × ${dest.dailySpend})</span><strong>~${(dest.dailySpend * nights).toLocaleString()}</strong></div>
              <div className="booking-links" style={{ marginTop: 12 }}>
                {driveTrip && carUrl ? (
                  <a href={carUrl} target="_blank" rel="noreferrer" className="booking-link flight-link">
                    <Car size={12} /> Search rental cars on Kayak →
                  </a>
                ) : flightUrl ? (
                  <a href={flightUrl} target="_blank" rel="noreferrer" className="booking-link flight-link">
                    <Plane size={12} /> Search real flights on Kayak →
                  </a>
                ) : null}
                <a href={hotelUrl} target="_blank" rel="noreferrer" className="booking-link hotel-link">
                  <BedDouble size={12} /> Browse hotels on Booking.com →
                </a>
              </div>
              <div className="cost-row total-row"><span>Estimated total</span><strong>${estimated.toLocaleString()}</strong></div>
            </div>
          </section>

          {/* What this trip feels like */}
          <section className="detail-section">
            <h2>What this trip feels like</h2>
            <div className="feel-grid">
              {dest.vibes.map(v => (
                <div key={v} className="feel-chip">{v}</div>
              ))}
            </div>
            <p className="weather-note"><Sun size={13} /> {dest.weather}</p>
          </section>

          {/* Activities */}
          <section className="detail-section">
            <h2>Things to do</h2>
            <div className="activity-list">
              {dest.activities.map(a => (
                <div key={a} className="activity-item">
                  <span className="activity-dot">•</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sample itinerary */}
          <section className="detail-section">
            <h2>Sample {constraints.tripLength} structure</h2>
            <div className="sample-days">
              {dest.sampleDays.slice(0, lengthToNights(constraints.tripLength) + 1).map(day => (
                <div key={day.label} className="sample-day">
                  <div className="day-label">{day.label}</div>
                  <div className="day-items">
                    {day.items.map(item => <p key={item}>{item}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Best for + watch outs */}
          <div className="two-col">
            <section className="detail-section">
              <h2>Best for</h2>
              <ul className="tag-list">
                {dest.bestFor.map(b => <li key={b} className="tag-list-item good">{b}</li>)}
              </ul>
            </section>
            <section className="detail-section">
              <h2>Watch outs</h2>
              <ul className="tag-list">
                {dest.watchOuts.map(w => <li key={w} className="tag-list-item warn">{w}</li>)}
              </ul>
            </section>
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-dest-hero" style={{ background: dest.imageGradient }}>
              <h3>{dest.city}</h3>
              <p>{dest.country}</p>
            </div>
            <div className="sidebar-meta">
              <div className="sidebar-row"><span>Total estimate</span><strong>${estimated.toLocaleString()}</strong></div>
              <div className="sidebar-row"><span>Flight time</span><strong>{dest.flightHours}h one way</strong></div>
              <div className="sidebar-row"><span>Trip length</span><strong>{constraints.tripLength}</strong></div>
              <div className="sidebar-row"><span>Budget</span><strong className={withinBudget ? 'ok' : 'over'}>{withinBudget ? `$${(constraints.budget - estimated).toLocaleString()} under` : `$${(estimated - constraints.budget).toLocaleString()} over`}</strong></div>
            </div>
            <button className="sidebar-plan-btn" onClick={onPlan}>Start planning this trip →</button>
            <button className="sidebar-back-btn" onClick={onBack}>Back to explore</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
