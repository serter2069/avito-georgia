// Geocode a city name using OpenStreetMap Nominatim (free, no API key required)
// Fault-tolerant: returns null on any error, never throws
export async function geocodeCity(cityName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ',Georgia')}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'avito-georgia/1.0' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Timeout, network error, parse error — all silently ignored
  }
  return null;
}
