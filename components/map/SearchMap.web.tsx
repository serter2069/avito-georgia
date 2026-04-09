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

// Inject Leaflet.markercluster CSS once
function injectMarkerClusterCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('leaflet-cluster-css')) return;
  const link = document.createElement('link');
  link.id = 'leaflet-cluster-css';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
  document.head.appendChild(link);
  const linkDefault = document.createElement('link');
  linkDefault.id = 'leaflet-cluster-css-default';
  linkDefault.rel = 'stylesheet';
  linkDefault.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
  document.head.appendChild(linkDefault);
}

// Inject Leaflet.markercluster JS once — returns a Promise that resolves when ready
function injectMarkerClusterJS(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  // Already injected and loaded
  if ((window as any).L?.MarkerClusterGroup) return Promise.resolve();
  // Script tag already in DOM but not yet loaded
  const existing = document.getElementById('leaflet-cluster-js');
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
    });
  }
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = 'leaflet-cluster-js';
    script.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
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
    injectMarkerClusterCSS();

    // Dynamically import Leaflet + wait for markercluster JS to load
    Promise.all([import('leaflet'), injectMarkerClusterJS()]).then(([L]) => {
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

      // Create marker cluster group — groups nearby pins when zoomed out
      // CDN-injected leaflet.markercluster attaches to window.L, not to the ESM L instance
      const clusterGroup = (window as any).L.markerClusterGroup({
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 17,
      });

      validListings.forEach((listing) => {
        const marker = L.marker([listing.lat as number, listing.lng as number]);

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

        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);

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
