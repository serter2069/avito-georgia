import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings, mockCities } from '../../../constants/protoMockData';

const C = {
  primary: '#0A7B8A',
  primaryBg: '#E8F4F8',
  page: '#F2F8FA',
  white: '#FFFFFF',
  text: '#0A2840',
  muted: '#6A8898',
  border: '#C8E0E8',
  accent: '#1A9BAA',
};

const mapMarkers = [
  { id: 'm1', x: 35, y: 25, listing: mockListings[0], color: '#0A7B8A' },
  { id: 'm2', x: 55, y: 40, listing: mockListings[1], color: '#0A7B8A' },
  { id: 'm3', x: 70, y: 20, listing: mockListings[2], color: '#D32F2F' },
  { id: 'm4', x: 25, y: 55, listing: mockListings[4], color: '#0A7B8A' },
  { id: 'm5', x: 80, y: 60, listing: mockListings[8], color: '#0A7B8A' },
  { id: 'm6', x: 45, y: 70, listing: mockListings[9], color: '#D32F2F' },
];

function MapMarker({ x, y, listing, isSelected, onPress }: {
  x: number; y: number; listing: typeof mockListings[0]; isSelected: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        left: `${x}%` as any,
        top: `${y}%` as any,
        alignItems: 'center',
        transform: [{ translateX: -16 }, { translateY: -40 }],
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <View style={{
        backgroundColor: isSelected ? '#D32F2F' : C.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      }}>
        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
          {listing.price ? `${(listing.price / 1000).toFixed(0)}K` : ''}
        </Text>
      </View>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: isSelected ? '#D32F2F' : C.primary,
      }} />
    </Pressable>
  );
}

