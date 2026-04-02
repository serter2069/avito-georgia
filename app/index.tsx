import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CitySelector, City } from '../components/common/CitySelector';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';

const CATEGORIES: CategoryType[] = [
  'transport',
  'realEstate',
  'electronics',
  'clothing',
  'furniture',
  'services',
  'jobs',
  'other',
];

// Placeholder listings for initial render
const PLACEHOLDER_LISTINGS: Listing[] = [];

export default function HomeScreen() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<City>('all');

  const handleListingPress = (id: string) => {
    // Will navigate to listing detail when routes are ready
  };

  return (
    <View className="flex-1 bg-dark">
      <Header />

      <ScrollView className="flex-1" contentContainerClassName="pb-4">
        {/* City selector */}
        <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4 py-3"
        >
          {CATEGORIES.map((cat) => (
            <CategoryIcon key={cat} category={cat} size="md" />
          ))}
        </ScrollView>

        {/* Listings */}
        <View className="px-4 gap-3">
          {PLACEHOLDER_LISTINGS.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={handleListingPress}
            />
          ))}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}
