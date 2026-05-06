import { useState, useCallback, useEffect } from 'react'
import './App.css'
import LandingScreen from './screens/LandingScreen'
import ExploreScreen from './screens/ExploreScreen'
import DetailScreen from './screens/DetailScreen'
import PlanScreen from './screens/PlanScreen'
import { SCOPE_LABELS, type Destination, type TripConstraints, type TripPlanState } from './data'

type Screen = 'landing' | 'explore' | 'detail' | 'plan' | 'saved'

export interface SavedTrip {
  id: string
  savedAt: number
  dest: Destination
  constraints: TripConstraints
  plan?: TripPlanState
}

export default function App() {
  const [screen,       setScreen]       = useState<Screen>('landing')
  const [constraints,  setConstraints]  = useState<TripConstraints | null>(null)
  const [focusDest,    setFocusDest]    = useState<Destination | null>(null)
  const [savedTrips,   setSavedTrips]   = useState<SavedTrip[]>([])
  const [activeTripId, setActiveTripId] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.removeItem('roam_saved_trips')
    } catch { /* ignore */ }
  }, [])

  const saveTrip = (dest: Destination, c: TripConstraints): string => {
    const tripKey = (t: SavedTrip) =>
      `${t.dest.id}-${t.constraints.budget}-${t.constraints.tripLength}`
    const key = `${dest.id}-${c.budget}-${c.tripLength}`
    let id = ''
    setSavedTrips(prev => {
      const existing = prev.find(t => tripKey(t) === key)
      if (existing) {
        id = existing.id
        return prev
      }
      id = `${Date.now()}`
      const trip: SavedTrip = { id, savedAt: Date.now(), dest, constraints: c }
      return [trip, ...prev]
    })
    return id
  }

  const handlePersistPlan = useCallback((plan: TripPlanState) => {
    if (!activeTripId) return
    setSavedTrips(prev =>
      prev.map(t => (t.id === activeTripId ? { ...t, plan } : t)),
    )
  }, [activeTripId])

  const removeTrip = (id: string) =>
    setSavedTrips(prev => prev.filter(t => t.id !== id))

  const resumeTrip = (trip: SavedTrip) => {
    setConstraints(trip.constraints)
    setFocusDest(trip.dest)
    setActiveTripId(trip.id)
    setScreen('plan')
  }

  return (
    <div className="app-root">
      <nav className="app-nav">
        <button className="nav-logo" onClick={() => setScreen('landing')}>
          <span className="logo-mark">✦</span> Roam
        </button>
        <div className="nav-tabs">
          {constraints && (
            <>
              <button
                className={`nav-tab ${screen === 'explore' ? 'active' : ''}`}
                onClick={() => setScreen('explore')}
              >Results</button>
              {focusDest && (
                <button
                  className={`nav-tab ${screen === 'detail' ? 'active' : ''}`}
                  onClick={() => setScreen('detail')}
                >Details</button>
              )}
              {focusDest && (
                <button
                  type="button"
                  className={`nav-tab ${screen === 'plan' ? 'active' : ''}`}
                  onClick={() => {
                    if (!focusDest || !constraints) return
                    setActiveTripId(prev => prev ?? saveTrip(focusDest, constraints))
                    setScreen('plan')
                  }}
                >Plan</button>
              )}
            </>
          )}
          <button
            className={`nav-tab ${screen === 'saved' ? 'active' : ''}`}
            onClick={() => setScreen('saved')}
          >
            Saved{savedTrips.length > 0 && <span className="nav-badge">{savedTrips.length}</span>}
          </button>
        </div>
        <div className="nav-right">
          <span className="nav-tagline">Find where you can actually go</span>
        </div>
      </nav>

      <main className="app-main">
        {screen === 'landing' && (
          <LandingScreen
            initial={constraints}
            onSubmit={c => {
              setConstraints(c)
              setFocusDest(null)
              setActiveTripId(null)
              setScreen('explore')
            }}
          />
        )}
        {screen === 'explore' && constraints && (
          <ExploreScreen
            constraints={constraints}
            onDetail={d => { setFocusDest(d); setScreen('detail') }}
            onPlan={d => {
              const id = saveTrip(d, constraints)
              setActiveTripId(id)
              setFocusDest(d)
              setScreen('plan')
            }}
            onBack={() => setScreen('landing')}
          />
        )}
        {screen === 'detail' && constraints && focusDest && (
          <DetailScreen
            dest={focusDest}
            constraints={constraints}
            onPlan={() => {
              const id = saveTrip(focusDest, constraints)
              setActiveTripId(id)
              setScreen('plan')
            }}
            onBack={() => setScreen('explore')}
          />
        )}
        {screen === 'plan' && constraints && focusDest && activeTripId && (
          <PlanScreen
            key={activeTripId}
            tripId={activeTripId}
            dest={focusDest}
            constraints={constraints}
            initialPlan={savedTrips.find(t => t.id === activeTripId)?.plan}
            onPersistPlan={handlePersistPlan}
            onBack={() => setScreen('explore')}
          />
        )}
        {screen === 'saved' && (
          <SavedTripsScreen
            trips={savedTrips}
            onResume={resumeTrip}
            onRemove={removeTrip}
            onNewSearch={() => setScreen('landing')}
          />
        )}
      </main>
    </div>
  )
}

function SavedTripsScreen({
  trips, onResume, onRemove, onNewSearch,
}: {
  trips: SavedTrip[]
  onResume: (t: SavedTrip) => void
  onRemove: (id: string) => void
  onNewSearch: () => void
}) {
  return (
    <div className="saved-root">
      <div className="saved-header">
        <h2>Saved Trips</h2>
        <p>Pick up where you left off, or start planning a new one.</p>
      </div>

      {trips.length === 0 ? (
        <div className="saved-empty">
          <p>No saved trips yet.</p>
          <p>Start planning a destination and it will appear here.</p>
          <button className="cta-btn" onClick={onNewSearch} style={{ marginTop: 20 }}>
            Start exploring
          </button>
        </div>
      ) : (
        <div className="saved-list">
          {trips.map(trip => (
            <div key={trip.id} className="saved-card">
              <div className="saved-dest-bar" style={{ background: trip.dest.imageGradient }} />
              <div className="saved-card-body">
                <div className="saved-card-top">
                  <div>
                    <h3 className="saved-city">{trip.dest.city}</h3>
                    <span className="saved-country">{trip.dest.country}</span>
                  </div>
                  <button className="saved-remove" onClick={() => onRemove(trip.id)} title="Remove">✕</button>
                </div>
                <p className="saved-tagline">{trip.dest.tagline}</p>
                <div className="saved-meta">
                  <span>{trip.constraints.tripLength}</span>
                  <span>${trip.constraints.budget.toLocaleString()} budget</span>
                  <span>{SCOPE_LABELS[trip.constraints.scope]}</span>
                  {trip.constraints.airportCode && <span>from {trip.constraints.airportCode}</span>}
                </div>
                <div className="saved-vibes">
                  {trip.constraints.vibes.map(v => (
                    <span key={v} className="saved-vibe">{v}</span>
                  ))}
                </div>
                <div className="saved-actions">
                  <button className="saved-plan-btn" onClick={() => onResume(trip)}>
                    Continue planning →
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="ex-change-btn" onClick={onNewSearch} style={{ marginTop: 8 }}>
            + Start a new search
          </button>
        </div>
      )}
    </div>
  )
}
