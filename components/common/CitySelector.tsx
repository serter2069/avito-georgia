import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

export type City = 'all' | 'tbilisi' | 'batumi' | 'kutaisi' | 'rustavi';

interface CitySelectorProps {
  selected: City;
  onSelect: (city: City) => void;
}

const CITIES: City[] = ['all', 'tbilisi', 'batumi', 'kutaisi', 'rustavi'];

const CITY_KEYS: Record<City, string> = {
  all: 'allCities',
  tbilisi: 'tbilisi',
  batumi: 'batumi',
  kutaisi: 'kutaisi',
  rustavi: 'rustavi',
};

export function CitySelector({ selected, onSelect }: CitySelectorProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4 py-2"
    >
      {CITIES.map((city) => (
        <TouchableOpacity
          key={city}
          className={`px-4 py-2 rounded-full border ${
            selected === city
              ? 'bg-primary border-primary'
              : 'bg-surface border-border'
          }`}
          onPress={() => onSelect(city)}
        >
          <Text
            className={`text-sm font-medium ${
              selected === city ? 'text-white' : 'text-text-secondary'
            }`}
          >
            {t(CITY_KEYS[city])}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
