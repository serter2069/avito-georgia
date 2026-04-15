import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type PlaceholderType = 'avatar' | 'photo' | 'banner' | 'illustration';

interface ProtoPlaceholderImageProps {
  type: PlaceholderType;
  width?: number | string;
  height?: number | string;
  label?: string;
  style?: any;
}

const config: Record<PlaceholderType, {
  icon: React.ComponentProps<typeof Feather>['name'];
  bg: string;
  borderStyle?: 'solid' | 'dashed';
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | string;
  defaultAspect?: string;
}> = {
  avatar: {
    icon: 'user',
    bg: '#E5E7EB',
    borderRadius: 9999,
  },
  photo: {
    icon: 'image',
    bg: '#E5E7EB',
    borderRadius: 8,
  },
  banner: {
    icon: 'image',
    bg: '#D1D5DB',
    borderRadius: 8,
    defaultAspect: '16/6',
  },
  illustration: {
    icon: 'layers',
    bg: '#F3F4F6',
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderWidth: 1,
    borderRadius: 8,
  },
};

export function ProtoPlaceholderImage({
  type,
  width,
  height,
  label,
  style,
}: ProtoPlaceholderImageProps) {
  const cfg = config[type];
  const displayLabel = label ?? type;

  const containerStyle: any = {
    backgroundColor: cfg.bg,
    borderRadius: cfg.borderRadius ?? 8,
    borderStyle: cfg.borderStyle,
    borderColor: cfg.borderColor,
    borderWidth: cfg.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: width ?? '100%',
    ...(height != null
      ? { height }
      : type === 'avatar'
      ? { aspectRatio: 1 }
      : type === 'banner'
      ? { aspectRatio: 16 / 6 }
      : { aspectRatio: 1 }),
    ...style,
  };

  return (
    <View style={containerStyle}>
      <Feather name={cfg.icon} size={24} color="#9CA3AF" />
      <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 6 }}>
        {displayLabel}
      </Text>
    </View>
  );
}
