import { useState, useEffect } from 'react'
import { fetchDestinationImage } from './api'

export function useDestinationImage(city: string, destId: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchDestinationImage(city).then(url => {
      if (!cancelled) { setImageUrl(url); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [city, destId])

  return { imageUrl, loading }
}
