import { useState, useEffect } from 'react';
import MapView from '../../components/screens/MapView';
import { apiFetch } from '../../lib/api';

export default function MapPage() {
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/listings/map').then(r => setPins(r.pins || [])).catch(console.error);
  }, []);

  return <MapView pins={pins} />;
}
