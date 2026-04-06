import { useEffect, useRef } from 'react';
import { colors } from '../../lib/colors';

export interface MapListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  lat: number | null;
  lng: number | null;
  photo: string | null;
}

interface SearchMapProps {
  listings: MapListing[];
  onMarkerPress?: (id: string) => void;
}

// Inject Leaflet CSS once
function injectLeafletCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('leaflet-css')) return;
  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

// Fix default marker icon paths broken by bundlers
function fixLeafletIcons(L: typeof import('leaflet')) {
  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = icon;
}

// Add small random offset to separate markers sharing identical coordinates
// Only applied when two or more listings have the exact same lat/lng (city-level fallback)
function jitter(val: number): number {
  return val + (Math.random() - 0.5) * 0.004;
}

// Build a set of coordinate keys that appear more than once (city-level duplicates)
function findDuplicateCoordKeys(listings: { lat: number | null; lng: number | null }[]): Set<string> {
  const counts = new Map<string, number>();
  for (const l of listings) {
    if (l.lat === null || l.lng === null) continue;
    const key = `${l.lat}:${l.lng}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const duplicates = new Set<string>();
  for (const [key, count] of counts) {
    if (count > 1) duplicates.add(key);
  }
  return duplicates;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return 'Договорная';
  return `${price.toLocaleString()} ${currency}`;
}

export function SearchMap({ listings, onMarkerPress }: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    injectLeafletCSS();

    // Dynamically import Leaflet (web only)
    import('leaflet').then((L) => {
      fixLeafletIcons(L);

      // Destroy existing map if remounting
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Default center: Tbilisi
      const defaultCenter: [number, number] = [41.6938, 44.8015];
      const validListings = listings.filter((l) => l.lat !== null && l.lng !== null);

      const map = L.map(containerRef.current!, {
        center: defaultCenter,
        zoom: validListings.length > 0 ? 12 : 10,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add markers — jitter only when multiple listings share identical coords
      const duplicateKeys = findDuplicateCoordKeys(validListings);
      validListings.forEach((listing) => {
        const coordKey = `${listing.lat}:${listing.lng}`;
        const needsJitter = duplicateKeys.has(coordKey);
        const lat = needsJitter ? jitter(listing.lat as number) : listing.lat as number;
        const lng = needsJitter ? jitter(listing.lng as number) : listing.lng as number;

        const marker = L.marker([lat, lng]).addTo(map);

        const popupContent = `
          <div style="min-width:140px;font-family:sans-serif;">
            <div style="font-weight:600;font-size:13px;margin-bottom:4px;line-height:1.3;">${listing.title}</div>
            <div style="color:${colors.brandPrimary};font-size:13px;font-weight:700;">${formatPrice(listing.price, listing.currency)}</div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onMarkerPress?.(listing.id);
        });
      });

      // Fit bounds if multiple markers
      if (validListings.length > 1) {
        const bounds = L.latLngBounds(
          validListings.map((l) => [l.lat as number, l.lng as number])
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [listings]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        flex: 1,
      }}
    />
  );
}
