/** Unsplash hero images + outbound booking URLs (Kayak / Booking.com / Google Flights). */

const imageCache: Record<string, string> = {}

export async function fetchDestinationImage(city: string): Promise<string | null> {
  if (imageCache[city]) return imageCache[city]

  const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(city + ' landmark travel')}&orientation=landscape&client_id=${key}`,
    )
    const data = await res.json()
    const url: string = data.urls?.regular ?? ''
    if (url) imageCache[city] = url
    return url || null
  } catch {
    return null
  }
}

function departureDateStr(weeksOut = 5): string {
  const d = new Date(Date.now() + weeksOut * 7 * 24 * 60 * 60 * 1000)
  return d.toISOString().split('T')[0]
}

function returnDateStr(weeksOut = 5, tripNights = 5): string {
  const d = new Date(Date.now() + weeksOut * 7 * 24 * 60 * 60 * 1000 + tripNights * 24 * 60 * 60 * 1000)
  return d.toISOString().split('T')[0]
}

export function kayakFlightUrl(
  originCode: string,
  destAirportCode: string,
  tripNights = 5,
): string {
  const dep = departureDateStr()
  const ret = returnDateStr(5, tripNights)
  return `https://www.kayak.com/flights/${originCode}-${destAirportCode}/${dep}/${ret}`
}

export function bookingHotelUrl(city: string, tripNights = 5): string {
  const checkIn = departureDateStr()
  const checkOut = returnDateStr(5, tripNights)
  const q = encodeURIComponent(city)
  return `https://www.booking.com/searchresults.html?ss=${q}&checkin=${checkIn}&checkout=${checkOut}&group_adults=1`
}

export function googleFlightsUrl(originCode: string, city: string): string {
  const q = encodeURIComponent(`Flights from ${originCode} to ${city}`)
  return `https://www.google.com/travel/flights?q=${q}`
}

/** Opens Kayak airport pickup search (canonical slug redirect). Use nearest gateway airport for the destination. */
export function kayakAirportCarUrl(iata: string): string {
  const code = iata.trim().toUpperCase()
  return `https://www.kayak.com/${code}-Airport-Car-Rentals.${code}.cap.ksp`
}
