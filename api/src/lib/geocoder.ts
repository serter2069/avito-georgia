// Nominatim response shape (only fields we use)
interface NominatimResult {
  lat: string;
  lon: string;
}

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
    const data = (await res.json()) as NominatimResult[];
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Timeout, network error, parse error — all silently ignored
  }
  return null;
}

// Geocode a specific address within a city using Nominatim
// Falls back to null when address is missing/too short — caller uses city-level coords instead
// Fault-tolerant: returns null on any error, never throws
export async function geocodeAddress(address: string, cityName: string): Promise<{ lat: number; lng: number } | null> {
  if (!address || address.trim().length < 3) return null;
  try {
    const query = `${address.trim()}, ${cityName}, Georgia`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'avito-georgia/1.0' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResult[];
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Timeout, network error, parse error — all silently ignored
  }
  return null;
}
