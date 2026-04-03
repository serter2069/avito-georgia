import { View, ScrollView, Text, TextInput, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { CitySelector, City } from '../components/common/CitySelector';
import { ListingFeed } from '../components/listing/ListingFeed';
import { colors } from '../lib/colors';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <View className="flex-1 bg-dark">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
      >
        {/* Search bar */}
        <View className="px-4 pt-3 pb-1">
          <View className="flex-row bg-surface border border-border rounded-lg overflow-hidden">
            <TextInput
              className="flex-1 px-4 py-3 text-text-primary text-base"
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              className="px-4 items-center justify-center bg-primary"
              onPress={handleSearch}
            >
              <Ionicons name="search" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Listings feed (compact mode) */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between px-4 mb-1">
            <Text className="text-text-primary text-lg font-bold">{t('newListings')}</Text>
            <TouchableOpacity onPress={() => router.push('/listings')}>
              <Text className="text-primary text-sm font-medium">{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <ListingFeed compact />
        </View>
      </ScrollView>
    </View>
  );
}
