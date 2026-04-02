import { View, Image, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';

interface PhotoGalleryProps {
  photos: string[];
  height?: number;
}

const SCREEN_WIDTH = Math.min(Dimensions.get('window').width, 430);

export function PhotoGallery({ photos, height = 300 }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  if (photos.length === 0) {
    return (
      <View
        className="bg-surface items-center justify-center"
        style={{ height }}
      >
        <Text className="text-text-muted">No photos</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height }}
            resizeMode="cover"
          />
        )}
      />

      {photos.length > 1 && (
        <View className="flex-row justify-center gap-1 py-2 absolute bottom-0 left-0 right-0">
          {photos.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex ? 'bg-primary' : 'bg-text-muted/50'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
