// Native stub — Leaflet is web-only, return null on native platforms
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

export function SearchMap(_props: SearchMapProps): null {
  return null;
}
