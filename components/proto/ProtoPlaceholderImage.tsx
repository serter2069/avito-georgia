import React, { useState } from 'react';
import { Image, View } from 'react-native';

// Deterministic seed from index — each listing gets its own consistent photo
export function listingImageUrl(seed: number | string, w = 400, h = 300): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

interface ProtoImageProps {
  seed: number | string;
  width?: number | string;
  height?: number | string;
  style?: any;
  fallbackColor?: string;
}

export function ProtoImage({ seed, width = '100%', height, style, fallbackColor = '#C8E6C9' }: ProtoImageProps) {
  const [error, setError] = useState(false);
  const w = typeof width === 'number' ? width : 400;
  const h = typeof height === 'number' ? height : 300;
  const uri = listingImageUrl(seed, typeof w === 'number' ? w : 400, typeof h === 'number' ? h : 300);

  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]}>
      {error ? (
        <View style={{ flex: 1, backgroundColor: fallbackColor }} />
      ) : (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      )}
    </View>
  );
}

export default ProtoImage;
