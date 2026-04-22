import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import MapView from '../../components/screens/MapView';
import { apiFetch } from '../../lib/api';

export default function MapPage() {
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/listings/map').then(r => setPins(r.pins || [])).catch(console.error);
  }, []);

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><Stack.Screen options={{ headerShown: true, title: 'Карта' }} /><MapView pins={pins} /></SafeAreaView>;
}
