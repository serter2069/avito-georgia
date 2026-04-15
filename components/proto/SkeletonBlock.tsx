import { View } from 'react-native';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: any;
}

/**
 * Minimal skeleton placeholder block for loading states.
 * Uses a soft pulsing gray background.
 */
export function SkeletonBlock({ width = '100%', height = 16, radius = 6, style }: SkeletonBlockProps) {
  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: '#E8EDF0',
        },
        style,
      ]}
    />
  );
}

/** Skeleton row: icon circle + two text lines */
export function SkeletonRow({ style }: { style?: any }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }, style]}>
      <SkeletonBlock width={44} height={44} radius={22} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBlock width="60%" height={14} />
        <SkeletonBlock width="40%" height={10} />
      </View>
    </View>
  );
}

/** Skeleton card: image placeholder + text lines */
export function SkeletonCard({ style }: { style?: any }) {
  return (
    <View style={[{
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E8EDF0',
      overflow: 'hidden',
    }, style]}>
      <SkeletonBlock width="100%" height={128} radius={0} />
      <View style={{ padding: 12, gap: 8 }}>
        <SkeletonBlock width="70%" height={14} />
        <SkeletonBlock width="40%" height={18} />
        <SkeletonBlock width="30%" height={10} />
      </View>
    </View>
  );
}
