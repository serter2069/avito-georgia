// Type declaration for @expo/vector-icons — the package ships without .d.ts files.
declare module '@expo/vector-icons' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  class Icon extends Component<IconProps> {
    static glyphMap: Record<string, number>;
  }

  export class Ionicons extends Icon {}
  export class MaterialIcons extends Icon {}
  export class MaterialCommunityIcons extends Icon {}
  export class FontAwesome extends Icon {}
  export class FontAwesome5 extends Icon {}
  export class Feather extends Icon {}
  export class AntDesign extends Icon {}
  export class Entypo extends Icon {}
  export class EvilIcons extends Icon {}
  export class Foundation extends Icon {}
  export class Octicons extends Icon {}
  export class SimpleLineIcons extends Icon {}
  export class Zocial extends Icon {}
}
