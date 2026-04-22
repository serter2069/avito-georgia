import { View } from 'react-native';

export function SkeletonBox({
  width,
  height,
  borderRadius = 6,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  return (
    <View style={[{
      width,
      height,
      borderRadius,
      backgroundColor: '#EBEBEB',
    }, style]} />
  );
}