function ListingPreview({ listing, onClose }: { listing: typeof mockListings[0]; onClose: () => void }) {
  return (
    <View style={{
      backgroundColor: C.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      width: 260,
    }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: listing.photos[0] || `https://picsum.photos/seed/map-${listing.id}/400/200` }}
          style={{ width: 260, height: 120 }}
          resizeMode="cover"
        />
        <Pressable onPress={onClose} style={{
          position: 'absolute', top: 6, right: 6,
          backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12,
          width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather name="x" size={14} color="#fff" />
        </Pressable>
        {listing.isPromoted && (
          <View style={{
            position: 'absolute', top: 6, left: 6,
            backgroundColor: '#D32F2F', borderRadius: 4,
            paddingHorizontal: 6, paddingVertical: 2,
          }}>
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>TOP</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 }}>
          {listing.price ? `${listing.price.toLocaleString()} ${listing.currency}` : 'Договорная'}
        </Text>
        <Text style={{ fontSize: 13, color: C.text, marginBottom: 4 }} numberOfLines={1}>{listing.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="map-pin" size={11} color={C.muted} />
          <Text style={{ fontSize: 11, color: C.muted }}>{listing.city}</Text>
          <Text style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{listing.views} просмотров</Text>
        </View>
      </View>
    </View>
  );
}

function FilterBar({ selectedCity, onCityChange }: { selectedCity: string | null; onCityChange: (city: string | null) => void }) {
  return (
    <View style={{
      backgroundColor: C.white,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    }}>
      <Feather name="search" size={16} color={C.muted} />
      <View style={{ flexDirection: 'row', flex: 1, gap: 6, overflow: 'hidden' }}>
        {mockCities.slice(0, 4).map(city => (
          <Pressable
            key={city}
            onPress={() => onCityChange(selectedCity === city ? null : city)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 14,
              backgroundColor: selectedCity === city ? C.primary : C.primaryBg,
              borderWidth: 1,
              borderColor: selectedCity === city ? C.primary : C.border,
            }}
          >
            <Text style={{
              fontSize: 12, fontWeight: '600',
              color: selectedCity === city ? '#fff' : C.text,
            }}>{city}</Text>
          </Pressable>
        ))}
      </View>
      <TouchableOpacity style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}>
        <Feather name="sliders" size={14} color={C.text} />
        <Text style={{ fontSize: 12, fontWeight: '600', color: C.text }}>Фильтры</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MapViewStates() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  const selectedListing = mapMarkers.find(m => m.id === selectedMarker)?.listing;

  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar selectedCity={selectedCity} onCityChange={setSelectedCity} />

          {/* Map Area */}
          <View style={{ position: 'relative', height: 500, backgroundColor: '#D4E8D0' }}>
            {/* Map grid lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`h${i}`} style={{
                position: 'absolute', left: 0, right: 0,
                top: `${(i + 1) * 12}%` as any,
                height: 1, backgroundColor: 'rgba(255,255,255,0.3)',
              }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={`v${i}`} style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${(i + 1) * 10}%` as any,
                width: 1, backgroundColor: 'rgba(255,255,255,0.3)',
              }} />
            ))}

            {/* "Roads" */}
            <View style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: 3, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ position: 'absolute', left: '65%', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <View style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} />

            {/* Water area */}
            <View style={{
              position: 'absolute', right: 0, top: '50%', bottom: 0, width: '25%',
              backgroundColor: '#A8D8EA', opacity: 0.4, borderTopLeftRadius: 30,
            }} />

            {/* Markers */}
            {mapMarkers.map(marker => (
              <MapMarker
                key={marker.id}
                x={marker.x}
                y={marker.y}
                listing={marker.listing}
                isSelected={selectedMarker === marker.id}
                onPress={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              />
            ))}

            {/* Listing preview card */}
            {selectedListing && (
              <View style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: [{ translateX: -130 }],
                zIndex: 20,
              }}>
                <ListingPreview listing={selectedListing} onClose={() => setSelectedMarker(null)} />
              </View>
            )}

            {/* Zoom controls */}
            <View style={{
              position: 'absolute', right: 12, top: 12,
              backgroundColor: C.white, borderRadius: 8,
              borderWidth: 1, borderColor: C.border, overflow: 'hidden',
            }}>
              <TouchableOpacity style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <Feather name="plus" size={18} color={C.text} />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8 }}>
                <Feather name="minus" size={18} color={C.text} />
              </TouchableOpacity>
            </View>

            {/* My location button */}
            <TouchableOpacity style={{
              position: 'absolute', right: 12, bottom: 16,
              backgroundColor: C.white, borderRadius: 8,
              borderWidth: 1, borderColor: C.border, padding: 8,
            }}>
              <Feather name="navigation" size={18} color={C.primary} />
            </TouchableOpacity>
          </View>

          {/* Bottom listing count */}
          <View style={{
            backgroundColor: C.white,
            borderTopWidth: 1,
            borderTopColor: C.border,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>
              Найдено: {mapMarkers.length} объявлений
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="list" size={16} color={C.primary} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>Списком</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar selectedCity={null} onCityChange={() => {}} />
          <View style={{ height: 500, backgroundColor: '#D4E8D0', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 24, alignItems: 'center' }}>
              <Feather name="loader" size={32} color={C.primary} />
              <Text style={{ fontSize: 14, color: C.muted, marginTop: 12 }}>Загрузка карты...</Text>
            </View>
          </View>
        </View>
      </StateSection>

      <StateSection title="NO_RESULTS">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar selectedCity={null} onCityChange={() => {}} />
          <View style={{ height: 500, backgroundColor: '#D4E8D0', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 24, alignItems: 'center', maxWidth: 280 }}>
              <Feather name="map-pin" size={40} color={C.muted} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginTop: 12 }}>Нет объявлений в этом районе</Text>
              <Text style={{ fontSize: 13, color: C.muted, marginTop: 6, textAlign: 'center' }}>
                Попробуйте изменить фильтры или выбрать другой город
              </Text>
              <TouchableOpacity style={{
                backgroundColor: C.primary, paddingHorizontal: 20, paddingVertical: 10,
                borderRadius: 8, marginTop: 16,
              }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Сбросить фильтры</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
